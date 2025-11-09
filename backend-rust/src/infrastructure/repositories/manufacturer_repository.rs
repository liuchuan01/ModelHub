#![allow(dead_code)]

use crate::domain::entities::manufacturer;
use async_trait::async_trait;
use sea_orm::*;

#[async_trait]
pub trait ManufacturerRepositoryTrait: Send + Sync {
    async fn find_all(&self) -> Result<Vec<manufacturer::Model>, DbErr>;
    async fn find_by_id(&self, id: i32) -> Result<Option<manufacturer::Model>, DbErr>;
    async fn find_by_name(&self, name: &str) -> Result<Option<manufacturer::Model>, DbErr>;
    async fn create(
        &self,
        manufacturer_data: manufacturer::ActiveModel,
    ) -> Result<manufacturer::Model, DbErr>;
    async fn update(
        &self,
        id: i32,
        manufacturer_data: manufacturer::ActiveModel,
    ) -> Result<manufacturer::Model, DbErr>;
    async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr>;
}

pub struct ManufacturerRepository {
    db: DatabaseConnection,
}

impl ManufacturerRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait]
impl ManufacturerRepositoryTrait for ManufacturerRepository {
    async fn find_all(&self) -> Result<Vec<manufacturer::Model>, DbErr> {
        manufacturer::Entity::find()
            .order_by_asc(manufacturer::Column::Name)
            .all(&self.db)
            .await
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<manufacturer::Model>, DbErr> {
        manufacturer::Entity::find_by_id(id).one(&self.db).await
    }

    async fn find_by_name(&self, name: &str) -> Result<Option<manufacturer::Model>, DbErr> {
        manufacturer::Entity::find()
            .filter(manufacturer::Column::Name.eq(name))
            .one(&self.db)
            .await
    }

    async fn create(
        &self,
        manufacturer_data: manufacturer::ActiveModel,
    ) -> Result<manufacturer::Model, DbErr> {
        manufacturer_data.insert(&self.db).await
    }

    async fn update(
        &self,
        id: i32,
        mut manufacturer_data: manufacturer::ActiveModel,
    ) -> Result<manufacturer::Model, DbErr> {
        manufacturer_data.id = Set(id);
        manufacturer_data.update(&self.db).await
    }

    async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        manufacturer::Entity::delete_by_id(id).exec(&self.db).await
    }
}
