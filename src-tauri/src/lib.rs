mod commands;
mod error;
mod recording;
mod state;
mod utils;

use crate::commands::devices::{get_audio_inputs, get_cameras, get_displays, get_system_audio_devices};
use crate::commands::files::{
    delete_recording, get_last_recording_info, open_recording_in_explorer, open_recordings_folder,
};
use crate::commands::history::{clear_timer_history, delete_timer_session, get_timer_history};
use crate::commands::recording::{
    get_recording_status, get_timer_state, pause_recording, pause_timer, resume_recording,
    resume_timer, start_recording, start_timer, stop_recording, stop_timer,
};
use crate::commands::settings::{get_settings, update_settings};
use crate::recording::manager::RecordingManager;
use crate::state::app_state::AppState;
use crate::utils::config::load_config;
use crate::utils::history::load_history;
use std::sync::Arc;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = Arc::new(AppState::new());
    let recording_manager = Arc::new(RecordingManager::new(app_state.clone()));
    match load_config() {
        Ok(cfg) => {
            app_state.update_settings(cfg.last_settings);
        }
        Err(err) => {
            eprintln!("RecordFlow: failed to load config, using defaults: {err}");
        }
    }

    match load_history() {
        Ok(history) => app_state.set_history(history),
        Err(err) => eprintln!("RecordFlow: failed to load history, starting empty: {err}"),
    }

    tauri::Builder::default()
        .manage(app_state)
        .manage(recording_manager)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            // Settings
            get_settings,
            update_settings,
            // Devices
            get_displays,
            get_cameras,
            get_audio_inputs,
            get_system_audio_devices,
            // Recording
            start_recording,
            stop_recording,
            pause_recording,
            resume_recording,
            get_recording_status,
            // Timer aliases
            start_timer,
            stop_timer,
            pause_timer,
            resume_timer,
            get_timer_state,
            // Files
            get_last_recording_info,
            open_recording_in_explorer,
            delete_recording,
            open_recordings_folder,
            // History
            get_timer_history,
            delete_timer_session,
            clear_timer_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
