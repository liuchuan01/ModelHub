package models

import (
	"time"

	"gorm.io/gorm"
)

// PriceHistory 价格历史模型
type PriceHistory struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ModelID   uint      `json:"model_id" gorm:"not null;index"`
	Price     float64   `json:"price" gorm:"not null;type:decimal(10,2)"`
	PriceDate time.Time `json:"price_date" gorm:"not null;type:date"`
	Source    string    `json:"source" gorm:"default:'pdd';size:200"`
	Notes     *string   `json:"notes" gorm:"type:text"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// 关联关系
	Model Model `json:"model" gorm:"foreignKey:ModelID"`
}

// TableName 指定表名
func (PriceHistory) TableName() string {
	return "price_history"
}

// BeforeCreate 创建前钩子
func (p *PriceHistory) BeforeCreate(tx *gorm.DB) error {
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate 更新前钩子
func (p *PriceHistory) BeforeUpdate(tx *gorm.DB) error {
	p.UpdatedAt = time.Now()
	return nil
}
