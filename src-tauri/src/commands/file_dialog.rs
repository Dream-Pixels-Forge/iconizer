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
