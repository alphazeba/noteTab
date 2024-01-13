use rand::{distributions::Alphanumeric, Rng};
use regex::Regex;
use rocket::request::FromParam;

lazy_static!{
    static ref KEY_FORMAT: Regex = Regex::new("^nt[a-zA-Z0-9]{15}$").unwrap();
}

pub struct NoteTabKey {
    key: String,
}

impl NoteTabKey {
    pub fn new() -> Self {
        NoteTabKey {
            key: Self::generate_valid_key(),
        }
    }

    fn is_valid_key(potential_key: &str) -> bool {
        KEY_FORMAT.is_match(potential_key)
    }

    fn generate_valid_key() -> String {
        let s: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(15)
            .map(char::from)
            .collect();
        format!("nt{}", s)
    }

    pub fn get(&self) -> &String {
        &self.key
    }
}

impl <'r> FromParam<'r> for NoteTabKey {
    type Error = String;

    fn from_param(param: &'r str) -> Result<Self, Self::Error> {
        if Self::is_valid_key(param) {
            return Ok(NoteTabKey {
                key: param.to_string()
            });
        }
        Err(format!("{} was not valid key" , param))
    }
}

#[cfg(test)]
mod unit_tests {
    use super::*;

}