// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod image;
mod file;
mod config;

use commands::*;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            image_processing::convert_image,
            image_processing::batch_convert,
            image_processing::get_image_metadata,
            file_dialog::select_folder,
            file_dialog::select_files,
            file_operations::open_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
