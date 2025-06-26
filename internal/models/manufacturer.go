package models

import (
	"time"

	"gorm.io/gorm"
)

// Manufacturer 厂商模型
type Manufacturer struct {
	ID                uint       `json:"id" gorm:"primaryKey"`
	Name              string     `json:"name" gorm:"uniqueIndex;not null;size:100"`
	FullName          *string    `json:"full_name" gorm:"size:200"`
	FoundedDate       *time.Time `json:"founded_date" gorm:"type:date"`
	ActivePeriodStart *time.Time `json:"active_period_start" gorm:"type:date"`
	ActivePeriodEnd   *time.Time `json:"active_period_end" gorm:"type:date"`
	ParentCompany     *string    `json:"parent_company" gorm:"size:200"`
	Country           *string    `json:"country" gorm:"size:100"`
	Website           *string    `json:"website" gorm:"size:300"`
	Description       *string    `json:"description" gorm:"type:text"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`

	// 关联关系
	Models []Model `json:"models,omitempty" gorm:"foreignKey:ManufacturerID"`
}

// TableName 指定表名
func (Manufacturer) TableName() string {
	return "manufacturers"
}

// BeforeCreate 创建前钩子
func (m *Manufacturer) BeforeCreate(tx *gorm.DB) error {
	m.CreatedAt = time.Now()
	m.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate 更新前钩子
func (m *Manufacturer) BeforeUpdate(tx *gorm.DB) error {
	m.UpdatedAt = time.Now()
	return nil
}
