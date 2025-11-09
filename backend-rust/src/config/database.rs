use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::time::Duration;

pub async fn create_connection(
    database_url: &str,
    max_connections: u32,
) -> anyhow::Result<DatabaseConnection> {
    let mut opt = ConnectOptions::new(database_url.to_string());
    opt.max_connections(max_connections)
        .connect_timeout(Duration::from_secs(10))
        .idle_timeout(Duration::from_secs(600))
        .max_lifetime(Duration::from_secs(7200))
        .sqlx_logging(true)
        .sqlx_logging_level(tracing::log::LevelFilter::Debug);

    let db = Database::connect(opt).await?;
    Ok(db)
}
