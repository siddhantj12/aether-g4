use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Preferences {
    pub focus_duration: u64,
    pub short_break_duration: u64,
    pub long_break_duration: u64,
    pub sessions_until_long_break: u32,
    pub auto_start_breaks: bool,
    pub auto_start_focus: bool,
    pub sound_enabled: bool,
    pub sound_volume: f32,
    pub tick_sound_enabled: bool,
    pub notification_enabled: bool,
}

impl Default for Preferences {
    fn default() -> Self {
        Preferences {
            focus_duration: 25 * 60,
            short_break_duration: 5 * 60,
            long_break_duration: 15 * 60,
            sessions_until_long_break: 4,
            auto_start_breaks: false,
            auto_start_focus: false,
            sound_enabled: true,
            sound_volume: 0.7,
            tick_sound_enabled: false,
            notification_enabled: true,
        }
    }
}

fn get_config_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let mut path = dirs::config_dir().ok_or("Could not find config directory")?;
    path.push("flow");
    fs::create_dir_all(&path)?;
    path.push("preferences.json");
    Ok(path)
}

pub fn load_preferences() -> Result<Preferences, Box<dyn std::error::Error>> {
    let path = get_config_path()?;
    
    if !path.exists() {
        let prefs = Preferences::default();
        save_preferences(&prefs)?;
        return Ok(prefs);
    }

    let contents = fs::read_to_string(path)?;
    let prefs: Preferences = serde_json::from_str(&contents)?;
    Ok(prefs)
}

pub fn save_preferences(prefs: &Preferences) -> Result<(), Box<dyn std::error::Error>> {
    let path = get_config_path()?;
    let json = serde_json::to_string_pretty(prefs)?;
    fs::write(path, json)?;
    Ok(())
}
