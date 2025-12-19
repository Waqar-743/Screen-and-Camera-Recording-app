use crate::error::RecorderError;
use crate::state::app_state::RecordingSettings;
use crate::utils::paths::{get_app_data_dir, get_default_recordings_path as paths_default_recordings_path};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub last_settings: RecordingSettings,
    pub default_save_location: String,
    pub window_size: (u32, u32),
    pub theme: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        let save_location = paths_default_recordings_path()
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or_else(|_| String::new());

        Self {
            last_settings: RecordingSettings::default(),
            default_save_location: save_location,
            window_size: (600, 700),
            theme: "light".to_string(),
        }
    }
}

pub fn get_config_path() -> Result<PathBuf, RecorderError> {
    Ok(get_app_data_dir()?.join("config.json"))
}

pub fn load_config() -> Result<AppConfig, RecorderError> {
    let path = get_config_path()?;
    if !path.exists() {
        return Ok(AppConfig::default());
    }

    let contents = fs::read_to_string(&path)
        .map_err(|e| RecorderError::file_error(format!("Failed to read config: {}", e)))?;

    serde_json::from_str::<AppConfig>(&contents).map_err(|e| {
        RecorderError::invalid_settings(format!(
            "Config file is corrupted or invalid JSON ({}): {}",
            path.to_string_lossy(),
            e
        ))
    })
}

pub fn save_config(config: &AppConfig) -> Result<(), RecorderError> {
    let path = get_config_path()?;

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| RecorderError::file_error(format!("Failed to create config directory: {}", e)))?;
    }

    let json = serde_json::to_string_pretty(config)
        .map_err(|e| RecorderError::invalid_settings(format!("Failed to serialize config: {}", e)))?;

    fs::write(&path, json)
        .map_err(|e| RecorderError::file_error(format!("Failed to write config: {}", e)))?;
    Ok(())
}

pub fn get_default_recordings_path() -> Result<PathBuf, RecorderError> {
    let recordings = paths_default_recordings_path()?;
    fs::create_dir_all(&recordings).map_err(|e| {
        RecorderError::file_error(format!(
            "Failed to create recordings directory ({}): {}",
            recordings.to_string_lossy(),
            e
        ))
    })?;
    Ok(recordings)
}
