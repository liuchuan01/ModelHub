use crate::domain::models::auth::{LoginRequest, LoginResponse};
use crate::infrastructure::repositories::user_repository::UserRepositoryTrait;
use crate::services::AuthService;
use axum::{extract::State, http::StatusCode, response::Json};
use serde_json::{json, Value};
use validator::Validate;

pub async fn login<T: UserRepositoryTrait + Clone>(
    State(auth_service): State<AuthService<T>>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match auth_service.login(request).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("登录失败: {:?}", e);
            Err(StatusCode::UNAUTHORIZED)
        }
    }
}

pub async fn health() -> Result<Json<Value>, StatusCode> {
    Ok(Json(json!({
        "status": "ok",
        "timestamp": chrono::Utc::now().to_rfc3339()
    })))
}

pub async fn get_profile<T: UserRepositoryTrait + Clone>(
    State(auth_service): State<AuthService<T>>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = 1; // 临时硬编码

    match auth_service.get_user_by_id(user_id).await {
        Ok(Some(user)) => Ok(Json(json!({
            "id": user.id,
            "username": user.username
        }))),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
