use crate::error::RecorderError;
use crate::state::history::TimerSession;
use crate::utils::paths::get_app_data_dir;
use std::fs;
use std::path::PathBuf;

pub fn get_history_path() -> Result<PathBuf, RecorderError> {
    Ok(get_app_data_dir()?.join("history.json"))
}

pub fn load_history() -> Result<Vec<TimerSession>, RecorderError> {
    let path = get_history_path()?;
    if !path.exists() {
        return Ok(vec![]);
    }

    let contents = fs::read_to_string(&path)
        .map_err(|e| RecorderError::file_error(format!("Failed to read history: {e}")))?;

    let sessions = serde_json::from_str::<Vec<TimerSession>>(&contents)
        .map_err(|e| RecorderError::invalid_settings(format!("History file is corrupted ({path:?}): {e}")))?;

    Ok(sessions)
}

pub fn save_history(sessions: &[TimerSession]) -> Result<(), RecorderError> {
    let path = get_history_path()?;

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| RecorderError::file_error(format!("Failed to create history directory: {e}")))?;
    }

    let json = serde_json::to_string_pretty(sessions)
        .map_err(|e| RecorderError::invalid_settings(format!("Failed to serialize history: {e}")))?;

    fs::write(&path, json)
        .map_err(|e| RecorderError::file_error(format!("Failed to write history: {e}")))?;

    Ok(())
}
