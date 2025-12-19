use crate::error::RecorderError;
use crate::state::app_state::{AppState, RecordingSettings};
use crate::utils::config::{get_default_recordings_path, load_config, save_config, AppConfig};
use std::sync::Arc;
use tauri::State;

/// Returns the current in-memory recording settings.
#[tauri::command]
pub async fn get_settings(state: State<'_, Arc<AppState>>) -> Result<RecordingSettings, RecorderError> {
    Ok(state.get_settings())
}

/// Updates the in-memory settings and persists them to `%APPDATA%\RecordFlow\config.json`.
#[tauri::command]
pub async fn update_settings(
    state: State<'_, Arc<AppState>>,
    settings: RecordingSettings,
) -> Result<(), RecorderError> {
    state.update_settings(settings.clone());

    let mut config: AppConfig = match load_config() {
        Ok(c) => c,
        Err(_) => AppConfig::default(),
    };

    config.last_settings = settings;
    if config.default_save_location.is_empty() {
        config.default_save_location = get_default_recordings_path()?.to_string_lossy().to_string();
    }
    save_config(&config)?;

    Ok(())
}
