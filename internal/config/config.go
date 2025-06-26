package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
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
	// 尝试从指定的配置文件加载环境变量
	configFile := os.Getenv("CONFIG_FILE")
	if configFile != "" {
		// 如果指定了配置文件路径，尝试加载它
		if err := godotenv.Load(configFile); err != nil {
			fmt.Printf("⚠️  无法加载指定的配置文件 %s: %v\n", configFile, err)
			fmt.Println("将尝试使用默认配置文件或环境变量...")
		} else {
			fmt.Printf("✅ 成功加载配置文件: %s\n", configFile)
		}
	} else {
		// 尝试加载默认的 .env 文件
		godotenv.Load()
	}

	cfg := &Config{
		Server: ServerConfig{
			Host: getEnv("SERVER_HOST", "localhost"),
			Port: getEnvAsInt("SERVER_PORT", 8080),
			Mode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:         getEnv("DB_HOST", "localhost"),
			Port:         getEnvAsInt("DB_PORT", 5432),
			User:         getEnv("DB_USER", "your_username"),
			Password:     getEnv("DB_PASSWORD", "your_password"),
			DBName:       getEnv("DB_NAME", "your_db"),
			SSLMode:      getEnv("DB_SSLMODE", "disable"),
			MaxOpenConns: getEnvAsInt("DB_MAX_OPEN_CONNS", 10),
			MaxIdleConns: getEnvAsInt("DB_MAX_IDLE_CONNS", 5),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "your-secret-key-here"),
			ExpireHours: getEnvAsInt("JWT_EXPIRE_HOURS", 24),
		},
		App: AppConfig{
			Name:              getEnv("APP_NAME", "model_collect"),
			Version:           getEnv("APP_VERSION", "1.0.0"),
			Environment:       getEnv("APP_ENV", "development"),
			EnableAutoMigrate: getEnvAsBool("ENABLE_AUTO_MIGRATE", false),
		},
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
