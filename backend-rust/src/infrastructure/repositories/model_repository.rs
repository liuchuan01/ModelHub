use crate::domain::entities::{model, user_model_favorite, user_model_purchase};
use async_trait::async_trait;
use sea_orm::ActiveValue::Set;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, DeleteResult, EntityTrait, JoinType,
    PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait,
};

#[async_trait]
pub trait ModelRepositoryTrait: Send + Sync {
    async fn find_all(
        &self,
        user_id: Option<i32>,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr>;
    async fn find_by_id(
        &self,
        id: i32,
        user_id: Option<i32>,
    ) -> Result<Option<model::Model>, DbErr>;
    async fn find_variants(
        &self,
        parent_id: i32,
        user_id: Option<i32>,
    ) -> Result<Vec<model::Model>, DbErr>;
    async fn create(&self, model_data: model::ActiveModel) -> Result<model::Model, DbErr>;
    async fn update(&self, id: i32, model_data: model::ActiveModel) -> Result<model::Model, DbErr>;
    async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr>;
    async fn toggle_favorite(
        &self,
        user_id: i32,
        model_id: i32,
        notes: Option<String>,
    ) -> Result<(), DbErr>;
    async fn toggle_purchase(
        &self,
        user_id: i32,
        model_id: i32,
        notes: Option<String>,
    ) -> Result<(), DbErr>;
    async fn get_favorites(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr>;
    async fn get_purchases(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr>;
}

pub struct ModelRepository {
    db: DatabaseConnection,
}

impl ModelRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait]
impl ModelRepositoryTrait for ModelRepository {
    async fn find_all(
        &self,
        _user_id: Option<i32>,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr> {
        let page = page.max(1);
        let per_page = per_page.max(1);

        let paginator = model::Entity::find()
            .order_by_asc(model::Column::Name)
            .paginate(&self.db, per_page);

        let total = paginator.num_items().await?;
        let models = paginator.fetch_page(page - 1).await?;

        Ok((models, total))
    }

    async fn find_by_id(
        &self,
        id: i32,
        _user_id: Option<i32>,
    ) -> Result<Option<model::Model>, DbErr> {
        let model_opt = model::Entity::find_by_id(id).one(&self.db).await?;

        Ok(model_opt)
    }

    async fn find_variants(
        &self,
        parent_id: i32,
        _user_id: Option<i32>,
    ) -> Result<Vec<model::Model>, DbErr> {
        let variants = model::Entity::find()
            .filter(model::Column::ParentId.eq(parent_id))
            .order_by_asc(model::Column::Name)
            .all(&self.db)
            .await?;

        // TODO: Add user-specific data if user_id is provided
        Ok(variants)
    }

    async fn create(&self, model_data: model::ActiveModel) -> Result<model::Model, DbErr> {
        model_data.insert(&self.db).await
    }

    async fn update(
        &self,
        id: i32,
        mut model_data: model::ActiveModel,
    ) -> Result<model::Model, DbErr> {
        model_data.id = Set(id);
        model_data.update(&self.db).await
    }

    async fn delete(&self, id: i32) -> Result<DeleteResult, DbErr> {
        model::Entity::delete_by_id(id).exec(&self.db).await
    }

    async fn toggle_favorite(
        &self,
        user_id: i32,
        model_id: i32,
        notes: Option<String>,
    ) -> Result<(), DbErr> {
        let existing = user_model_favorite::Entity::find()
            .filter(user_model_favorite::Column::UserId.eq(user_id))
            .filter(user_model_favorite::Column::ModelId.eq(model_id))
            .one(&self.db)
            .await?;

        if existing.is_some() {
            user_model_favorite::Entity::delete_by_id(existing.unwrap().id)
                .exec(&self.db)
                .await?;
        } else {
            let favorite = user_model_favorite::ActiveModel {
                user_id: Set(user_id),
                model_id: Set(model_id),
                notes: Set(notes),
                created_at: Set(chrono::Utc::now().naive_utc()),
                ..Default::default()
            };
            favorite.insert(&self.db).await?;
        }

        Ok(())
    }

    async fn toggle_purchase(
        &self,
        user_id: i32,
        model_id: i32,
        notes: Option<String>,
    ) -> Result<(), DbErr> {
        let existing = user_model_purchase::Entity::find()
            .filter(user_model_purchase::Column::UserId.eq(user_id))
            .filter(user_model_purchase::Column::ModelId.eq(model_id))
            .one(&self.db)
            .await?;

        if existing.is_some() {
            user_model_purchase::Entity::delete_by_id(existing.unwrap().id)
                .exec(&self.db)
                .await?;
        } else {
            let purchase = user_model_purchase::ActiveModel {
                user_id: Set(user_id),
                model_id: Set(model_id),
                notes: Set(notes),
                created_at: Set(chrono::Utc::now().naive_utc()),
                ..Default::default()
            };
            purchase.insert(&self.db).await?;
        }

        Ok(())
    }

    async fn get_favorites(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr> {
        let page = page.max(1);
        let per_page = per_page.max(1);

        let paginator = model::Entity::find()
            .join(JoinType::InnerJoin, model::Relation::Favorite.def())
            .filter(user_model_favorite::Column::UserId.eq(user_id))
            .order_by_asc(model::Column::Name)
            .paginate(&self.db, per_page);

        let total = paginator.num_items().await?;
        let models = paginator.fetch_page(page - 1).await?;

        Ok((models, total))
    }

    async fn get_purchases(
        &self,
        user_id: i32,
        page: u64,
        per_page: u64,
    ) -> Result<(Vec<model::Model>, u64), DbErr> {
        let page = page.max(1);
        let per_page = per_page.max(1);

        let paginator = model::Entity::find()
            .join(JoinType::InnerJoin, model::Relation::Purchase.def())
            .filter(user_model_purchase::Column::UserId.eq(user_id))
            .order_by_asc(model::Column::Name)
            .paginate(&self.db, per_page);

        let total = paginator.num_items().await?;
        let models = paginator.fetch_page(page - 1).await?;

        Ok((models, total))
    }
}
