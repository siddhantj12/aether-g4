// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};
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
    // Create system tray menu
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "Show Flow"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("start".to_string(), "Start Timer"))
        .add_item(CustomMenuItem::new("pause".to_string(), "Pause Timer"))
        .add_item(CustomMenuItem::new("reset".to_string(), "Reset Timer"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                "start" => {
                    // Emit event to frontend
                    app.emit_all("tray-start", ()).unwrap();
                }
                "pause" => {
                    app.emit_all("tray-pause", ()).unwrap();
                }
                "reset" => {
                    app.emit_all("tray-reset", ()).unwrap();
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
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
