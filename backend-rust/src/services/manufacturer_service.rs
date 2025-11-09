#![allow(dead_code)]

use crate::domain::entities::manufacturer;
use crate::domain::models::manufacturer_dto::*;
use crate::infrastructure::repositories::manufacturer_repository::ManufacturerRepositoryTrait;
use sea_orm::ActiveValue::Set;

pub struct ManufacturerService<T: ManufacturerRepositoryTrait> {
    manufacturer_repository: T,
}

impl<T: ManufacturerRepositoryTrait> ManufacturerService<T> {
    pub fn new(manufacturer_repository: T) -> Self {
        Self {
            manufacturer_repository,
        }
    }

    pub async fn get_manufacturers(&self) -> anyhow::Result<Vec<ManufacturerResponse>> {
        let manufacturers = self.manufacturer_repository.find_all().await?;
        let responses: Vec<ManufacturerResponse> = manufacturers
            .into_iter()
            .map(|m| self.convert_to_response(m))
            .collect();
        Ok(responses)
    }

    pub async fn get_manufacturer_by_id(
        &self,
        id: i32,
    ) -> anyhow::Result<Option<ManufacturerResponse>> {
        if let Some(manufacturer) = self.manufacturer_repository.find_by_id(id).await? {
            Ok(Some(self.convert_to_response(manufacturer)))
        } else {
            Ok(None)
        }
    }

    pub async fn create_manufacturer(
        &self,
        request: CreateManufacturerRequest,
    ) -> anyhow::Result<ManufacturerResponse> {
        let manufacturer_data = manufacturer::ActiveModel {
            name: Set(request.name),
            country: Set(request.country),
            active_period: Set(request.active_period),
            ..Default::default()
        };

        let created_manufacturer = self
            .manufacturer_repository
            .create(manufacturer_data)
            .await?;
        Ok(self.convert_to_response(created_manufacturer))
    }

    pub async fn update_manufacturer(
        &self,
        id: i32,
        request: UpdateManufacturerRequest,
    ) -> anyhow::Result<ManufacturerResponse> {
        let existing_manufacturer = self
            .manufacturer_repository
            .find_by_id(id)
            .await?
            .ok_or_else(|| anyhow::anyhow!("厂商不存在"))?;

        let manufacturer_data = manufacturer::ActiveModel {
            id: Set(existing_manufacturer.id),
            name: Set(request.name.unwrap_or(existing_manufacturer.name)),
            country: Set(request.country.unwrap_or(existing_manufacturer.country)),
            active_period: Set(request
                .active_period
                .or(existing_manufacturer.active_period)),
            ..Default::default()
        };

        let updated_manufacturer = self
            .manufacturer_repository
            .update(id, manufacturer_data)
            .await?;
        Ok(self.convert_to_response(updated_manufacturer))
    }

    pub async fn delete_manufacturer(&self, id: i32) -> anyhow::Result<()> {
        self.manufacturer_repository.delete(id).await?;
        Ok(())
    }

    fn convert_to_response(&self, manufacturer: manufacturer::Model) -> ManufacturerResponse {
        ManufacturerResponse {
            id: manufacturer.id,
            name: manufacturer.name,
            country: manufacturer.country,
            active_period: manufacturer.active_period,
            models_count: manufacturer.models_count,
        }
    }
}
