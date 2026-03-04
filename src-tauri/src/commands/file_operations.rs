use tauri::command;
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationResult {
    pub success: bool,
    pub message: Option<String>,
    pub error: Option<String>,
}

/// Open folder in system file manager
#[command]
pub async fn open_folder(path: String) -> Result<OperationResult, String> {
    let result = match std::env::consts::OS {
        "windows" => Command::new("explorer").arg(&path).spawn(),
        "macos" => Command::new("open").arg(&path).spawn(),
        "linux" => Command::new("xdg-open").arg(&path).spawn(),
        _ => Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "Unsupported platform",
        )),
    };

    match result {
        Ok(_) => Ok(OperationResult {
            success: true,
            message: Some(format!("Opened folder: {}", path)),
            error: None,
        }),
        Err(e) => Ok(OperationResult {
            success: false,
            message: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Create directory if it doesn't exist
#[command]
// File operation utilities (unused but kept for future use)
#[allow(dead_code)]
pub async fn create_directory(path: String) -> Result<OperationResult, String> {
    match std::fs::create_dir_all(&path) {
        Ok(_) => Ok(OperationResult {
            success: true,
            message: Some(format!("Created directory: {}", path)),
            error: None,
        }),
        Err(e) => Ok(OperationResult {
            success: false,
            message: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Check if file exists
#[command]
// File operation utilities (unused but kept for future use)
#[allow(dead_code)]
pub async fn file_exists(path: String) -> Result<bool, String> {
    Ok(std::path::Path::new(&path).exists())
}

/// Get file info (size, modified date, etc.)
// File operation utilities (unused but kept for future use)
#[allow(dead_code)]
#[command]
pub async fn get_file_info(path: String) -> Result<serde_json::Value, String> {
    let metadata = std::fs::metadata(&path)
        .map_err(|e| e.to_string())?;

    let info = serde_json::json!({
        "size": metadata.len(),
        "is_file": metadata.is_file(),
        "is_dir": metadata.is_dir(),
        "modified": metadata.modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_millis() as u64),
    });

    Ok(info)
}
