use crate::data::{note_tab::NoteTab, note_tab_key::NoteTabKey};

use super::string_io_interface::{DeleteOutcome, StringIoInterface};

pub struct NoteTabIo {
    io: Box<dyn StringIoInterface>,
}

#[derive(Debug)]
pub enum NoteTabIoErr {
    IoFailure,
    ParsingFailure(String),
}

impl NoteTabIo {
    pub fn new(string_io: Box<dyn StringIoInterface>) -> Self {
        Self { io: string_io }
    }

    pub fn get(&self, key: &NoteTabKey) -> Result<NoteTab, NoteTabIoErr> {
        let json = self.io.get_string(key.get()).map_err(|err| {
            println!(
                "Could not load {}, got error ({}), returning new notetab",
                key.get(),
                err,
            );
            NoteTabIoErr::IoFailure
        })?;
        Ok(NoteTab::from_string(json).map_err(|err| {
            println!("{}", err);
            NoteTabIoErr::ParsingFailure(err)
        })?)
    }

    pub fn save(&self, key: &NoteTabKey, note_tab: NoteTab) -> Result<(), NoteTabIoErr> {
        let to_save = note_tab
            .to_string()
            .map_err(|err| NoteTabIoErr::ParsingFailure(err))?;
        self.io
            .put_string(key.get(), &to_save)
            .map_err(|_| NoteTabIoErr::IoFailure)
    }

    pub fn delete(&self, key: &NoteTabKey) -> Result<DeleteOutcome, NoteTabIoErr> {
        self.io
            .delete(key.get())
            .map_err(|_| NoteTabIoErr::IoFailure)
    }

    pub fn list_keys(&self) -> Result<Vec<NoteTabKey>, NoteTabIoErr> {
        let keys = self.io.list_keys().map_err(|_| NoteTabIoErr::IoFailure)?;
        Ok(keys
            .into_iter()
            .map(|key| NoteTabKey::from_known_key(key))
            .collect())
    }
}
