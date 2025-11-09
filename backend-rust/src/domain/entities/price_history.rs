use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize, Validate)]
#[sea_orm(table_name = "price_history")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    #[validate(range(min = 0.0))]
    pub price: f64,
    pub currency: String,
    pub source: Option<String>,
    pub notes: Option<String>,
    pub model_id: i32,
    #[serde(skip_deserializing)]
    pub recorded_at: chrono::NaiveDateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::model::Entity",
        from = "Column::ModelId",
        to = "super::model::Column::Id"
    )]
    Model,
}

impl Related<super::model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Model.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
