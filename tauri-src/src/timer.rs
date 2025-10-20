use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Phase {
    Focus,
    ShortBreak,
    LongBreak,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimerState {
    pub phase: Phase,
    pub remaining: u64,
    pub is_running: bool,
    pub started_at: Option<Instant>,
}

pub struct Timer {
    state: Arc<Mutex<TimerState>>,
}

impl Timer {
    pub fn new() -> Self {
        Timer {
            state: Arc::new(Mutex::new(TimerState {
                phase: Phase::Focus,
                remaining: 25 * 60, // 25 minutes default
                is_running: false,
                started_at: None,
            })),
        }
    }

    pub fn start(&self, duration: u64) {
        let mut state = self.state.lock().unwrap();
        state.remaining = duration;
        state.is_running = true;
        state.started_at = Some(Instant::now());
    }

    pub fn pause(&self) {
        let mut state = self.state.lock().unwrap();
        if let Some(started) = state.started_at {
            let elapsed = started.elapsed().as_secs();
            state.remaining = state.remaining.saturating_sub(elapsed);
        }
        state.is_running = false;
        state.started_at = None;
    }

    pub fn reset(&self, duration: u64) {
        let mut state = self.state.lock().unwrap();
        state.remaining = duration;
        state.is_running = false;
        state.started_at = None;
    }

    pub fn get_remaining(&self) -> u64 {
        let state = self.state.lock().unwrap();
        if let Some(started) = state.started_at {
            let elapsed = started.elapsed().as_secs();
            state.remaining.saturating_sub(elapsed)
        } else {
            state.remaining
        }
    }

    pub fn is_running(&self) -> bool {
        self.state.lock().unwrap().is_running
    }
}
