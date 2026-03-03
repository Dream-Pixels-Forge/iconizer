use tauri::command;
use serde::{Deserialize, Serialize};

/// Open folder in system file manager
#[command]
pub async fn open_folder(path: String) -> Result<(), String> {
    // TODO: Implement using tauri-plugin-shell
    println!("Opening folder: {}", path);
    Ok(())
}
