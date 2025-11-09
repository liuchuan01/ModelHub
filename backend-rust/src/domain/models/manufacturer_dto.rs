use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateManufacturerRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(length(max = 100))]
    pub country: String,
    pub active_period_start: Option<chrono::NaiveDate>,
    pub active_period_end: Option<chrono::NaiveDate>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateManufacturerRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: Option<String>,
    #[validate(length(max = 100))]
    pub country: Option<String>,
    pub active_period_start: Option<chrono::NaiveDate>,
    pub active_period_end: Option<chrono::NaiveDate>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ManufacturerResponse {
    pub id: i32,
    pub name: String,
    pub country: String,
    pub active_period_start: Option<chrono::NaiveDate>,
    pub active_period_end: Option<chrono::NaiveDate>,
    pub models_count: Option<i64>,
}
