use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab_key::NoteTabKey;

#[get("/valid/<key>")]
pub fn validate_key(
    key: NoteTabKey,
    injectables_state: &State<Injectables>,
) -> Json<ValidateKeyOutput> {
    let exists: bool = match injectables_state.notetab_io.get(&key) {
        Ok(_) => true,
        Err(_) => false,
    };
    Json(ValidateKeyOutput { valid: !exists })
}

#[derive(Serialize)]
pub struct ValidateKeyOutput {
    valid: bool,
}
