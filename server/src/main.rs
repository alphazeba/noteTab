#[macro_use]
extern crate rocket;
#[macro_use]
extern crate lazy_static;
use activity::delete_note_tab::delete_note_tab;
use activity::validate_key::validate_key;
use data::injectables::Injectables;
use io::note_tab_io::NoteTabIo;
use io::string_io_file_impl::FileIo;
use rocket::fs::NamedFile;
use rocket::{Build, Rocket};
use std::io::Result;
use std::path::{Path, PathBuf};

mod activity;
mod data;
mod io;

use crate::activity::{
    get_note_tab::get_note_tab, list_note_tabs::list_note_tabs, save_note_tab::save_new_note_tab,
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
    let path = Path::new(&get_page_directory_path())
        .join("static")
        .join(file);
    match path.to_str() {
        Some(s) => print!("fetching file {}", s),
        None => print!("there was no path to fetch :("),
    }
    NamedFile::open(path).await
}

#[get("/foldericon.svg")]
async fn folder_icon() -> Result<NamedFile> {
    let path = Path::new(&get_page_directory_path()).join("foldericon.svg");
    match path.to_str() {
        Some(s) => print!("fetching file {}", s),
        None => print!("there was no path to fetch :("),
    }
    NamedFile::open(path).await
}

#[get("/icon?<key>")]
async fn icon(key: Option<String>) -> Result<NamedFile> {
    match key {
        _ => NamedFile::open(Path::new(&get_page_directory_path()).join("favicon.ico")).await,
    }
}

#[launch]
fn build_rocket() -> Rocket<Build> {
    let injectables = Injectables {
        notetab_io: Box::new(NoteTabIo::new(Box::new(FileIo::new(format!(
            "{}/{}",
            env!("HOME"),
            ".notetab/tabs"
        ))))),
    };
    rocket::build().manage(injectables).mount(
        "/",
        routes![
            index,
            webapp_files,
            folder_icon,
            icon,
            get_note_tab,
            save_note_tab,
            save_new_note_tab,
            list_note_tabs,
            delete_note_tab,
            validate_key,
        ],
    )
}
