use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FolderSelectionResult {
    pub path: Option<String>,
    pub cancelled: bool,
}

/// Open folder selection dialog
#[command]
pub async fn select_folder(default_path: Option<String>) -> Result<FolderSelectionResult, String> {
    // TODO: Implement actual folder dialog using tauri-plugin-dialog
    Ok(FolderSelectionResult {
        path: default_path.or_else(|| Some("C:\\Users\\User\\Pictures".to_string())),
        cancelled: false,
    })
}

/// Open file selection dialog
#[command]
pub async fn select_file(filters: Option<Vec<String>>) -> Result<FolderSelectionResult, String> {
    // TODO: Implement actual file dialog
    Ok(FolderSelectionResult {
        path: None,
        cancelled: true,
    })
}
