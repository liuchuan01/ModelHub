package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"model_collect/internal/config"
	"model_collect/internal/database"
	"model_collect/internal/routes"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化数据库连接
	if err := database.Initialize(cfg); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	// 自动迁移数据库表结构（仅在明确启用时使用）
	// 注意：生产环境建议使用SQL迁移脚本而不是自动迁移
	if cfg.App.Environment == "development" && cfg.App.EnableAutoMigrate {
		log.Println("正在执行数据库自动迁移...")
		if err := database.AutoMigrate(); err != nil {
			log.Printf("⚠️  数据库自动迁移失败: %v", err)
			log.Println("💡 建议使用SQL脚本手动创建数据库表结构")
			log.Println("💡 可以运行: make db-init 来初始化数据库")
		} else {
			log.Println("✅ 数据库自动迁移完成")
		}
	}

	// 设置路由
	router := routes.SetupRoutes(cfg)

	// 启动服务器
	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)

	server := &http.Server{
		Addr:           addr,
		Handler:        router,
		ReadTimeout:    30 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	// 优雅关闭
	go func() {
		log.Printf("🚀 服务器启动在 http://%s", addr)
		log.Printf("📄 API文档可访问: http://%s/api/health", addr)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("服务器启动失败: %v", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("正在关闭服务器...")

	// 关闭服务器，但不等待超过5秒
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("服务器强制关闭: %v", err)
	}

	log.Println("服务器已退出")
}
