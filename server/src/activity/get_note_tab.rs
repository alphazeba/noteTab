use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;

#[get("/tab/<key>")]
pub fn get_note_tab(key: NoteTabKey, injectables_state: &State<Injectables>) -> Json<GetNoteTabOutput> {
    let note_tab = match injectables_state
        .get_io()
        .get_string(key.get()) {
            Ok(json) => NoteTab::from_string(json)
                .expect("could not deserialize note tab"),
            Err(msg) => {
                // TODO instead of turning errors into strings, i should keep them as errors
                // if the file were in use or something, this would cause the file to be 
                // ignored even though it existed.
                println!("Could not load {}, got error ({}), returning new notetab",
                    key.get(),
                    msg,
                );
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
}

impl GetNoteTabOutput {
    pub fn from_note_tab(note_tab: NoteTab) -> Self {
        GetNoteTabOutput {
            title: note_tab.title,
            body: note_tab.body,
        }
    }
}