#[macro_use] extern crate rocket;
#[macro_use] extern crate lazy_static;
use std::path::{Path, PathBuf};
use std::io::Result;
use data::injectables::Injectables;
use io::fileio::FileIo;
use io::iointerface::IoInterface;
use rocket::fs::NamedFile;

mod activity;
mod data;
mod io;

use crate::activity::{
    get_note_tab::get_note_tab,
    save_note_tab::save_note_tab,
};


fn get_page_directory_path() -> String {
    format!("{}/../client/build", env!("CARGO_MANIFEST_DIR"))
}

#[get("/<_..>")]
async fn index() -> Result<NamedFile> {
  NamedFile::open(Path::new(&get_page_directory_path()).join("index.html")).await
}

#[get("/static/<file..>")]
async fn webapp_files(file: PathBuf) -> Result<NamedFile> {
    let path = Path::new(&get_page_directory_path()).join("static").join(file);
    match path.to_str() {
        Some(ref s) => print!("fetching file {}", s),
        None => print!("there was no path to fetch :(")
    }
    NamedFile::open(path).await
}

#[get("/icon?<key>")]
async fn icon(key: Option<String>) -> Result<NamedFile> {
    match key {
        _ => NamedFile::open(Path::new(&get_page_directory_path()).join("favicon.ico")).await
    }
}

#[launch]
fn rocket() -> _ {
    let injectables = Injectables {
        ioio: FileIo::new_default()
    };
    rocket::build()
        .manage(injectables)
        .mount("/", routes![
            index,
            webapp_files,
            icon,
            get_note_tab,
            save_note_tab,
        ])
}