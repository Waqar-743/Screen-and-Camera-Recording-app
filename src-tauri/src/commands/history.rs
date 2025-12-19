use crate::error::RecorderError;
use crate::state::app_state::AppState;
use crate::state::history::TimerSession;
use crate::utils::history::save_history;
use std::sync::Arc;
use tauri::State;

#[tauri::command]
pub async fn get_timer_history(state: State<'_, Arc<AppState>>) -> Result<Vec<TimerSession>, RecorderError> {
    Ok(state.get_history())
}

#[tauri::command]
pub async fn delete_timer_session(
    state: State<'_, Arc<AppState>>,
    id: String,
) -> Result<Vec<TimerSession>, RecorderError> {
    state.delete_history(&id);
    let sessions = state.get_history();
    save_history(&sessions)?;
    Ok(sessions)
}

#[tauri::command]
pub async fn clear_timer_history(state: State<'_, Arc<AppState>>) -> Result<(), RecorderError> {
    state.clear_history();
    save_history(&[])?;
    Ok(())
}
