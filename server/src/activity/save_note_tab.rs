use rocket::serde::json::Json;
use rocket::serde::Deserialize;
use rocket::State;

use crate::data::note_tab::NoteTab;
use crate::data::note_tab_key::NoteTabKey;
use crate::Injectables;

#[post("/tab/<key>", format="json", data="<json>")]
pub fn save_note_tab(
    key: NoteTabKey, 
    json: Json<SaveNoteTabInput>, 
    injectables_state: &State<Injectables>
) {
    let input: SaveNoteTabInput = json.into_inner();
    let to_save = NoteTab::new(input.title, input.body)
        .to_string()
        .expect("could not unwrap notetab to save it");
    injectables_state.inner()
        .get_io()
        .put_string(key.get().to_string(), to_save)
        .expect("failed to write string");
}

#[derive(Deserialize)]
pub struct SaveNoteTabInput {
    title: String,
    body: String,
}

#[cfg(test)]
mod unittests {
    use super::*;
    use rocket;
    use rocket::local::blocking::Client;
    use rocket::http::ContentType;

    fn client() -> Client {
        let rocket = rocket::build().mount("/", routes![save_note_tab]);
        Client::tracked(rocket).expect("valid rocket")
    }

    #[test]
    fn hello_world() {
        let client = client();
        let response = client.post("/tab/test")
            .header(ContentType::JSON)
            .body(r#"{ "title": "ur mum", "body": "is nice" }"#)
            .dispatch();
        let code = response.status().code;
        assert!(matches!(200, code));
    }
}