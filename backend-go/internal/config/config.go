package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	App      AppConfig
}

type ServerConfig struct {
	Host string
	Port int
	Mode string
}

type DatabaseConfig struct {
	Host         string
	Port         int
	User         string
	Password     string
	DBName       string
	SSLMode      string
	MaxOpenConns int
	MaxIdleConns int
}

type JWTConfig struct {
	Secret      string
	ExpireHours int
}

type AppConfig struct {
	Name              string
	Version           string
	Environment       string
	EnableAutoMigrate bool
}

func Load() (*Config, error) {
	// 从环境变量加载配置
	cfg := &Config{
		Server: ServerConfig{
			Host: getEnv("SERVER_HOST", "localhost"),
			Port: getEnvAsInt("SERVER_PORT", 8080),
			Mode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:         getEnv("DB_HOST", "localhost"),
			Port:         getEnvAsInt("DB_PORT", 5432),
			User:         os.Getenv("DB_USER"),
			Password:     os.Getenv("DB_PASSWORD"),
			DBName:       os.Getenv("DB_NAME"),
			SSLMode:      getEnv("DB_SSLMODE", "disable"),
			MaxOpenConns: getEnvAsInt("DB_MAX_OPEN_CONNS", 10),
			MaxIdleConns: getEnvAsInt("DB_MAX_IDLE_CONNS", 5),
		},
		JWT: JWTConfig{
			Secret:      os.Getenv("JWT_SECRET"),
			ExpireHours: getEnvAsInt("JWT_EXPIRE_HOURS", 24),
		},
		App: AppConfig{
			Name:              getEnv("APP_NAME", "model_collect"),
			Version:           getEnv("APP_VERSION", "1.0.0"),
			Environment:       getEnv("APP_ENV", "development"),
			EnableAutoMigrate: getEnvAsBool("ENABLE_AUTO_MIGRATE", false),
		},
	}

	// 验证必需的环境变量
	if err := validateConfig(cfg); err != nil {
		return nil, fmt.Errorf("配置验证失败: %w", err)
	}

	return cfg, nil
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.DBName,
		c.Database.SSLMode,
	)
}

// 验证必需的配置项
func validateConfig(cfg *Config) error {
	missingVars := []string{}

	if cfg.Database.User == "" {
		missingVars = append(missingVars, "DB_USER")
	}
	if cfg.Database.Password == "" {
		missingVars = append(missingVars, "DB_PASSWORD")
	}
	if cfg.Database.DBName == "" {
		missingVars = append(missingVars, "DB_NAME")
	}
	if cfg.JWT.Secret == "" {
		missingVars = append(missingVars, "JWT_SECRET")
	}

	if len(missingVars) > 0 {
		return fmt.Errorf("以下必需的环境变量未设置: %v", missingVars)
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
