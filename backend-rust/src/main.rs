mod config;
mod domain;
mod infrastructure;
mod presentation;
mod services;

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 初始化日志
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "backend=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 加载配置
    let config = config::Config::from_env()?;
    tracing::info!("配置加载成功: {:?}", config);

    // 创建路由
    let app = presentation::routes::create_routes(config.clone());

    // 启动服务器
    let bind_addr = (config.server.host.as_str(), config.server.port);
    let listener = tokio::net::TcpListener::bind(bind_addr).await?;
    tracing::info!("服务器启动在 {}", listener.local_addr()?);
    axum::serve(listener, app).await?;

    Ok(())
}
