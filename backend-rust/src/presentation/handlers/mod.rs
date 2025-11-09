use axum::http::StatusCode;

use crate::config::auth::Claims;

pub mod auth;
pub mod manufacturer;
pub mod model;

pub fn user_id_from_claims(claims: &Claims) -> Result<i32, StatusCode> {
    claims
        .sub
        .parse::<i32>()
        .map_err(|_| StatusCode::UNAUTHORIZED)
}
