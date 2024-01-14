pub trait IoInterface {
    fn get_string(&self, address: String) -> Result<String, String>;
    fn put_string(&self, address: String, thing: String) -> Result<(),String>;
    fn list_keys(&self) -> Result<Vec<String>, String>;
}