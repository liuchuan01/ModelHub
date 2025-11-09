use axum::{
    extract::{Request, State},
    http::{header, StatusCode},
    middleware::Next,
    response::Response,
};
use crate::config::auth;

pub async fn auth_middleware(
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|auth_str| {
            if auth_str.starts_with("Bearer ") {
                Some(&auth_str[7..])
            } else {
                None
            }
        });

    if let Some(token) = auth_header {
        // TODO: Get JWT secret from app state
        let jwt_secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string());

        match auth::verify_jwt(token, &jwt_secret) {
            Ok(_claims) => {
                let response = next.run(request).await;
                Ok(response)
            }
            Err(_) => Err(StatusCode::UNAUTHORIZED),
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}
