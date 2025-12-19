#![allow(dead_code)]

use crate::error::RecorderError;
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{SampleFormat, StreamConfig};
use parking_lot::Mutex;
use std::collections::VecDeque;
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct AudioFrame {
    pub data: Vec<f32>,
    pub sample_rate: u32,
    pub channels: u16,
    pub timestamp: u64,
}

/// Placeholder microphone capture.
///
/// Captures PCM samples via `cpal` stream callbacks into a ring buffer.
pub struct MicrophoneCapture {
    sample_rate: u32,
    channels: u16,
    buffer: Arc<Mutex<VecDeque<i16>>>,
    _stream: cpal::Stream,
}

impl MicrophoneCapture {
    pub fn new(device_name: Option<&str>) -> Result<Self, RecorderError> {
        let host = cpal::default_host();

        let device = if let Some(name) = device_name.filter(|s| !s.trim().is_empty()) {
            let devices = host
                .input_devices()
                .map_err(|e| RecorderError::device_not_found(format!("Microphone ({e})")))?;
            devices
                .filter_map(|d| d.name().ok().map(|n| (d, n)))
                .find(|(_, n)| n == name)
                .map(|(d, _)| d)
                .or_else(|| host.default_input_device())
                .ok_or_else(|| RecorderError::device_not_found("Microphone"))?
        } else {
            host.default_input_device()
                .ok_or_else(|| RecorderError::device_not_found("Microphone"))?
        };

        let default_config = device
            .default_input_config()
            .map_err(|e| RecorderError::device_not_found(format!("Microphone ({e})")))?;

        let sample_format = default_config.sample_format();
        let cfg: StreamConfig = default_config.into();

        let sample_rate = cfg.sample_rate.0;
        let channels = cfg.channels;

        let buffer: Arc<Mutex<VecDeque<i16>>> = Arc::new(Mutex::new(VecDeque::new()));
        let max_samples: usize = (sample_rate as usize)
            .saturating_mul(channels as usize)
            .saturating_mul(10); // ~10s ring buffer

        let err_fn = |err| {
            eprintln!("RecordFlow: microphone stream error: {err}");
        };

        let buffer_for_cb = buffer.clone();
        let stream = match sample_format {
            SampleFormat::I16 => device
                .build_input_stream(
                    &cfg,
                    move |data: &[i16], _| {
                        let mut q = buffer_for_cb.lock();
                        for &s in data {
                            q.push_back(s);
                        }
                        while q.len() > max_samples {
                            q.pop_front();
                        }
                    },
                    err_fn,
                    None,
                )
                .map_err(|e| RecorderError::encoding_failed(e.to_string()))?,
            SampleFormat::U16 => device
                .build_input_stream(
                    &cfg,
                    move |data: &[u16], _| {
                        let mut q = buffer_for_cb.lock();
                        for &s in data {
                            q.push_back((s as i32 - 32768) as i16);
                        }
                        while q.len() > max_samples {
                            q.pop_front();
                        }
                    },
                    err_fn,
                    None,
                )
                .map_err(|e| RecorderError::encoding_failed(e.to_string()))?,
            SampleFormat::F32 => device
                .build_input_stream(
                    &cfg,
                    move |data: &[f32], _| {
                        let mut q = buffer_for_cb.lock();
                        for &s in data {
                            let s = (s.clamp(-1.0, 1.0) * i16::MAX as f32) as i16;
                            q.push_back(s);
                        }
                        while q.len() > max_samples {
                            q.pop_front();
                        }
                    },
                    err_fn,
                    None,
                )
                .map_err(|e| RecorderError::encoding_failed(e.to_string()))?,
            other => {
                return Err(RecorderError::invalid_settings(format!(
                    "Unsupported microphone sample format: {other:?}"
                )))
            }
        };

        stream
            .play()
            .map_err(|e| RecorderError::encoding_failed(e.to_string()))?;

        Ok(Self {
            sample_rate,
            channels,
            buffer,
            _stream: stream,
        })
    }

    pub fn sample_rate(&self) -> u32 {
        self.sample_rate
    }

    pub fn channels(&self) -> u16 {
        self.channels
    }

    pub fn take_pcm_i16(&self, sample_count: usize) -> Vec<i16> {
        let mut q = self.buffer.lock();
        let mut out = Vec::with_capacity(sample_count);
        for _ in 0..sample_count {
            out.push(q.pop_front().unwrap_or(0));
        }
        out
    }

    pub fn take_pcm_bytes_le(&self, sample_count: usize, volume: f32) -> Vec<u8> {
        let v = volume.clamp(0.0, 1.0);
        let samples = self.take_pcm_i16(sample_count);
        let mut out = Vec::with_capacity(samples.len() * 2);
        for s in samples {
            let scaled = (s as f32 * v).round().clamp(i16::MIN as f32, i16::MAX as f32) as i16;
            out.extend_from_slice(&scaled.to_le_bytes());
        }
        out
    }
}

pub struct AudioMixer {
    mic_volume: f32,
    system_volume: f32,
}

impl AudioMixer {
    pub fn new() -> Self {
        Self {
            mic_volume: 1.0,
            system_volume: 1.0,
        }
    }

    pub fn set_mic_volume(&mut self, volume: f32) {
        self.mic_volume = volume.clamp(0.0, 1.0);
    }

    pub fn set_system_audio_volume(&mut self, volume: f32) {
        self.system_volume = volume.clamp(0.0, 1.0);
    }

    pub fn mix(&self, mic_frame: &AudioFrame, system_frame: &AudioFrame) -> Result<AudioFrame, RecorderError> {
        if mic_frame.sample_rate != system_frame.sample_rate {
            return Err(RecorderError::invalid_settings("Sample rate mismatch"));
        }

        let len = mic_frame.data.len().max(system_frame.data.len());
        let mut out = Vec::with_capacity(len);

        for i in 0..len {
            let a = mic_frame.data.get(i).copied().unwrap_or(0.0) * self.mic_volume;
            let b = system_frame.data.get(i).copied().unwrap_or(0.0) * self.system_volume;
            out.push((a + b).clamp(-1.0, 1.0));
        }

        Ok(AudioFrame {
            data: out,
            sample_rate: mic_frame.sample_rate,
            channels: 2,
            timestamp: mic_frame.timestamp,
        })
    }
}
