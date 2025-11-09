use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "manufacturers")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub name: String,
    pub country: String,
    pub active_period: Option<String>,
    #[sea_orm(ignore)]
    pub models_count: Option<i64>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::model::Entity")]
    Model,
}

impl Related<super::model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Model.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
