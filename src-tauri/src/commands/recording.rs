use crate::error::RecorderError;
use crate::recording::manager::RecordingManager;
use crate::recording::status::RecordingStatus;
use crate::utils::history::save_history;
use std::sync::Arc;
use tauri::Emitter;
use tauri::State;

/// Begin recording with the current settings.
#[tauri::command]
pub async fn start_recording(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    let path = state.inner().start_recording().await?;
    state.inner().start_tick_emitter(app);
    Ok(path)
}

/// Stop recording and return final status.
#[tauri::command]
pub async fn stop_recording(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<RecordingStatus, RecorderError> {
    let _path = state.inner().stop_recording().await?;

    if let Some(session) = state.inner().take_last_session() {
        state.inner().state.push_history(session);
        let sessions = state.inner().state.get_history();
        save_history(&sessions)?;
    }

    let status = state.inner().snapshot_status();
    let _ = app.emit("recording_status", status.clone());

    Ok(status)
}

/// Pause an in-progress recording.
#[tauri::command]
pub async fn pause_recording(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    let res = state.inner().pause_recording().await?;
    let _ = app.emit("recording_status", state.inner().snapshot_status());
    Ok(res)
}

/// Resume a paused recording.
#[tauri::command]
pub async fn resume_recording(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    let res = state.inner().resume_recording().await?;
    let _ = app.emit("recording_status", state.inner().snapshot_status());
    Ok(res)
}

/// Get current recording status (recording/paused/output/elapsed seconds).
#[tauri::command]
pub async fn get_recording_status(
    state: State<'_, Arc<RecordingManager>>,
) -> Result<RecordingStatus, RecorderError> {
    Ok(state.inner().snapshot_status())
}

// Alias commands for a "timer" app naming convention.
#[tauri::command]
pub async fn start_timer(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    start_recording(app, state).await
}

#[tauri::command]
pub async fn stop_timer(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<RecordingStatus, RecorderError> {
    stop_recording(app, state).await
}

#[tauri::command]
pub async fn pause_timer(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    pause_recording(app, state).await
}

#[tauri::command]
pub async fn resume_timer(
    app: tauri::AppHandle,
    state: State<'_, Arc<RecordingManager>>,
) -> Result<String, RecorderError> {
    resume_recording(app, state).await
}

#[tauri::command]
pub async fn get_timer_state(
    state: State<'_, Arc<RecordingManager>>,
) -> Result<RecordingStatus, RecorderError> {
    get_recording_status(state).await
}
