use crate::config::Config;
use crate::presentation::{handlers::auth, middleware::cors::cors_layer};
use axum::{routing::get, Router};

pub fn create_routes(_config: Config) -> Router {
    // 简化的路由配置用于编译测试
    Router::new()
        .route("/api/health", get(auth::health))
        .layer(cors_layer())
}
