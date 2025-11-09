# 高达模型收藏记录程序

一个用于管理高达模型收藏的全栈项目。后端正在从 Go 迁移到 Rust，目前仓库同时保留：

- `backend-rust/` —— Axum + SeaORM 编写的全新主力后端。
- `backend-go/` —— 旧的 Gin + GORM 后端（只读/兼容用途）。
- `frontend/` —— React + TypeScript + Vite 前端。

## 项目结构

```
model_collect/
├── backend-rust/         # Rust 后端（主力）
├── backend-go/           # Go 后端（legacy，含 SQL 脚本）
├── frontend/             # 前端工程
├── docs/                 # 需求、进度等文档
├── Makefile              # 顶层命令入口（Rust/Go/前端）
└── ...                   # 其余研发资产
```

## 技术栈概览

| 模块      | 技术                                                                 |
| --------- | -------------------------------------------------------------------- |
| 后端 (Rust)| Axum · SeaORM · PostgreSQL · JWT · Tracing                          |
| 前端      | React · TypeScript · Vite · Tailwind                                 |
| Legacy Go | Gin · GORM · PostgreSQL · JWT                                        |

## 快速开始

### 1. Rust 后端（推荐）

```bash
cp backend-rust/.env.example backend-rust/.env   # 如果还没有 .env
make rust-build                                 # 编译
make rust-run                                   # 运行，默认监听 http://localhost:8080
```

常用命令（也可以 `cd backend-rust` 后直接使用 `cargo`）：

| 命令            | 说明                  |
| --------------- | --------------------- |
| `make rust-run` | 启动开发服务器        |
| `make rust-test`| 运行测试              |
| `make rust-fmt` | 格式化                |
| `make rust-watch` | `cargo watch -x run`（需安装 `cargo-watch`） |

### 2. 前端

```bash
make frontend-install   # 安装依赖
make frontend-dev       # 本地开发，http://localhost:3000
```

### 3. Legacy Go 后端

Go 版本被移动到 `backend-go/` 目录中，包含所有历史代码、SQL 脚本与工具。

```bash
cd backend-go
cp config.env.example .env                      # 可选
make setup                                      # 安装依赖 + 初始化数据库（需要本地 PostgreSQL）
make dev                                        # 以源码模式运行
```

如需在顶层调用，可使用 `make go-dev`, `make go-build`, `make go-db-init` 等别名，这些命令会自动转发到 `backend-go/Makefile`。

## 数据库

- 默认数据库：PostgreSQL。
- SQL 初始化脚本位于 `backend-go/sql-script/`。
- Rust 版本使用 SeaORM（内置迁移），也可以复用上述 SQL 进行初始化。

## 常用顶层命令

| 命令           | 描述                                  |
| -------------- | ------------------------------------- |
| `make help`    | 查看当前命令速览                      |
| `make dev-all` | 同时启动 Rust 后端和前端               |
| `make dev-all-go` | 同时启动 Go 后端和前端             |
| `make setup`   | Legacy Go 后端 + 前端依赖快速配置     |

## 迁移说明

- Go 版本完整保存在 `backend-go/` 中，方便对照或回滚。
- 新开发应以 `backend-rust/` 为准，目录内的 `README.md` 提供了更深入的模块说明、API 列表与开发指南。

欢迎在迁移过程中持续完善文档与脚本（例如为 rust 后端补充数据库迁移或 Docker 化支持）。
