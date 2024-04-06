use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::State;

use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;
use crate::Injectables;

#[post("/tab/new", format = "json", data = "<json>")]
pub fn save_new_note_tab(
    json: Json<SaveNoteTabInput>,
    injectables_state: &State<Injectables>,
) -> Json<SaveNoteTabOutput> {
    save_note_tab(NoteTabKey::new(), json, injectables_state)
}

#[post("/tab/<key>", format = "json", data = "<json>")]
pub fn save_note_tab(
    key: NoteTabKey,
    json: Json<SaveNoteTabInput>,
    injectables_state: &State<Injectables>,
) -> Json<SaveNoteTabOutput> {
    let input: SaveNoteTabInput = json.into_inner();
    match injectables_state.notetab_io.save(&key, input.to_note_tab()) {
        Ok(_) => (),
        Err(err) => {
            panic!("{:?}", err)
        }
    }
    Json(SaveNoteTabOutput {
        key: key.get().to_string(),
    })
}

#[derive(Deserialize)]
pub struct SaveNoteTabInput {
    title: String,
    body: String,
    locked: bool,
}

impl SaveNoteTabInput {
    pub fn to_note_tab(self) -> NoteTab {
        NoteTab::new(self.title, self.body, self.locked)
    }
}

#[derive(Serialize)]
pub struct SaveNoteTabOutput {
    key: String,
}

#[cfg(test)]
mod unit_tests {
    use rocket;
    use rocket::http::ContentType;
    use rocket::local::blocking::Client;

    use crate::build_rocket;

    fn client() -> Client {
        let rocket = build_rocket();
        Client::tracked(rocket).expect("valid rocket")
    }

    #[test]
    fn hello_world() {
        let client = client();
        let response = client
            .post("/tab/test")
            .header(ContentType::JSON)
            .body(r#"{ "title": "ur mum", "body": "is nice" }"#)
            .dispatch();
        let _code = response.status().code;
        assert!(matches!(200, _code));
    }
}
