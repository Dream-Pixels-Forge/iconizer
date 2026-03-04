use tauri::command;
use tauri_plugin_dialog::DialogExt;

/// Open folder selection dialog
#[command]
pub async fn select_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    
    app.dialog()
        .file()
        .pick_folder(move |folder| {
            let _ = tx.send(folder.map(|p| p.to_string()));
        });

    rx.recv().map_err(|e| e.to_string())
}

/// Open file selection dialog for images
#[command]
pub async fn select_files(app: tauri::AppHandle, _filters: Vec<String>) -> Result<Vec<String>, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    
    app.dialog()
        .file()
        .add_filter("Images", &["png", "jpg", "jpeg", "webp", "ico", "bmp", "gif", "tiff", "svg"])
        .pick_files(move |files| {
            if let Some(files) = files {
                let paths: Vec<String> = files.iter().map(|f| f.to_string()).collect();
                let _ = tx.send(paths);
            } else {
                let _ = tx.send(vec![]);
            }
        });

    rx.recv().map_err(|e| e.to_string())
}
