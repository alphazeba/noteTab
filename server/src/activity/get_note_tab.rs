use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;

#[get("/tab/<key>")]
pub fn get_note_tab(
    key: NoteTabKey,
    injectables_state: &State<Injectables>,
) -> Json<GetNoteTabOutput> {
    let note_tab = match injectables_state.notetab_io.get(&key) {
        Ok(note_tab) => note_tab,
        Err(err) => {
            println!("{:?}", err);
            NoteTab::new_empty()
        }
    };
    let response = GetNoteTabOutput::from_note_tab(note_tab);
    Json(response)
}

#[derive(Serialize)]
pub struct GetNoteTabOutput {
    title: String,
    body: String,
    locked: bool,
}

impl GetNoteTabOutput {
    pub fn from_note_tab(note_tab: NoteTab) -> Self {
        GetNoteTabOutput {
            title: note_tab.title,
            body: note_tab.body,
            locked: note_tab.locked,
        }
    }
}
