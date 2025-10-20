// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_notification::NotificationExt;

mod timer;
mod preferences;

#[tauri::command]
fn start_timer(duration: u64, phase: String) -> Result<(), String> {
    println!("Starting timer: {} seconds, phase: {}", duration, phase);
    Ok(())
}

#[tauri::command]
fn pause_timer() -> Result<(), String> {
    println!("Pausing timer");
    Ok(())
}

#[tauri::command]
fn reset_timer() -> Result<(), String> {
    println!("Resetting timer");
    Ok(())
}

#[tauri::command]
fn skip_phase() -> Result<(), String> {
    println!("Skipping phase");
    Ok(())
}

#[tauri::command]
fn send_notification(title: String, body: String, app: tauri::AppHandle) -> Result<(), String> {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_preferences() -> Result<preferences::Preferences, String> {
    preferences::load_preferences().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_preferences(prefs: preferences::Preferences) -> Result<(), String> {
    preferences::save_preferences(&prefs).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // Note: Tauri v2 tray icon setup has changed
            // For now, we'll run without tray icon and add it back later
            // See: https://v2.tauri.app/develop/tray-icon/
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            start_timer,
            pause_timer,
            reset_timer,
            skip_phase,
            send_notification,
            get_preferences,
            save_preferences
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
