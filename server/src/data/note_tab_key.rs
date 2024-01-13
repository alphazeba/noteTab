use regex::Regex;
use rocket::request::FromParam;


pub struct NoteTabKey {
    key: String,
}
lazy_static!{
    static ref KEY_FORMAT: Regex = Regex::new("^nt[a-zA-Z0-9]{15}$").unwrap();
}

impl NoteTabKey {
    fn is_valid_key(potential_key: &str) -> bool {
        KEY_FORMAT.is_match(potential_key)
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