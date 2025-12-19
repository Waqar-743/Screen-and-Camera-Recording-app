use crate::error::RecorderError;
use crate::recording::screen_capturer::Frame;
use nokhwa::pixel_format::RgbFormat;
use nokhwa::utils::{ApiBackend, CameraFormat, CameraIndex, FrameFormat, RequestedFormat, RequestedFormatType, Resolution};
use nokhwa::Camera;

pub struct CameraCapturer {
    camera: Camera,
    frame_number: u64,
}

impl CameraCapturer {
    pub fn new(selected_camera: Option<String>) -> Result<Self, RecorderError> {
        let list = nokhwa::query(ApiBackend::Auto)
            .map_err(|e| RecorderError::device_not_found(format!("Camera ({e})")))?;

        if list.is_empty() {
            return Err(RecorderError::device_not_found("Camera"));
        }

        let selected = selected_camera.and_then(|s| s.parse::<usize>().ok());
        let chosen_index = match selected {
            Some(n) => {
                // Prefer matching the "real" camera index if it's numeric.
                let by_index = list.iter().find(|c| match c.index() {
                    CameraIndex::Index(i) => *i as usize == n,
                    _ => false,
                });
                by_index
                    .or_else(|| list.get(n))
                    .map(|c| c.index().clone())
                    .unwrap_or_else(|| list[0].index().clone())
            }
            None => list[0].index().clone(),
        };

        let requested_format = RequestedFormat::new::<RgbFormat>(RequestedFormatType::Closest(
            CameraFormat::new(Resolution::new(640, 480), FrameFormat::MJPEG, 30),
        ));

        let mut camera = Camera::new(chosen_index, requested_format)
            .map_err(|e| RecorderError::device_not_found(format!("Camera init failed ({e})")))?;

        camera
            .open_stream()
            .map_err(|e| RecorderError::device_not_found(format!("Camera open failed ({e})")))?;

        Ok(Self {
            camera,
            frame_number: 0,
        })
    }

    pub fn capture_frame(&mut self) -> Result<Frame, RecorderError> {
        self.frame_number += 1;

        let buffer = self
            .camera
            .frame()
            .map_err(|e| RecorderError::encoding_failed(format!("Camera frame failed: {e}")))?;

        let decoded = buffer
            .decode_image::<RgbFormat>()
            .map_err(|e| RecorderError::encoding_failed(format!("Camera decode failed: {e}")))?;

        let width = decoded.width();
        let height = decoded.height();
        let rgb = decoded.into_raw();

        let mut bgra = Vec::with_capacity(width as usize * height as usize * 4);
        for px in rgb.chunks_exact(3) {
            // rgb -> bgra
            bgra.push(px[2]);
            bgra.push(px[1]);
            bgra.push(px[0]);
            bgra.push(255);
        }

        Ok(Frame {
            data: bgra,
            width,
            height,
            timestamp: 0,
            frame_number: self.frame_number,
        })
    }

    pub fn stop(&mut self) {
        let _ = self.camera.stop_stream();
    }
}
