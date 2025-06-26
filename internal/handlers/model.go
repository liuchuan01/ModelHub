package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"model_collect/internal/database"
	"model_collect/internal/models"
)

type ModelHandler struct{}

func NewModelHandler() *ModelHandler {
	return &ModelHandler{}
}

type ModelListQuery struct {
	Page         int    `form:"page,default=1"`
	PageSize     int    `form:"page_size,default=20"`
	Search       string `form:"search"`
	Manufacturer string `form:"manufacturer"`
	Series       string `form:"series"`
	Category     string `form:"category"`
	Status       string `form:"status"`
	SortBy       string `form:"sort_by,default=created_at"`
	SortOrder    string `form:"sort_order,default=desc"`
}

type ModelResponse struct {
	Models     []models.Model `json:"models"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	PageSize   int            `json:"page_size"`
	TotalPages int            `json:"total_pages"`
}

// GetModels 获取模型列表
func (h *ModelHandler) GetModels(c *gin.Context) {
	var query ModelListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "查询参数错误",
			"details": err.Error(),
		})
		return
	}

	// 构建查询
	db := database.DB.Model(&models.Model{}).Preload("Manufacturer")

	// 搜索条件
	if query.Search != "" {
		db = db.Where("name ILIKE ?", "%"+query.Search+"%")
	}
	if query.Manufacturer != "" {
		db = db.Joins("JOIN manufacturers ON models.manufacturer_id = manufacturers.id").
			Where("manufacturers.name ILIKE ?", "%"+query.Manufacturer+"%")
	}
	if query.Series != "" {
		db = db.Where("series ILIKE ?", "%"+query.Series+"%")
	}
	if query.Category != "" {
		db = db.Where("category = ?", query.Category)
	}
	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	}

	// 计算总数
	var total int64
	db.Count(&total)

	// 排序
	orderBy := query.SortBy + " " + query.SortOrder
	if query.SortBy == "manufacturer" {
		orderBy = "manufacturers.name " + query.SortOrder
		db = db.Joins("JOIN manufacturers ON models.manufacturer_id = manufacturers.id")
	}
	db = db.Order(orderBy)

	// 分页
	offset := (query.Page - 1) * query.PageSize
	db = db.Offset(offset).Limit(query.PageSize)

	var modelList []models.Model
	if err := db.Find(&modelList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "查询模型失败",
		})
		return
	}

	totalPages := int((total + int64(query.PageSize) - 1) / int64(query.PageSize))

	c.JSON(http.StatusOK, ModelResponse{
		Models:     modelList,
		Total:      total,
		Page:       query.Page,
		PageSize:   query.PageSize,
		TotalPages: totalPages,
	})
}

// GetModelByID 根据ID获取模型详情
func (h *ModelHandler) GetModelByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	var model models.Model
	if err := database.DB.Preload("Manufacturer").
		Preload("Parent").
		Preload("Children").
		Preload("PriceHistory").
		First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"model": model,
	})
}

// CreateModel 创建新模型
func (h *ModelHandler) CreateModel(c *gin.Context) {
	var model models.Model
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	// 验证厂商是否存在
	var manufacturer models.Manufacturer
	if err := database.DB.First(&manufacturer, model.ManufacturerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "指定的厂商不存在",
		})
		return
	}

	// 验证父模型是否存在（如果指定了parent_id）
	if model.ParentID != nil {
		var parentModel models.Model
		if err := database.DB.First(&parentModel, *model.ParentID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "指定的父模型不存在",
			})
			return
		}
	}

	if err := database.DB.Create(&model).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "创建模型失败",
		})
		return
	}

	// 重新加载模型以包含关联数据
	database.DB.Preload("Manufacturer").Preload("Parent").Preload("Children").First(&model, model.ID)

	c.JSON(http.StatusCreated, gin.H{
		"model": model,
	})
}

// UpdateModel 更新模型
func (h *ModelHandler) UpdateModel(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	var model models.Model
	if err := database.DB.First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	var updateData models.Model
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	// 如果更新厂商ID，验证厂商是否存在
	if updateData.ManufacturerID != 0 && updateData.ManufacturerID != model.ManufacturerID {
		var manufacturer models.Manufacturer
		if err := database.DB.First(&manufacturer, updateData.ManufacturerID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "指定的厂商不存在",
			})
			return
		}
	}

	// 如果更新父模型ID，验证父模型是否存在，并且不能自引用
	if updateData.ParentID != nil {
		if *updateData.ParentID == model.ID {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "模型不能设置自己为父模型",
			})
			return
		}
		var parentModel models.Model
		if err := database.DB.First(&parentModel, *updateData.ParentID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "指定的父模型不存在",
			})
			return
		}
	}

	if err := database.DB.Model(&model).Updates(&updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "更新模型失败",
		})
		return
	}

	// 重新加载模型以包含关联数据
	database.DB.Preload("Manufacturer").Preload("Parent").Preload("Children").First(&model, model.ID)

	c.JSON(http.StatusOK, gin.H{
		"model": model,
	})
}

// DeleteModel 删除模型
func (h *ModelHandler) DeleteModel(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	var model models.Model
	if err := database.DB.First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	if err := database.DB.Delete(&model).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "删除模型失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "模型删除成功",
	})
}

// GetModelVariants 获取模型的所有衍生版本（包括子模型和兄弟模型）
func (h *ModelHandler) GetModelVariants(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	var model models.Model
	if err := database.DB.First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	var variants []models.Model

	// 如果这个模型有父模型，获取所有兄弟模型（包括自己）
	if model.ParentID != nil {
		database.DB.Preload("Manufacturer").Where("parent_id = ?", *model.ParentID).Find(&variants)
	} else {
		// 如果这个模型没有父模型，获取它的所有子模型
		database.DB.Preload("Manufacturer").Where("parent_id = ?", model.ID).Find(&variants)
		// 同时包含自己
		var self models.Model
		database.DB.Preload("Manufacturer").First(&self, model.ID)
		variants = append([]models.Model{self}, variants...)
	}

	c.JSON(http.StatusOK, gin.H{
		"variants": variants,
		"total":    len(variants),
	})
}

// FavoriteModel 收藏模型
func (h *ModelHandler) FavoriteModel(c *gin.Context) {
	idStr := c.Param("id")
	modelID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	// 检查模型是否存在
	var model models.Model
	if err := database.DB.First(&model, modelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	// 检查是否已经收藏
	var favorite models.UserModelFavorite
	if err := database.DB.Where("user_id = ? AND model_id = ?", userID, modelID).First(&favorite).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "模型已经收藏",
		})
		return
	}

	// 创建收藏记录
	var favoriteRequest struct {
		Note string `json:"note"`
	}
	c.ShouldBindJSON(&favoriteRequest)

	favorite = models.UserModelFavorite{
		UserID:        userID,
		ModelID:       uint(modelID),
		FavoriteNotes: &favoriteRequest.Note,
	}

	if err := database.DB.Create(&favorite).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "收藏失败",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "收藏成功",
		"favorite": favorite,
	})
}

// UnfavoriteModel 取消收藏模型
func (h *ModelHandler) UnfavoriteModel(c *gin.Context) {
	idStr := c.Param("id")
	modelID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	// 删除收藏记录
	result := database.DB.Where("user_id = ? AND model_id = ?", userID, modelID).Delete(&models.UserModelFavorite{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "取消收藏失败",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "收藏记录不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "取消收藏成功",
	})
}

// MarkAsPurchased 标记模型为已购买
func (h *ModelHandler) MarkAsPurchased(c *gin.Context) {
	idStr := c.Param("id")
	modelID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	// 检查模型是否存在
	var model models.Model
	if err := database.DB.First(&model, modelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "模型不存在",
		})
		return
	}

	// 检查是否已经购买
	var purchase models.UserModelPurchase
	if err := database.DB.Where("user_id = ? AND model_id = ?", userID, modelID).First(&purchase).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "模型已经标记为购买",
		})
		return
	}

	// 创建购买记录
	var purchaseRequest struct {
		PurchasedDate  string  `json:"purchased_date"`
		PurchasedPrice float64 `json:"purchased_price"`
		Note           string  `json:"note"`
	}
	if err := c.ShouldBindJSON(&purchaseRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	// 解析时间
	var purchasedDate *time.Time
	if purchaseRequest.PurchasedDate != "" {
		if parsedTime, err := time.Parse("2006-01-02", purchaseRequest.PurchasedDate); err == nil {
			purchasedDate = &parsedTime
		}
	}

	var purchasedPrice *float64
	if purchaseRequest.PurchasedPrice > 0 {
		purchasedPrice = &purchaseRequest.PurchasedPrice
	}

	purchase = models.UserModelPurchase{
		UserID:         userID,
		ModelID:        uint(modelID),
		Purchased:      true,
		PurchasedDate:  purchasedDate,
		PurchasedPrice: purchasedPrice,
		PurchaseNotes:  &purchaseRequest.Note,
	}

	if err := database.DB.Create(&purchase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "标记购买失败",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "标记购买成功",
		"purchase": purchase,
	})
}

// UnmarkAsPurchased 取消购买标记
func (h *ModelHandler) UnmarkAsPurchased(c *gin.Context) {
	idStr := c.Param("id")
	modelID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的模型ID",
		})
		return
	}

	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	// 删除购买记录
	result := database.DB.Where("user_id = ? AND model_id = ?", userID, modelID).Delete(&models.UserModelPurchase{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "取消购买标记失败",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "购买记录不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "取消购买标记成功",
	})
}

// GetUserFavorites 获取用户收藏的模型列表
func (h *ModelHandler) GetUserFavorites(c *gin.Context) {
	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	var favorites []models.UserModelFavorite
	if err := database.DB.Preload("Model.Manufacturer").
		Where("user_id = ?", userID).
		Find(&favorites).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取收藏列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"favorites": favorites,
		"total":     len(favorites),
	})
}

// GetUserPurchases 获取用户购买的模型列表
func (h *ModelHandler) GetUserPurchases(c *gin.Context) {
	// 从JWT中获取用户ID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "用户未登录",
		})
		return
	}
	userID := userIDInterface.(uint)

	var purchases []models.UserModelPurchase
	if err := database.DB.Preload("Model.Manufacturer").
		Where("user_id = ?", userID).
		Find(&purchases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取购买列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"purchases": purchases,
		"total":     len(purchases),
	})
}
