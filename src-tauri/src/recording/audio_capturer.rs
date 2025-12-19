#![allow(dead_code)]

use crate::error::RecorderError;

#[derive(Debug, Clone)]
pub struct AudioFrame {
    pub data: Vec<f32>,
    pub sample_rate: u32,
    pub channels: u16,
    pub timestamp: u64,
}

/// Placeholder microphone capture.
///
/// Full implementation will use `cpal` stream callbacks and a ring buffer.
pub struct MicrophoneCapture {
    _device_index: u32,
}

impl MicrophoneCapture {
    pub fn new(device_index: u32) -> Result<Self, RecorderError> {
        Ok(Self {
            _device_index: device_index,
        })
    }

    pub fn start_capture(&mut self) -> Result<(), RecorderError> {
        Ok(())
    }

    pub fn get_audio_frame(&mut self) -> Result<AudioFrame, RecorderError> {
        Ok(AudioFrame {
            data: Vec::new(),
            sample_rate: 48_000,
            channels: 2,
            timestamp: 0,
        })
    }

    pub fn stop(&mut self) {}
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
