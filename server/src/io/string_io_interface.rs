pub trait StringIoInterface: Send + Sync {
    fn get_string(&self, address: &str) -> Result<String, String>;
    fn put_string(&self, address: &str, thing: &str) -> Result<(), String>;
    fn list_keys(&self) -> Result<Vec<String>, String>;
    fn delete(&self, address: &str) -> Result<DeleteOutcome, String>;
}

pub enum DeleteOutcome {
    Deleted,
    DidNotExist,
}
