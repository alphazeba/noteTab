use rocket::serde::{Serialize, Deserialize};
use rocket::serde::json::serde_json;

#[derive(Serialize, Deserialize)]
pub struct NoteTab {
    pub title: String,
    pub body: String,
    pub version: u32,
}

impl NoteTab {
    pub fn new(title: String, body: String) -> Self {
        NoteTab {
            title,
            body,
            version: 0, // this doesn't do anything yet
        }
    }

    pub fn new_empty() -> Self {
        Self::new("NoteTab".to_string(), "".to_string())
    }

    pub fn from_string(json: String) -> Result<Self, String> {
        serde_json::from_str(&json)
            .map_err(|err| {
                format!("failed to deserialize note tab with err: {}", err.to_string())
            })
    }

    pub fn to_string(&self) -> Result<String, String> {
        serde_json::to_string(self)
            .map_err(|err| {
                format!("Failed to serialize notetabwith err: {}", err.to_string())
            })
    }
}