use axum::http::{
    header::{AUTHORIZATION, CONTENT_TYPE},
    HeaderValue, Method,
};
use std::env;
use tower_http::cors::{AllowOrigin, CorsLayer};

pub fn cors_layer() -> CorsLayer {
    let origins = env::var("CORS_ALLOWED_ORIGINS")
        .ok()
        .and_then(|value| {
            let headers: Vec<HeaderValue> = value
                .split(',')
                .filter_map(|origin| {
                    let trimmed = origin.trim();
                    if trimmed.is_empty() {
                        None
                    } else {
                        HeaderValue::from_str(trimmed).ok()
                    }
                })
                .collect();

            if headers.is_empty() {
                None
            } else {
                Some(headers)
            }
        })
        .unwrap_or_else(|| vec![HeaderValue::from_static("http://localhost:3000")]);

    CorsLayer::new()
        .allow_origin(AllowOrigin::list(origins))
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([AUTHORIZATION, CONTENT_TYPE])
        .allow_credentials(true)
}
