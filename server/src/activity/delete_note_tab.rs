use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;

use crate::data::injectables::Injectables;
use crate::data::note_tab_key::NoteTabKey;

#[delete("/tab/<key>")]
pub fn delete_note_tab(
    key: NoteTabKey,
    injectables_state: &State<Injectables>,
) -> Json<DeleteNoteTabOutput> {
    // check if the item is locked.
    // ioio.get_string(address)
    let notetab = match injectables_state.notetab_io.get(&key) {
        Ok(note_tab) => note_tab,
        Err(err) => panic!("{:?}", err),
    };
    if notetab.locked {
        println!("note tab is locked, it cannot be deleted");
        return Json(DeleteNoteTabOutput {
            key_is_gone: false,
            key_is_locked: true,
        })
    }
    let success = match injectables_state.notetab_io.delete(&key) {
        Ok(_) => true,
        Err(err) => {
            println!("{:?}", err);
            false
        }
    };
    Json(DeleteNoteTabOutput {
        key_is_gone: success,
        key_is_locked: false,
    })
}

#[derive(Serialize)]
pub struct DeleteNoteTabOutput {
    key_is_gone: bool, // trying to delete a key that does not exist will return true
    key_is_locked: bool,
}
