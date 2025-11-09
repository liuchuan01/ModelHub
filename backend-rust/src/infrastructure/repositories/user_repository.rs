#![allow(dead_code)]

use crate::domain::entities::user;
use async_trait::async_trait;
use sea_orm::*;

#[async_trait]
pub trait UserRepositoryTrait: Send + Sync {
    async fn find_by_username(&self, username: &str) -> Result<Option<user::Model>, DbErr>;
    async fn find_by_id(&self, id: i32) -> Result<Option<user::Model>, DbErr>;
    async fn create(&self, user_data: user::ActiveModel) -> Result<user::Model, DbErr>;
}

pub struct UserRepository {
    db: DatabaseConnection,
}

impl UserRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait]
impl UserRepositoryTrait for UserRepository {
    async fn find_by_username(&self, username: &str) -> Result<Option<user::Model>, DbErr> {
        user::Entity::find()
            .filter(user::Column::Username.eq(username))
            .one(&self.db)
            .await
    }

    async fn find_by_id(&self, id: i32) -> Result<Option<user::Model>, DbErr> {
        user::Entity::find_by_id(id).one(&self.db).await
    }

    async fn create(&self, user_data: user::ActiveModel) -> Result<user::Model, DbErr> {
        user_data.insert(&self.db).await
    }
}
