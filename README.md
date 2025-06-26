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
│   └── server/          # 后端应用程序入口
├── internal/
│   ├── config/          # 配置管理
│   ├── database/        # 数据库连接
│   ├── models/          # 数据模型
│   ├── handlers/        # HTTP处理器
│   ├── middleware/      # 中间件
│   └── routes/          # 路由配置
├── frontend/            # React前端项目
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── pages/       # 页面组件
│   │   ├── styles/      # 样式文件
│   │   └── types/       # TypeScript类型
│   ├── package.json     # 前端依赖
│   └── README.md        # 前端说明
├── sql-script/          # 数据库脚本
├── docs/                # 项目文档
├── go.mod               # Go模块文件
├── config.yaml          # 配置文件
└── Makefile            # 构建脚本
```

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Go 1.21 或更高版本
- Node.js 18 或更高版本
- PostgreSQL 12 或更高版本

### 2. 一键环境设置

```bash
make setup
```

这将自动完成：
- 安装后端Go依赖
- 安装前端Node.js依赖  
- 初始化数据库
- 插入示例数据

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
ENABLE_AUTO_MIGRATE=false  # 是否启用GORM自动迁移（推荐false）
```

### 5. 启动开发服务器

#### 方式一：同时启动前后端
```bash
make dev-all
```

#### 方式二：分别启动
```bash
# 终端1: 启动后端 (http://localhost:8080)
make dev

# 终端2: 启动前端 (http://localhost:3000)  
make frontend-dev
```

访问 `http://localhost:3000` 使用完整应用。

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

## 故障排除

### 数据库自动迁移错误

如果您看到类似以下的错误：
```
Warning: Auto migration failed: failed to auto migrate: ERROR: constraint "uni_users_username" of relation "users" does not exist
```

这是因为GORM自动迁移与现有数据库结构不兼容。解决方案：

1. **推荐方法：使用SQL脚本初始化数据库**
   ```bash
   # 确保ENABLE_AUTO_MIGRATE=false或未设置
   make db-init
   ```

2. **检查约束名称**
   ```bash
   psql -U postgres -d model_collection -f sql-script/07_check_constraints.sql
   ```

3. **更新现有数据库结构**
   ```bash
   make db-update-models
   ```

### 环境变量说明

- `ENABLE_AUTO_MIGRATE=true`: 启用GORM自动迁移（仅开发环境推荐）
- `ENABLE_AUTO_MIGRATE=false`: 禁用自动迁移，使用SQL脚本（生产环境推荐）

## 📊 项目状态

### ✅ 已完成
- **后端框架**：完整的Go Gin API服务
- **数据库设计**：支持父子模型关系的PostgreSQL数据库
- **前端架构**：React + TypeScript + Vite现代化前端框架
- **设计系统**：简洁灰白主题配色方案
- **开发工具**：统一的Makefile构建脚本

### 🚧 开发中
- **模型卡片组件**：极简商务风设计
- **购买标记动画**：购物袋动画效果
- **模型探索页面**：瀑布流布局
- **API集成**：前后端数据连接

### 🔄 计划中
- **搜索筛选功能**：多维度模型筛选
- **移动端优化**：响应式设计完善
- **用户认证**：登录状态管理
- **数据可视化**：价格走势图表

## 🎯 设计亮点

1. **博物馆式首页**：留白优雅，突出内容
2. **父子模型关系**：支持换色衍生版本
3. **购物袋动画**：增强交互愉悦感
4. **瀑布流布局**：自然的内容展示
5. **简洁配色**：现代化视觉体验

## 许可证

本项目仅用于学习和个人使用。 