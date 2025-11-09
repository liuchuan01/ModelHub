use sea_orm::DatabaseConnection;
use std::sync::Arc;

#[derive(Clone)]
pub struct Database {
    pub connection: Arc<DatabaseConnection>,
}

impl Database {
    pub fn new(connection: DatabaseConnection) -> Self {
        Self {
            connection: Arc::new(connection),
        }
    }

    pub fn get_connection(&self) -> &DatabaseConnection {
        &self.connection
    }
}
