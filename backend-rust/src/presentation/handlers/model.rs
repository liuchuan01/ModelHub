#![allow(dead_code)]

use super::user_id_from_claims;
use crate::config::auth::Claims;
use crate::domain::models::model_dto::*;
use crate::presentation::state::AppState;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    Extension,
};
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: u64,
    #[serde(default = "default_per_page", alias = "page_size")]
    pub per_page: u64,
}

fn default_page() -> u64 {
    1
}
fn default_per_page() -> u64 {
    20
}

pub async fn get_models(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    let user_id = None;

    match state
        .model_service
        .get_models(user_id, params.page, params.per_page)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取模型列表失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_model_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<Option<ModelResponse>>, StatusCode> {
    let user_id = None;

    match state.model_service.get_model_by_id(id, user_id).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取模型详情失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_model_variants(
    State(state): State<AppState>,
    Path(parent_id): Path<i32>,
) -> Result<Json<Vec<ModelResponse>>, StatusCode> {
    let user_id = None;

    match state
        .model_service
        .get_model_variants(parent_id, user_id)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取模型变体失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create_model(
    State(state): State<AppState>,
    Json(request): Json<CreateModelRequest>,
) -> Result<Json<ModelResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match state.model_service.create_model(request).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("创建模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn update_model(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(request): Json<UpdateModelRequest>,
) -> Result<Json<ModelResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match state.model_service.update_model(id, request).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("更新模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn delete_model(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    match state.model_service.delete_model(id).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("删除模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn favorite_model(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<i32>,
    Json(request): Json<ToggleFavoriteRequest>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    match state
        .model_service
        .toggle_favorite(user_id, id, request)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("收藏模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn unfavorite_model(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    let request = ToggleFavoriteRequest { notes: None };

    match state
        .model_service
        .toggle_favorite(user_id, id, request)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("取消收藏失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn mark_purchase(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<i32>,
    Json(request): Json<TogglePurchaseRequest>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    match state
        .model_service
        .toggle_purchase(user_id, id, request)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("标记购买失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn unmark_purchase(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    let request = TogglePurchaseRequest { notes: None };

    match state
        .model_service
        .toggle_purchase(user_id, id, request)
        .await
    {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("取消购买失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_favorites(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    match state
        .model_service
        .get_favorites(user_id, params.page, params.per_page)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取收藏列表失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_purchases(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    let user_id = user_id_from_claims(&claims)?;

    match state
        .model_service
        .get_purchases(user_id, params.page, params.per_page)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取购买列表失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
