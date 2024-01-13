use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::fs::{File, OpenOptions};
use std::io::Error;
use crate::IoInterface;

pub struct FileIo {
    base_path: String,
}


impl FileIo {
    pub fn new(base_path: String) -> Self {
        Self {
            base_path: format!("{}/{}", env!("CARGO_MANIFEST_DIR"), base_path),
        }
    }

    pub fn new_default() -> Self {
        Self::new("userdata".to_string())
    }

    fn get_path(&self, address: String) -> PathBuf {
        Path::new(&self.base_path).join(address)
    }

    fn lazy_err(problem: String, err: Error) -> String {
        format!("Could not {}, got Error {}",
            problem, err)
    }
}

impl IoInterface for FileIo {
    fn get_string(&self, address: String) -> Result<String, String> {
        let path = self.get_path(address);
        let mut file = File::open(&path)
            .map_err(|err| {
                Self::lazy_err(
                    format!("open {}", path.to_str().unwrap_or("no path provided")), 
                    err)
            })?;
        let mut contents = String::new();
        let _ = file.read_to_string(&mut contents)
            .map_err(|err| {
                Self::lazy_err("read contents of file".to_string(), err)
            })?;
        Ok(contents)
    }

    fn put_string(&self, address: String, thing: String) -> Result<(),String> {
        let path = self.get_path(address);
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .open(&path)
            .map_err(|err| {
                Self::lazy_err(
                    format!("open in create/write mode {}", 
                        path.to_str().unwrap_or("no path provided")),
                    err)
            })?;
        let _ = write!(file, "{}", thing).map_err(|err| {
            Self::lazy_err("write to file".to_string(), err)
        })?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_fileio() -> FileIo {
        FileIo::new("testdir".to_string())
    }

    #[test]
    fn write_and_read() {
        let fileio = get_fileio();
        let file_name = "testFile.txt";
        let content = "hello there";
        fileio.put_string(file_name.to_string(), content.to_string()).unwrap();
        let new_content = fileio.get_string(file_name.to_string()).unwrap();
        assert!(matches!(content.to_string(), new_content))
    }
}