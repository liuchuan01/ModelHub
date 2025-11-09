use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "user_model_favorite")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub user_id: i32,
    pub model_id: i32,
    pub notes: Option<String>,
    #[serde(skip_deserializing)]
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::UserId",
        to = "super::user::Column::Id"
    )]
    User,
    #[sea_orm(
        belongs_to = "super::model::Entity",
        from = "Column::ModelId",
        to = "super::model::Column::Id"
    )]
    Model,
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl Related<super::model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Model.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
