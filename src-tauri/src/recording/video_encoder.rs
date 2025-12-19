use crate::error::RecorderError;
use std::time::Instant;
use windows::Win32::Foundation::S_FALSE;
use windows::Win32::System::WinRT::{RoInitialize, RO_INIT_MULTITHREADED};
use windows_capture::encoder::{
    AudioSettingsBuilder, ContainerSettingsBuilder, VideoEncoder as WcVideoEncoder,
    VideoSettingsBuilder, VideoSettingsSubType,
};

fn flip_vertical_bgra(src: &[u8], width: u32, height: u32, dst: &mut Vec<u8>) {
    let row = width as usize * 4;
    let expected = row * height as usize;
    if dst.len() != expected {
        dst.resize(expected, 0);
    }

    for y in 0..height as usize {
        let src_off = y * row;
        let dst_off = (height as usize - 1 - y) * row;
        dst[dst_off..dst_off + row].copy_from_slice(&src[src_off..src_off + row]);
    }
}

pub struct VideoEncoder {
    inner: Option<WcVideoEncoder>,
    width: u32,
    height: u32,
    started_at: Instant,
    scratch: Vec<u8>,
}

impl VideoEncoder {
    pub fn new(output_path: &str, width: u32, height: u32, fps: u32, bitrate_kbps: u32) -> Result<Self, RecorderError> {
        if width == 0 || height == 0 || fps == 0 {
            return Err(RecorderError::invalid_settings("Invalid video settings"));
        }

        // windows-capture encoder uses WinRT types (MediaTranscoder/StorageFile).
        // Ensure the current thread is initialized for WinRT (MTA).
        match unsafe { RoInitialize(RO_INIT_MULTITHREADED) } {
            Ok(_) => {}
            Err(e) if e.code() == S_FALSE => {}
            Err(e) => return Err(RecorderError::encoding_failed(e.to_string())),
        }

        let video_settings = VideoSettingsBuilder::new(width, height)
            .sub_type(VideoSettingsSubType::H264)
            .frame_rate(fps)
            .bitrate(bitrate_kbps.saturating_mul(1000));

        let encoder = WcVideoEncoder::new(
            video_settings,
            AudioSettingsBuilder::default().disabled(true),
            ContainerSettingsBuilder::default(),
            output_path,
        )
        .map_err(|e| RecorderError::encoding_failed(e.to_string()))?;

        Ok(Self {
            inner: Some(encoder),
            width,
            height,
            started_at: Instant::now(),
            scratch: Vec::new(),
        })
    }

    pub fn encode_frame(&mut self, bgra_top_to_bottom: &[u8]) -> Result<(), RecorderError> {
        let expected = self.width as usize * self.height as usize * 4;
        if bgra_top_to_bottom.len() != expected {
            return Err(RecorderError::invalid_settings(format!(
                "Invalid frame size: got {}, expected {}",
                bgra_top_to_bottom.len(),
                expected
            )));
        }

        // windows-capture expects BGRA, bottom-to-top.
        flip_vertical_bgra(bgra_top_to_bottom, self.width, self.height, &mut self.scratch);

        let elapsed = self.started_at.elapsed();
        let timestamp_100ns = (elapsed.as_nanos() / 100) as i64;

        let enc = self
            .inner
            .as_mut()
            .ok_or_else(|| RecorderError::encoding_failed("Encoder is finalized"))?;

        enc
            .send_frame_buffer(&self.scratch, timestamp_100ns)
            .map_err(|e| RecorderError::encoding_failed(e.to_string()))?;

        Ok(())
    }

    pub fn finalize(&mut self) -> Result<(), RecorderError> {
        let enc = self
            .inner
            .take()
            .ok_or_else(|| RecorderError::encoding_failed("Encoder is already finalized"))?;
        enc
            .finish()
            .map_err(|e| RecorderError::encoding_failed(e.to_string()))?;
        Ok(())
    }
}
