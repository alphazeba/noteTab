use std::fs::{read_dir, remove_file, File, OpenOptions};
use std::io::Error;
use std::io::ErrorKind;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

use super::string_io_interface::{DeleteOutcome, StringIoInterface};

pub struct FileIo {
    base_path: String,
}

impl FileIo {
    pub fn new(base_path: String) -> Self {
        Self { base_path }
    }

    fn get_path(&self, address: &str) -> PathBuf {
        Path::new(&self.base_path).join(address)
    }

    fn lazy_err(problem: String, err: Error) -> String {
        format!("Could not {}, got Error {}", problem, err)
    }
}

impl StringIoInterface for FileIo {
    fn get_string(&self, address: &str) -> Result<String, String> {
        let path = self.get_path(address);
        let mut file = File::open(&path).map_err(|err| {
            Self::lazy_err(
                format!("open {}", path.to_str().unwrap_or("no path provided")),
                err,
            )
        })?;
        let mut contents = String::new();
        let _ = file
            .read_to_string(&mut contents)
            .map_err(|err| Self::lazy_err("read contents of file".to_string(), err))?;
        Ok(contents)
    }

    fn put_string(&self, address: &str, thing: &str) -> Result<(), String> {
        let path = self.get_path(address);
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true) // erases the file before writing
            .create(true)
            .open(&path)
            .map_err(|err| {
                Self::lazy_err(
                    format!(
                        "open in create/write mode {}",
                        path.to_str().unwrap_or("no path provided")
                    ),
                    err,
                )
            })?;
        let _ = write!(file, "{}", thing)
            .map_err(|err| Self::lazy_err("write to file".to_string(), err))?;
        Ok(())
    }

    fn delete(&self, address: &str) -> Result<DeleteOutcome, String> {
        let path = self.get_path(address);
        match remove_file(&path) {
            Ok(()) => Ok(DeleteOutcome::Deleted),
            Err(e) if e.kind() == ErrorKind::NotFound => Ok(DeleteOutcome::DidNotExist),
            Err(e) => Err(format!(
                "could delete file {} because of {}",
                path.to_str().unwrap_or("no path"),
                e.to_string()
            )),
        }
    }

    fn list_keys(&self) -> Result<Vec<String>, String> {
        let paths = read_dir(self.base_path.to_string()).map_err(|err| {
            format!(
                "failed to read base_path {}, due to {}",
                self.base_path.to_string(),
                err.to_string()
            )
        })?;
        let mut output = Vec::<String>::new();
        for path in paths {
            let os_string = path
                .map_err(|err| format!("couldn't check the path {}", err.to_string()))?
                .file_name();
            let key = match os_string.to_str() {
                Some(str) => str.to_string(),
                None => {
                    println!("could not turn one of the file names to a str");
                    continue;
                }
            };
            output.push(key);
        }
        Ok(output)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_fileio() -> FileIo {
        FileIo::new(format!("{}/{}", env!("CARGO_MANIFEST_DIR"), "testdir"))
    }

    #[test]
    fn write_and_read() {
        let fileio = get_fileio();
        let file_name = "testFile.txt";
        let content = "hello there";
        fileio.put_string(file_name, content).unwrap();
        let _new_content = fileio.get_string(file_name).unwrap();
        assert!(matches!(content.to_string(), _new_content))
    }
}
