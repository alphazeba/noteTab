use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab_key::NoteTabKey;

#[delete("/tab/<key>")]
pub fn delete_note_tab(
    key: NoteTabKey, 
    injectables_state: &State<Injectables>
) -> Json<DeleteNoteTabOutput> {
    let ioio = injectables_state.get_io();
    let success = match ioio.delete(key.get()) {
        Ok(_) => true,
        Err(e) => {
            println!("deleted resulted in error: {}",e);
            false
        }
    };
    Json(DeleteNoteTabOutput {
        key_is_gone: success,
    })
}

#[derive(Serialize)]
pub struct DeleteNoteTabOutput {
    key_is_gone: bool, // trying to delete a key that does not exist will return true
}