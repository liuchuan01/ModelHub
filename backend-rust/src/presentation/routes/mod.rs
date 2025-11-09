use crate::config::{database::create_connection, Config};
use crate::infrastructure::repositories::{
    manufacturer_repository::ManufacturerRepository, model_repository::ModelRepository,
    user_repository::UserRepository,
};
use crate::presentation::{
    handlers::{auth, manufacturer, model},
    middleware::cors::cors_layer,
    state::AppState,
};
use crate::services::{
    auth_service::AuthService, manufacturer_service::ManufacturerService,
    model_service::ModelService,
};
use axum::{routing::get, routing::post, Router};

pub async fn create_routes(config: Config) -> anyhow::Result<Router> {
    let db = create_connection(&config.database.url, config.database.max_connections).await?;

    let user_repository = UserRepository::new(db.clone());
    let model_repository = ModelRepository::new(db.clone());
    let manufacturer_repository = ManufacturerRepository::new(db);

    let auth_service = AuthService::new(
        user_repository,
        config.auth.jwt_secret.clone(),
        config.auth.jwt_expiration,
    );
    let model_service = ModelService::new(model_repository);
    let manufacturer_service = ManufacturerService::new(manufacturer_repository);

    let app_state = AppState {
        auth_service,
        model_service,
        manufacturer_service,
    };

    let models_router = Router::new()
        .route("/models", get(model::get_models).post(model::create_model))
        .route(
            "/models/:id",
            get(model::get_model_by_id)
                .put(model::update_model)
                .delete(model::delete_model),
        )
        .route("/models/:id/variants", get(model::get_model_variants))
        .route(
            "/models/:id/favorite",
            post(model::favorite_model).delete(model::unfavorite_model),
        )
        .route(
            "/models/:id/purchase",
            post(model::mark_purchase).delete(model::unmark_purchase),
        );

    let manufacturers_router = Router::new()
        .route(
            "/manufacturers",
            get(manufacturer::get_manufacturers).post(manufacturer::create_manufacturer),
        )
        .route(
            "/manufacturers/:id",
            get(manufacturer::get_manufacturer_by_id)
                .put(manufacturer::update_manufacturer)
                .delete(manufacturer::delete_manufacturer),
        );

    let user_router = Router::new()
        .route("/user/profile", get(auth::get_profile))
        .route("/user/favorites", get(model::get_favorites))
        .route("/user/purchases", get(model::get_purchases));

    let api_router = Router::new()
        .route("/health", get(auth::health))
        .route("/auth/login", post(auth::login))
        .merge(models_router)
        .merge(manufacturers_router)
        .merge(user_router);

    let app = Router::new()
        .nest("/api", api_router)
        .layer(cors_layer())
        .with_state(app_state);

    Ok(app)
}
