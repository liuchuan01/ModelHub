use crate::presentation::state::AppState;

use axum::{
    extract::{Request, State},
    http::{header, StatusCode},
    middleware::Next,
    response::Response,
};
use tracing::warn;

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = extract_bearer_token(&request).ok_or(StatusCode::UNAUTHORIZED)?;

    match state.auth_service.verify_token(token) {
        Ok(claims) => {
            request.extensions_mut().insert(claims);
            let response = next.run(request).await;
            Ok(response)
        }
        Err(err) => {
            warn!("JWT verification failed: {:?}", err);
            Err(StatusCode::UNAUTHORIZED)
        }
    }
}

fn extract_bearer_token(request: &Request) -> Option<&str> {
    request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|value| value.strip_prefix("Bearer "))
}
