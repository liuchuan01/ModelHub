#![allow(dead_code)]

use crate::config::auth;
use crate::domain::entities::user;
use crate::domain::models::auth::{LoginRequest, LoginResponse, UserResponse};
use crate::infrastructure::repositories::user_repository::UserRepositoryTrait;
use bcrypt::{hash, verify, DEFAULT_COST};

#[derive(Clone)]
pub struct AuthService<T: UserRepositoryTrait + Clone> {
    user_repository: T,
    jwt_secret: String,
    jwt_expiration: i64,
}

impl<T: UserRepositoryTrait + Clone> AuthService<T> {
    pub fn new(user_repository: T, jwt_secret: String, jwt_expiration: i64) -> Self {
        Self {
            user_repository,
            jwt_secret,
            jwt_expiration,
        }
    }

    pub async fn login(&self, request: LoginRequest) -> anyhow::Result<LoginResponse> {
        let user = self
            .user_repository
            .find_by_username(&request.username)
            .await?
            .ok_or_else(|| anyhow::anyhow!("用户名或密码错误"))?;

        let is_valid = verify(&request.password, &user.password_hash)?;
        if !is_valid {
            return Err(anyhow::anyhow!("用户名或密码错误"));
        }

        let token = auth::generate_jwt(
            &user.id.to_string(),
            &user.username,
            &self.jwt_secret,
            self.jwt_expiration,
        )?;

        let user_response = UserResponse {
            id: user.id,
            username: user.username,
        };

        Ok(LoginResponse {
            token,
            user: user_response,
        })
    }

    pub async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<user::Model>> {
        let user = self.user_repository.find_by_id(id).await?;
        Ok(user)
    }

    pub fn hash_password(&self, password: &str) -> anyhow::Result<String> {
        let hashed = hash(password, DEFAULT_COST)?;
        Ok(hashed)
    }
}
