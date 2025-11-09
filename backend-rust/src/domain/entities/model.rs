use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize, Validate)]
#[sea_orm(table_name = "models")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    #[validate(length(min = 1, max = 255))]
    pub name: String,
    #[validate(length(max = 100))]
    pub series: Option<String>,
    #[validate(length(max = 50))]
    pub grade: Option<String>,
    pub release_date: Option<chrono::NaiveDate>,
    pub status: String,
    pub manufacturer_id: i32,
    pub parent_id: Option<i32>,
    pub notes: Option<String>,
    #[serde(skip_deserializing)]
    pub created_at: chrono::NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: chrono::NaiveDateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::manufacturer::Entity",
        from = "Column::ManufacturerId",
        to = "super::manufacturer::Column::Id"
    )]
    Manufacturer,
    #[sea_orm(belongs_to = "Entity", from = "Column::ParentId", to = "Column::Id")]
    Parent,
    #[sea_orm(has_many = "Entity")]
    Child,
    #[sea_orm(has_many = "super::price_history::Entity")]
    PriceHistory,
    #[sea_orm(has_many = "super::user_model_favorite::Entity")]
    Favorite,
    #[sea_orm(has_many = "super::user_model_purchase::Entity")]
    Purchase,
}

impl Related<super::manufacturer::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Manufacturer.def()
    }
}

impl Related<Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Parent.def()
    }
}

impl Related<super::price_history::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::PriceHistory.def()
    }
}

impl Related<super::user_model_favorite::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Favorite.def()
    }
}

impl Related<super::user_model_purchase::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Purchase.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
