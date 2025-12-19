use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecordingStatus {
    pub is_recording: bool,
    pub is_paused: bool,
    pub output_file: Option<String>,
    pub elapsed_seconds: u64,
}
