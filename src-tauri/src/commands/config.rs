use tauri::command;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Serialize, Deserialize, Clone)]
// Settings management (unused but kept for future use)
#[allow(dead_code)]
pub struct AppSettings {
    pub theme: String,
    pub default_output_path: Option<String>,
    pub default_organization: String,
    pub remember_last_path: bool,
    pub open_folder_after_completion: bool,
    pub max_concurrent_jobs: u8,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            default_output_path: None,
            default_organization: "flat".to_string(),
            remember_last_path: true,
            open_folder_after_completion: true,
            max_concurrent_jobs: 4,
        }
    }
}

// Settings management (unused but kept for future use)
#[allow(dead_code)]
pub struct SettingsState(Mutex<AppSettings>);

/// Get current settings
// Settings management (unused but kept for future use)
#[allow(dead_code)]
#[command]
pub fn get_settings(state: State<SettingsState>) -> Result<AppSettings, String> {
    let settings = state.0.lock().map_err(|e| e.to_string())?;
    Ok(settings.clone())
}

/// Save settings
// Settings management (unused but kept for future use)
#[allow(dead_code)]
#[command]
pub fn save_settings(settings: AppSettings, state: State<SettingsState>) -> Result<(), String> {
    let mut current = state.0.lock().map_err(|e| e.to_string())?;
    *current = settings;
    Ok(())
}
