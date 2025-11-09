package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"model_collect/internal/config"
	"model_collect/internal/database"
	"model_collect/internal/middleware"
	"model_collect/internal/models"
)

type AuthHandler struct {
	config *config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{config: cfg}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token     string      `json:"token"`
	User      models.User `json:"user"`
	ExpiresIn int         `json:"expires_in"`
}

// Login 用户登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	// 查找用户
	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户名或密码错误",
		})
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户名或密码错误",
		})
		return
	}

	// 生成JWT令牌
	token, err := middleware.GenerateToken(user.ID, user.Username, h.config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "生成认证令牌失败",
		})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		Token:     token,
		User:      user,
		ExpiresIn: h.config.JWT.ExpireHours * 3600, // 转换为秒
	})
}

// GetCurrentUser 获取当前用户信息
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "未找到用户信息",
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
