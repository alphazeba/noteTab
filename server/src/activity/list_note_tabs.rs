use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab::NoteTab;
use crate::io::iointerface::IoInterface;

#[get("/listtabs")]
pub fn list_note_tabs(
    injectables_state: &State<Injectables>
) -> Json<ListNoteTabsOutput> {
    let io = injectables_state.get_io();
    let keys = io.list_keys().unwrap();
    let mut items: Vec<KeyTitle> = Vec::new();
    for key in keys {
        match get_key_title(&key, io) {
            Ok(key_title) => items.push(key_title),
            Err(msg) => println!("could not get keyTitle for key {}, got err {}",
                key.to_string(), msg)
        };
    }
    items.sort_by(|a, b| sort_form(&a.title).cmp(&sort_form(&b.title)));
    Json(ListNoteTabsOutput {
        items
    })
}

fn sort_form(title: &String) -> String {
    title.to_lowercase()
}

fn get_key_title(key: &String, io: &dyn IoInterface) -> Result<KeyTitle, String> {
    let note_tab = NoteTab::from_string(io.get_string(key)?)?;
    Ok(KeyTitle {
        key: key.to_string(),
        title: note_tab.title,
    })
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