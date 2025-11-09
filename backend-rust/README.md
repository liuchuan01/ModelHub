# 高达模型收藏记录程序 - Rust Backend

这是原Go项目的Rust重写版本，采用现代Rust Web开发技术栈。

## 技术栈

- **Web框架**: Axum
- **ORM**: SeaORM
- **数据库**: PostgreSQL
- **认证**: JWT
- **序列化**: Serde
- **验证**: Validator
- **日志**: Tracing

## 项目结构

```
backend-rust/
├── src/
│   ├── main.rs                    # 应用入口
│   ├── config/                    # 配置管理
│   │   ├── mod.rs
│   │   ├── database.rs
│   │   └── auth.rs
│   ├── domain/                    # 领域层
│   │   ├── entities/              # 数据库实体
│   │   │   ├── mod.rs
│   │   │   ├── user.rs
│   │   │   ├── manufacturer.rs
│   │   │   ├── model.rs
│   │   │   ├── price_history.rs
│   │   │   ├── user_model_favorite.rs
│   │   │   └── user_model_purchase.rs
│   │   └── models/                # 数据传输对象
│   │       ├── mod.rs
│   │       ├── auth.rs
│   │       ├── model_dto.rs
│   │       └── manufacturer_dto.rs
│   ├── infrastructure/            # 基础设施层
│   │   ├── database/              # 数据库连接
│   │   │   ├── mod.rs
│   │   │   └── connection.rs
│   │   └── repositories/          # 数据访问层
│   │       ├── mod.rs
│   │       ├── user_repository.rs
│   │       ├── model_repository.rs
│   │       └── manufacturer_repository.rs
│   ├── services/                  # 应用服务层
│   │   ├── mod.rs
│   │   ├── auth_service.rs
│   │   ├── model_service.rs
│   │   └── manufacturer_service.rs
│   └── presentation/              # 表现层
│       ├── handlers/              # HTTP处理器
│       │   ├── mod.rs
│       │   ├── auth.rs
│       │   ├── model.rs
│       │   └── manufacturer.rs
│       ├── middleware/            # 中间件
│       │   ├── mod.rs
│       │   ├── auth.rs
│       │   └── cors.rs
│       └── routes/                # 路由配置
│           └── mod.rs
├── .env.example                   # 环境变量模板
├── .env                           # 环境变量（本地）
└── Cargo.toml                     # 项目配置
```

## 快速开始

### 1. 环境准备

确保已安装：
- Rust 1.70+
- PostgreSQL 12+

### 2. 配置环境变量

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和JWT密钥。

### 3. 运行项目

```bash
# 安装依赖
cargo build

# 运行开发服务器
cargo run

# 或者使用watch模式（需要安装cargo-watch）
cargo watch -x run
```

### 4. API文档

服务器启动后，可以通过以下端点访问API：

- `GET /api/health` - 健康检查
- `POST /api/auth/login` - 用户登录
- `GET /api/models` - 获取模型列表
- `POST /api/models` - 创建模型
- `GET /api/models/:id` - 获取模型详情
- `PUT /api/models/:id` - 更新模型
- `DELETE /api/models/:id` - 删除模型
- `GET /api/manufacturers` - 获取厂商列表
- `POST /api/manufacturers` - 创建厂商

## 特性

- ✅ 现代Rust异步Web开发
- ✅ 清洁架构分层
- ✅ 类型安全的数据库操作
- ✅ JWT认证
- ✅ 输入验证
- ✅ 错误处理
- ✅ 结构化日志
- ✅ CORS支持

## 开发说明

### 代码风格

项目采用标准的Rust代码风格，推荐使用rustfmt格式化代码：

```bash
cargo fmt
```

### 数据库迁移

使用SeaORM的迁移功能管理数据库结构：

```bash
# 创建新的迁移文件
sea-orm-cli migrate init

# 运行迁移
sea-orm-cli migrate up
```

### 测试

运行所有测试：

```bash
cargo test
```

## 部署

### Docker部署

创建 `Dockerfile`：

```dockerfile
FROM rust:1.70 as builder

WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend /usr/local/bin/backend
EXPOSE 8080

CMD ["backend"]
```

### 环境变量

生产环境需要设置以下环境变量：

- `DATABASE_URL`: PostgreSQL连接字符串
- `JWT_SECRET`: JWT签名密钥
- `RUST_LOG`: 日志级别（建议设置为 `info`）

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License