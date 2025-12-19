use crate::error::RecorderError;
use std::path::PathBuf;

pub fn get_app_data_dir() -> Result<PathBuf, RecorderError> {
    let base = dirs::data_dir().ok_or_else(|| {
        RecorderError::file_error("Could not resolve %APPDATA% directory (dirs::data_dir returned None)")
    })?;
    Ok(base.join("RecordFlow"))
}

pub fn get_default_recordings_path() -> Result<PathBuf, RecorderError> {
    let docs = dirs::document_dir().ok_or_else(|| {
        RecorderError::file_error(
            "Could not resolve Documents directory (dirs::document_dir returned None)",
        )
    })?;
    Ok(docs.join("RecordFlow").join("Recordings"))
}
