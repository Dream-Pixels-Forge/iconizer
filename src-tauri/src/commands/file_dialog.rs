use tauri::command;
use serde::{Deserialize, Serialize};
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct FolderSelectionResult {
    pub path: Option<String>,
    pub cancelled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileSelectionResult {
    pub paths: Vec<String>,
    pub cancelled: bool,
}

/// Open folder selection dialog
#[command]
pub async fn select_folder(default_path: Option<String>) -> Result<FolderSelectionResult, String> {
    let app_handle = tauri::AppHandle::get_current().ok_or("App handle not available")?;
    
    let folder = app_handle
        .dialog()
        .file()
        .pick_folder();

    match folder {
        Some(path) => Ok(FolderSelectionResult {
            path: Some(path.to_string()),
            cancelled: false,
        }),
        None => Ok(FolderSelectionResult {
            path: None,
            cancelled: true,
        }),
    }
}

/// Open file selection dialog for images
#[command]
pub async fn select_files(filters: Option<Vec<String>>) -> Result<FileSelectionResult, String> {
    let app_handle = tauri::AppHandle::get_current().ok_or("App handle not available")?;
    
    let files = app_handle
        .dialog()
        .file()
        .add_filter("Images", &filters.unwrap_or_else(|| vec![
            "png".to_string(),
            "jpg".to_string(),
            "jpeg".to_string(),
            "webp".to_string(),
            "bmp".to_string(),
            "gif".to_string(),
            "tiff".to_string(),
            "svg".to_string(),
        ]))
        .pick_files();

    let paths: Vec<String> = files
        .into_iter()
        .map(|p| p.to_string())
        .collect();

    Ok(FileSelectionResult {
        paths,
        cancelled: paths.is_empty(),
    })
}
