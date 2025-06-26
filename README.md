# 高达模型收藏记录程序 - 后端

基于Go Gin框架开发的高达模型收藏管理后端API服务。

## 功能特性

- 🔐 JWT身份认证
- 📋 模型信息CRUD操作
- 🏭 厂商信息管理
- 📊 价格历史追踪
- ⭐ 用户收藏功能
- 🛒 购买状态管理
- 🔍 多条件搜索与排序
- 📖 分页查询

## 技术栈

- **Web框架**: Gin
- **数据库**: PostgreSQL
- **ORM**: GORM
- **认证**: JWT
- **密码加密**: bcrypt

## 目录结构

```
model_collect/
├── cmd/
│   └── server/          # 应用程序入口
├── internal/
│   ├── config/          # 配置管理
│   ├── database/        # 数据库连接
│   ├── models/          # 数据模型
│   ├── handlers/        # HTTP处理器
│   ├── middleware/      # 中间件
│   └── routes/          # 路由配置
├── sql-script/          # 数据库脚本
├── docs/                # 项目文档
├── go.mod               # Go模块文件
└── config.yaml          # 配置文件
```

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Go 1.21 或更高版本
- PostgreSQL 12 或更高版本

### 2. 安装依赖

```bash
go mod tidy
```

### 3. 数据库配置

#### 创建数据库
```bash
# 连接到PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE model_collection;
```

#### 执行初始化脚本
```bash
# 执行数据库初始化脚本
psql -U postgres -d model_collection -f sql-script/01_init_database.sql

# 可选：插入示例数据
psql -U postgres -d model_collection -f sql-script/02_sample_data.sql
psql -U postgres -d model_collection -f sql-script/03_add_users.sql
```

### 4. 配置环境变量

创建`.env`文件（参考config.yaml）：
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=你的密码
DB_NAME=model_collection
DB_SSLMODE=disable

# 服务器配置
SERVER_PORT=8080
SERVER_HOST=localhost

# JWT配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRE_HOURS=24

# 应用配置
APP_ENV=development
APP_NAME=model_collect
```

### 5. 运行服务

```bash
go run cmd/server/main.go
```

服务将在 `http://localhost:8080` 启动。

## API接口

### 认证接口

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "用户名",
  "password": "密码"
}
```

#### 获取当前用户信息
```http
GET /api/user/profile
Authorization: Bearer <token>
```

### 模型管理接口

#### 获取模型列表
```http
GET /api/models?page=1&page_size=20&search=自由&category=hg&sort_by=name
Authorization: Bearer <token>
```

#### 获取模型详情
```http
GET /api/models/{id}
Authorization: Bearer <token>
```

#### 获取模型衍生版本
```http
GET /api/models/{id}/variants
Authorization: Bearer <token>
```

#### 创建模型
```http
POST /api/models
Authorization: Bearer <token>
Content-Type: application/json

{
  "manufacturer_id": 1,
  "series": "SEED",
  "name": "自由高达",
  "category": "hg",
  "status": "现货",
  "rating": 4.5,
  "notes": "备注信息"
}
```

#### 创建衍生版本模型（换色版）
```http
POST /api/models
Authorization: Bearer <token>
Content-Type: application/json

{
  "parent_id": 1,
  "manufacturer_id": 1,
  "series": "SEED",
  "name": "自由高达 (金色涂装版)",
  "category": "hg",
  "status": "现货",
  "rating": 4.5,
  "notes": "限定金色涂装版本"
}
```

#### 更新模型
```http
PUT /api/models/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新后的名称",
  "rating": 5.0
}
```

#### 删除模型
```http
DELETE /api/models/{id}
Authorization: Bearer <token>
```

### 健康检查
```http
GET /api/health
```

## 数据模型

### 用户 (User)
- ID: 主键
- Username: 用户名
- PasswordHash: 密码哈希
- CreatedAt/UpdatedAt: 时间戳

### 厂商 (Manufacturer)
- ID: 主键
- Name: 厂商名称
- FullName: 厂商全称
- Country: 国家
- Website: 官网
- 活跃时间范围
- 从属关系

### 模型 (Model)
- ID: 主键
- ParentID: 父模型ID（支持换色衍生版本）
- ManufacturerID: 厂商ID
- Series: 作品系列
- Name: 模型名称
- Category: 分类(hg/mg/rg/pg)
- Status: 状态(现货/预售/下架)
- Rating: 评分(0-5分)
- ReleaseDate: 上市日期
- Notes: 备注

### 价格历史 (PriceHistory)
- ModelID: 模型ID
- Price: 价格
- PriceDate: 价格日期
- Source: 价格来源

### 用户收藏/购买关系
- UserID: 用户ID
- ModelID: 模型ID
- 状态和备注信息

## 开发说明

### 代码规范
- 遵循Go标准代码规范
- 使用中文注释和错误信息
- 遵循MVC架构模式
- 数据库操作使用GORM

### 扩展功能
框架已预留接口，可轻松扩展：
- 厂商管理接口
- 价格历史管理
- 用户收藏功能
- 购买状态管理
- 统计分析功能

## 许可证

本项目仅用于学习和个人使用。 