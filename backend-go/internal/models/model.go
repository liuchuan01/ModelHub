package models

import (
	"time"

	"gorm.io/gorm"
)

// Model 高达模型
type Model struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	ParentID       *uint      `json:"parent_id" gorm:"index"`
	ManufacturerID uint       `json:"manufacturer_id" gorm:"not null;index"`
	Series         *string    `json:"series" gorm:"size:200"`
	Name           string     `json:"name" gorm:"not null;size:300"`
	Status         string     `json:"status" gorm:"default:'现货';size:20"`
	Category       string     `json:"category" gorm:"default:'hg';size:20"`
	ReleaseDate    *time.Time `json:"release_date" gorm:"type:date"`
	Rating         *float32   `json:"rating" gorm:"type:decimal(2,1);check:rating >= 0 AND rating <= 5"`
	Notes          *string    `json:"notes" gorm:"type:text"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`

	// 关联关系
	Parent        *Model              `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children      []Model             `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Manufacturer  Manufacturer        `json:"manufacturer" gorm:"foreignKey:ManufacturerID"`
	PriceHistory  []PriceHistory      `json:"price_history,omitempty" gorm:"foreignKey:ModelID"`
	UserPurchases []UserModelPurchase `json:"user_purchases,omitempty" gorm:"foreignKey:ModelID"`
	UserFavorites []UserModelFavorite `json:"user_favorites,omitempty" gorm:"foreignKey:ModelID"`
}

// TableName 指定表名
func (Model) TableName() string {
	return "models"
}

// BeforeCreate 创建前钩子
func (m *Model) BeforeCreate(tx *gorm.DB) error {
	m.CreatedAt = time.Now()
	m.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate 更新前钩子
func (m *Model) BeforeUpdate(tx *gorm.DB) error {
	m.UpdatedAt = time.Now()
	return nil
}
