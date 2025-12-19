use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SessionStatus {
    Completed,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerSession {
    pub id: String,
    pub started_at: String,
    pub ended_at: String,
    pub duration_seconds: u64,
    pub status: SessionStatus,
    pub output_file: Option<String>,
}
