use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;

#[get("/listtabs")]
pub fn list_note_tabs(injectables_state: &State<Injectables>) -> Json<String> {
    let keys = injectables_state.inner().get_io().list_keys().unwrap();
    // Todo
    Json(keys.len().to_string())
}

#[derive(Serialize)]
pub struct ListNoteTabsOutput {
    items: Vec<KeyTitle>,
}

#[derive(Serialize)]
pub struct KeyTitle {
    key: String,
    title: String,
}