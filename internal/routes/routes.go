package routes

import (
	"github.com/gin-gonic/gin"

	"model_collect/internal/config"
	"model_collect/internal/handlers"
	"model_collect/internal/middleware"
)

// SetupRoutes 设置路由
func SetupRoutes(cfg *config.Config) *gin.Engine {
	// 设置Gin模式
	gin.SetMode(cfg.Server.Mode)

	router := gin.Default()

	// 中间件
	router.Use(middleware.CORS())
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// 初始化处理器
	authHandler := handlers.NewAuthHandler(cfg)
	modelHandler := handlers.NewModelHandler()

	// API路由组
	api := router.Group("/api")
	{
		// 健康检查
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"message": "服务运行正常",
				"version": cfg.App.Version,
			})
		})

		// 认证相关路由（无需JWT）
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
		}

		// 需要JWT认证的路由
		authorized := api.Group("")
		authorized.Use(middleware.JWTAuth(cfg))
		{
			// 用户相关
			authorized.GET("/user/profile", authHandler.GetCurrentUser)

			// 模型相关
			models := authorized.Group("/models")
			{
				models.GET("", modelHandler.GetModels)
				models.POST("", modelHandler.CreateModel)
				models.GET("/:id", modelHandler.GetModelByID)
				models.GET("/:id/variants", modelHandler.GetModelVariants)
				models.PUT("/:id", modelHandler.UpdateModel)
				models.DELETE("/:id", modelHandler.DeleteModel)
			}

			// 厂商相关（后续可扩展）
			// manufacturers := authorized.Group("/manufacturers")

			// 价格历史相关（后续可扩展）
			// priceHistory := authorized.Group("/price-history")

			// 用户收藏和购买状态相关（后续可扩展）
			// userActions := authorized.Group("/user")
		}
	}

	return router
}
