package models

import (
	"time"

	"gorm.io/gorm"
)

// UserModelFavorite 用户模型收藏关系模型
type UserModelFavorite struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	UserID        uint      `json:"user_id" gorm:"not null;index"`
	ModelID       uint      `json:"model_id" gorm:"not null;index"`
	FavoriteNotes *string   `json:"favorite_notes" gorm:"type:text"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	// 关联关系
	User  User  `json:"user" gorm:"foreignKey:UserID"`
	Model Model `json:"model" gorm:"foreignKey:ModelID"`
}

// TableName 指定表名
func (UserModelFavorite) TableName() string {
	return "user_model_favorite"
}

// BeforeCreate 创建前钩子
func (u *UserModelFavorite) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate 更新前钩子
func (u *UserModelFavorite) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}
