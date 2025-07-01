package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"model_collect/internal/config"
	"model_collect/internal/models"
)

var DB *gorm.DB

// Initialize 初始化数据库连接
func Initialize(cfg *config.Config) error {
	dsn := cfg.GetDSN()
	
	// 添加调试日志
	log.Printf("正在连接数据库，DSN: %s", dsn)

	// 配置GORM
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// 根据环境设置日志级别
	if cfg.App.Environment == "production" {
		gormConfig.Logger = logger.Default.LogMode(logger.Error)
	}

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// 获取底层的sql.DB对象用于连接池配置
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// 设置连接池
	sqlDB.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// 测试连接
	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	// 检查当前连接的数据库
	var currentDB string
	if err := db.Raw("SELECT current_database()").Scan(&currentDB).Error; err != nil {
		log.Printf("无法获取当前数据库名: %v", err)
	} else {
		log.Printf("成功连接到数据库: %s", currentDB)
	}

	// 检查users表是否存在
	var tableExists bool
	if err := db.Raw("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')").Scan(&tableExists).Error; err != nil {
		log.Printf("无法检查users表: %v", err)
	} else {
		log.Printf("users表是否存在: %v", tableExists)
	}

	DB = db

	log.Println("Database connection established successfully")
	return nil
}

// AutoMigrate 自动迁移数据库表结构
func AutoMigrate() error {
	if DB == nil {
		return fmt.Errorf("database not initialized")
	}

	err := DB.AutoMigrate(
		&models.User{},
		&models.Manufacturer{},
		&models.Model{},
		&models.PriceHistory{},
		&models.UserModelPurchase{},
		&models.UserModelFavorite{},
	)

	if err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err)
	}

	log.Println("Database auto migration completed successfully")
	return nil
}

// Close 关闭数据库连接
func Close() error {
	if DB == nil {
		return nil
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	return sqlDB.Close()
}
