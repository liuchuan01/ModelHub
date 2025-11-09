#![allow(dead_code)]

use crate::domain::models::manufacturer_dto::*;
use crate::presentation::state::AppState;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use validator::Validate;

pub async fn get_manufacturers(
    State(state): State<AppState>,
) -> Result<Json<Vec<ManufacturerResponse>>, StatusCode> {
    match state.manufacturer_service.get_manufacturers().await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取厂商列表失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn get_manufacturer_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<Option<ManufacturerResponse>>, StatusCode> {
    match state.manufacturer_service.get_manufacturer_by_id(id).await {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("获取厂商详情失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create_manufacturer(
    State(state): State<AppState>,
    Json(request): Json<CreateManufacturerRequest>,
) -> Result<Json<ManufacturerResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match state
        .manufacturer_service
        .create_manufacturer(request)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("创建厂商失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn update_manufacturer(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(request): Json<UpdateManufacturerRequest>,
) -> Result<Json<ManufacturerResponse>, StatusCode> {
    if let Err(e) = request.validate() {
        tracing::error!("验证错误: {:?}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    match state
        .manufacturer_service
        .update_manufacturer(id, request)
        .await
    {
        Ok(response) => Ok(Json(response)),
        Err(e) => {
            tracing::error!("更新厂商失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn delete_manufacturer(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    match state.manufacturer_service.delete_manufacturer(id).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("删除厂商失败: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
