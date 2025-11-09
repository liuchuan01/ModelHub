package models

import (
	"time"

	"gorm.io/gorm"
)

// UserModelPurchase 用户模型购买关系模型
type UserModelPurchase struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	UserID         uint       `json:"user_id" gorm:"not null;index"`
	ModelID        uint       `json:"model_id" gorm:"not null;index"`
	Purchased      bool       `json:"purchased" gorm:"default:false"`
	PurchasedDate  *time.Time `json:"purchased_date" gorm:"type:date"`
	PurchasedPrice *float64   `json:"purchased_price" gorm:"type:decimal(10,2)"`
	PurchaseNotes  *string    `json:"purchase_notes" gorm:"type:text"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`

	// 关联关系
	User  User  `json:"user" gorm:"foreignKey:UserID"`
	Model Model `json:"model" gorm:"foreignKey:ModelID"`
}

// TableName 指定表名
func (UserModelPurchase) TableName() string {
	return "user_model_purchase"
}

// BeforeCreate 创建前钩子
func (u *UserModelPurchase) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate 更新前钩子
func (u *UserModelPurchase) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}
