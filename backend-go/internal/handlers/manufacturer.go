package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"model_collect/internal/database"
	"model_collect/internal/models"
)

type ManufacturerHandler struct{}

func NewManufacturerHandler() *ManufacturerHandler {
	return &ManufacturerHandler{}
}

type ManufacturerListQuery struct {
	Page     int    `form:"page,default=1"`
	PageSize int    `form:"page_size,default=20"`
	Search   string `form:"search"`
}

type ManufacturerResponse struct {
	Manufacturers []models.Manufacturer `json:"manufacturers"`
	Total         int64                 `json:"total"`
	Page          int                   `json:"page"`
	PageSize      int                   `json:"page_size"`
	TotalPages    int                   `json:"total_pages"`
}

// GetManufacturers 获取厂商列表
func (h *ManufacturerHandler) GetManufacturers(c *gin.Context) {
	var query ManufacturerListQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "查询参数错误",
			"details": err.Error(),
		})
		return
	}

	// 构建查询
	db := database.DB.Model(&models.Manufacturer{})

	// 搜索条件
	if query.Search != "" {
		db = db.Where("name ILIKE ?", "%"+query.Search+"%")
	}

	// 计算总数
	var total int64
	db.Count(&total)

	// 排序
	db = db.Order("name ASC")

	// 分页
	offset := (query.Page - 1) * query.PageSize
	db = db.Offset(offset).Limit(query.PageSize)

	var manufacturerList []models.Manufacturer
	if err := db.Find(&manufacturerList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "查询厂商失败",
		})
		return
	}

	totalPages := int((total + int64(query.PageSize) - 1) / int64(query.PageSize))

	c.JSON(http.StatusOK, ManufacturerResponse{
		Manufacturers: manufacturerList,
		Total:         total,
		Page:          query.Page,
		PageSize:      query.PageSize,
		TotalPages:    totalPages,
	})
}

// GetManufacturerByID 根据ID获取厂商详情
func (h *ManufacturerHandler) GetManufacturerByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的厂商ID",
		})
		return
	}

	var manufacturer models.Manufacturer
	if err := database.DB.Preload("Models").First(&manufacturer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "厂商不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"manufacturer": manufacturer,
	})
}

// CreateManufacturer 创建新厂商
func (h *ManufacturerHandler) CreateManufacturer(c *gin.Context) {
	var manufacturer models.Manufacturer
	if err := c.ShouldBindJSON(&manufacturer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	if err := database.DB.Create(&manufacturer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "创建厂商失败",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"manufacturer": manufacturer,
	})
}

// UpdateManufacturer 更新厂商
func (h *ManufacturerHandler) UpdateManufacturer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的厂商ID",
		})
		return
	}

	var manufacturer models.Manufacturer
	if err := database.DB.First(&manufacturer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "厂商不存在",
		})
		return
	}

	var updateData models.Manufacturer
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "请求参数错误",
			"details": err.Error(),
		})
		return
	}

	if err := database.DB.Model(&manufacturer).Updates(&updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "更新厂商失败",
		})
		return
	}

	// 重新加载厂商信息
	database.DB.First(&manufacturer, manufacturer.ID)

	c.JSON(http.StatusOK, gin.H{
		"manufacturer": manufacturer,
	})
}

// DeleteManufacturer 删除厂商
func (h *ManufacturerHandler) DeleteManufacturer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的厂商ID",
		})
		return
	}

	var manufacturer models.Manufacturer
	if err := database.DB.First(&manufacturer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "厂商不存在",
		})
		return
	}

	if err := database.DB.Delete(&manufacturer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "删除厂商失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "厂商删除成功",
	})
}