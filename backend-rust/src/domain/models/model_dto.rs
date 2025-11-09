use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateModelRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(length(max = 100))]
    pub series: Option<String>,
    #[validate(length(max = 50))]
    pub grade: Option<String>,
    pub rating: Option<f32>,
    pub release_date: Option<chrono::NaiveDate>,
    pub status: String,
    pub manufacturer_id: i32,
    pub parent_id: Option<i32>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateModelRequest {
    #[validate(length(min = 1, max = 255))]
    pub name: Option<String>,
    #[validate(length(max = 100))]
    pub series: Option<String>,
    #[validate(length(max = 50))]
    pub grade: Option<String>,
    pub rating: Option<f32>,
    pub release_date: Option<chrono::NaiveDate>,
    pub status: Option<String>,
    pub manufacturer_id: Option<i32>,
    pub parent_id: Option<i32>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ModelResponse {
    pub id: i32,
    pub name: String,
    pub series: Option<String>,
    pub grade: Option<String>,
    pub release_date: Option<chrono::NaiveDate>,
    pub status: String,
    pub manufacturer_id: i32,
    pub parent_id: Option<i32>,
    pub notes: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PriceHistoryResponse {
    pub id: i32,
    pub price: f64,
    pub currency: String,
    pub source: Option<String>,
    pub notes: Option<String>,
    pub model_id: i32,
    pub recorded_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ModelListResponse {
    pub models: Vec<ModelResponse>,
    pub total: u64,
    pub page: u64,
    pub per_page: u64,
    pub total_pages: u64,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct ToggleFavoriteRequest {
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct TogglePurchaseRequest {
    pub notes: Option<String>,
}
