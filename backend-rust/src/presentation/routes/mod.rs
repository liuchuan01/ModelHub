use crate::config::Config;
use crate::infrastructure::repositories::{
    ManufacturerRepository, ModelRepository, UserRepository,
};
use crate::presentation::{
    handlers::{auth, manufacturer, model},
    middleware::{auth_middleware, cors::cors_layer},
};
use crate::services::{AuthService, ManufacturerService, ModelService};
use axum::{
    middleware,
    routing::{delete, get, post, put},
    Router,
};

pub fn create_routes(_config: Config) -> Router {
    // 简化的路由配置用于编译测试
    Router::new()
        .route("/api/health", get(auth::health))
        .layer(cors_layer())
}
