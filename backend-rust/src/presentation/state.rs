use crate::infrastructure::repositories::{
    manufacturer_repository::ManufacturerRepository, model_repository::ModelRepository,
    user_repository::UserRepository,
};
use crate::services::{
    auth_service::AuthService, manufacturer_service::ManufacturerService,
    model_service::ModelService,
};

#[derive(Clone)]
pub struct AppState {
    pub auth_service: AuthService<UserRepository>,
    pub model_service: ModelService<ModelRepository>,
    pub manufacturer_service: ManufacturerService<ManufacturerRepository>,
}
