use crate::io::{iointerface::IoInterface, fileio::FileIo};

pub struct Injectables {
    pub ioio: FileIo,
}

impl Injectables {
    pub fn get_io(&self) -> &dyn IoInterface {
        &self.ioio
    }
}