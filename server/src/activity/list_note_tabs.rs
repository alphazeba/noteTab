use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;

#[get("/listtabs")]
pub fn list_note_tabs(injectables_state: &State<Injectables>) -> Json<ListNoteTabsOutput> {
    let keys = injectables_state.notetab_io.list_keys().unwrap();
    let mut items: Vec<KeyTitle> = Vec::with_capacity(keys.len());
    for key in keys {
        match injectables_state.notetab_io.get(&key) {
            Ok(note_tab) => items.push(KeyTitle {
                key: key.get().to_string(),
                title: note_tab.title,
                locked: note_tab.locked,
            }),
            Err(err) => println!("{:?}", err),
        }
    }
    items.sort_by(|a, b| sort_form(&a.title).cmp(&sort_form(&b.title)));
    Json(ListNoteTabsOutput { items })
}

fn sort_form(title: &String) -> String {
    title.to_lowercase()
}

#[derive(Serialize)]
pub struct ListNoteTabsOutput {
    items: Vec<KeyTitle>,
}

#[derive(Serialize)]
pub struct KeyTitle {
    key: String,
    title: String,
    locked: bool,
}
