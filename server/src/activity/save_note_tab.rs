use rocket::serde::json::Json;
use rocket::serde::{Serialize, Deserialize};
use rocket::State;

use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;
use crate::Injectables;

#[post("/tab/new", format="json", data="<json>")]
pub fn save_new_note_tab(
    json: Json<SaveNoteTabInput>, 
    injectables_state: &State<Injectables>
) -> Json<SaveNoteTabOutput> {
    save_note_tab(NoteTabKey::new(), json, injectables_state)
}

#[post("/tab/<key>", format="json", data="<json>")]
pub fn save_note_tab(
    key: NoteTabKey, 
    json: Json<SaveNoteTabInput>, 
    injectables_state: &State<Injectables>
) -> Json<SaveNoteTabOutput> {
    let input: SaveNoteTabInput = json.into_inner();
    let to_save = NoteTab::new(input.title, input.body)
        .to_string()
        .expect("could not unwrap notetab to save it");
    injectables_state
        .get_io()
        .put_string(key.get(), &to_save)
        .expect("failed to write string");
    Json(SaveNoteTabOutput {
        key: key.get().to_string()
    })
}

#[derive(Deserialize)]
pub struct SaveNoteTabInput {
    title: String,
    body: String,
}

#[derive(Serialize)]
pub struct SaveNoteTabOutput {
    key: String,
}

#[cfg(test)]
mod unit_tests {
    use rocket;
    use rocket::local::blocking::Client;
    use rocket::http::ContentType;
    
    use crate::build_rocket;

    fn client() -> Client {
        let rocket = build_rocket();
        Client::tracked(rocket).expect("valid rocket")
    }

    #[test]
    fn hello_world() {
        let client = client();
        let response = client.post("/tab/test")
            .header(ContentType::JSON)
            .body(r#"{ "title": "ur mum", "body": "is nice" }"#)
            .dispatch();
        let _code = response.status().code;
        assert!(matches!(200, _code));
    }
}