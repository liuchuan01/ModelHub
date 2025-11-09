use crate::domain::entities::model;
use crate::domain::models::model_dto::*;
use crate::infrastructure::repositories::model_repository::ModelRepositoryTrait;
use sea_orm::ActiveValue::Set;

pub struct ModelService<T: ModelRepositoryTrait> {
    model_repository: T,
}

impl<T: ModelRepositoryTrait> ModelService<T> {
    pub fn new(model_repository: T) -> Self {
        Self { model_repository }
    }

    pub async fn get_models(
        &self,
        user_id: Option<i32>,
        page: u64,
        per_page: u64,
    ) -> anyhow::Result<ModelListResponse> {
        let (models, total) = self
            .model_repository
            .find_all(user_id, page, per_page)
            .await?;
        let total_pages = (total + per_page - 1) / per_page;

        let model_responses: Vec<ModelResponse> = models
            .into_iter()
            .map(|m| self.convert_to_model_response(m))
            .collect();

        Ok(ModelListResponse {
            models: model_responses,
            total,
            page,
            per_page,
            total_pages,
        })
    }

    pub async fn get_model_by_id(
        &self,
        id: i32,
        user_id: Option<i32>,
    ) -> anyhow::Result<Option<ModelResponse>> {
        if let Some(model) = self.model_repository.find_by_id(id, user_id).await? {
            Ok(Some(self.convert_to_model_response(model)))
        } else {
            Ok(None)
        }
    }

    pub async fn get_model_variants(
        &self,
        parent_id: i32,
        user_id: Option<i32>,
    ) -> anyhow::Result<Vec<ModelResponse>> {
        let variants = self
            .model_repository
            .find_variants(parent_id, user_id)
            .await?;
        let variant_responses: Vec<ModelResponse> = variants
            .into_iter()
            .map(|v| self.convert_to_model_response(v))
            .collect();
        Ok(variant_responses)
    }

    pub async fn create_model(&self, request: CreateModelRequest) -> anyhow::Result<ModelResponse> {
        let model_data = model::ActiveModel {
            name: Set(request.name),
            series: Set(request.series),
            grade: Set(request.grade),
            release_date: Set(request.release_date),
            status: Set(request.status),
            manufacturer_id: Set(request.manufacturer_id),
            parent_id: Set(request.parent_id),
            notes: Set(request.notes),
            created_at: Set(chrono::Utc::now().naive_utc()),
            updated_at: Set(chrono::Utc::now().naive_utc()),
            ..Default::default()
        };

        let created_model = self.model_repository.create(model_data).await?;
        Ok(self.convert_to_model_response(created_model))
    }

    pub async fn update_model(
        &self,
        id: i32,
        request: UpdateModelRequest,
    ) -> anyhow::Result<ModelResponse> {
        let existing_model = self
            .model_repository
            .find_by_id(id, None)
            .await?
            .ok_or_else(|| anyhow::anyhow!("模型不存在"))?;

        let model_data = model::ActiveModel {
            id: Set(existing_model.id),
            name: Set(request.name.unwrap_or(existing_model.name)),
            series: Set(request.series.or(existing_model.series)),
            grade: Set(request.grade.or(existing_model.grade)),
            release_date: Set(request.release_date.or(existing_model.release_date)),
            status: Set(request.status.unwrap_or(existing_model.status)),
            manufacturer_id: Set(request
                .manufacturer_id
                .unwrap_or(existing_model.manufacturer_id)),
            parent_id: Set(request.parent_id.or(existing_model.parent_id)),
            notes: Set(request.notes.or(existing_model.notes)),
            updated_at: Set(chrono::Utc::now().naive_utc()),
            ..Default::default()
        };

        let updated_model = self.model_repository.update(id, model_data).await?;
        Ok(self.convert_to_model_response(updated_model))
    }

    pub async fn delete_model(&self, id: i32) -> anyhow::Result<()> {
        self.model_repository.delete(id).await?;
        Ok(())
    }

    pub async fn toggle_favorite(
        &self,
        user_id: i32,
        model_id: i32,
        request: ToggleFavoriteRequest,
    ) -> anyhow::Result<()> {
        self.model_repository
            .toggle_favorite(user_id, model_id, request.notes)
            .await?;
        Ok(())
    }

    pub async fn toggle_purchase(
        &self,
        user_id: i32,
        model_id: i32,
        request: TogglePurchaseRequest,
    ) -> anyhow::Result<()> {
        self.model_repository
            .toggle_purchase(user_id, model_id, request.notes)
            .await?;
        Ok(())
    }

    pub async fn get_favorites(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> anyhow::Result<ModelListResponse> {
        let (models, total) = self
            .model_repository
            .get_favorites(user_id, page, per_page)
            .await?;
        let total_pages = (total + per_page - 1) / per_page;

        let model_responses: Vec<ModelResponse> = models
            .into_iter()
            .map(|m| self.convert_to_model_response(m))
            .collect();

        Ok(ModelListResponse {
            models: model_responses,
            total,
            page,
            per_page,
            total_pages,
        })
    }

    pub async fn get_purchases(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> anyhow::Result<ModelListResponse> {
        let (models, total) = self
            .model_repository
            .get_purchases(user_id, page, per_page)
            .await?;
        let total_pages = (total + per_page - 1) / per_page;

        let model_responses: Vec<ModelResponse> = models
            .into_iter()
            .map(|m| self.convert_to_model_response(m))
            .collect();

        Ok(ModelListResponse {
            models: model_responses,
            total,
            page,
            per_page,
            total_pages,
        })
    }

    fn convert_to_model_response(&self, model: model::Model) -> ModelResponse {
        ModelResponse {
            id: model.id,
            name: model.name,
            series: model.series,
            grade: model.grade,
            release_date: model.release_date,
            status: model.status,
            manufacturer_id: model.manufacturer_id,
            parent_id: model.parent_id,
            notes: model.notes,
            created_at: model.created_at,
            updated_at: model.updated_at,
        }
    }
}
