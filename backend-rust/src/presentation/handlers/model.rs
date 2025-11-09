#![allow(dead_code)]

use crate::domain::models::model_dto::*;
use crate::infrastructure::repositories::model_repository::ModelRepositoryTrait;
use crate::services::model_service::ModelService;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: u64,
    #[serde(default = "default_per_page")]
    pub per_page: u64,
}

fn default_page() -> u64 {
    1
}
fn default_per_page() -> u64 {
    20
}

pub async fn get_models<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = None;

    match model_service
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

pub async fn get_model_by_id<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(id): Path<i32>,
) -> Result<Json<Option<ModelResponse>>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = None;

    match model_service.get_model_by_id(id, user_id).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取模型详情失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_model_variants<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(parent_id): Path<i32>,
) -> Result<Json<Vec<ModelResponse>>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = None;

    match model_service.get_model_variants(parent_id, user_id).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取模型变体失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create_model<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Json(request): Json<CreateModelRequest>,
) -> Result<Json<ModelResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match model_service.create_model(request).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("创建模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn update_model<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(id): Path<i32>,
    Json(request): Json<UpdateModelRequest>,
) -> Result<Json<ModelResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match model_service.update_model(id, request).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("更新模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn delete_model<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    match model_service.delete_model(id).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("删除模型失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn toggle_favorite<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(id): Path<i32>,
    Json(request): Json<ToggleFavoriteRequest>,
) -> Result<StatusCode, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = 1; // 临时硬编码

    match model_service.toggle_favorite(user_id, id, request).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("切换收藏状态失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn toggle_purchase<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Path(id): Path<i32>,
    Json(request): Json<TogglePurchaseRequest>,
) -> Result<StatusCode, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = 1; // 临时硬编码

    match model_service.toggle_purchase(user_id, id, request).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("切换购买状态失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_favorites<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = 1; // 临时硬编码

    match model_service
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

pub async fn get_purchases<T: ModelRepositoryTrait>(
    State(model_service): State<ModelService<T>>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ModelListResponse>, StatusCode> {
    // TODO: Get user_id from JWT claims
    let user_id = 1; // 临时硬编码

    match model_service
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
