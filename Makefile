# 高达模型收藏记录程序 - Makefile

.PHONY: help build run clean test deps db-init db-migrate dev

# 默认目标
help:
	@echo "🔧 后端命令:"
	@echo "  build           - 编译后端应用程序"
	@echo "  run             - 运行后端应用程序"
	@echo "  dev             - 后端开发模式运行"
	@echo "  clean           - 清理编译文件"
	@echo "  test            - 运行后端测试"
	@echo "  deps            - 安装/更新后端依赖"
	@echo ""
	@echo "🎨 前端命令:"
	@echo "  frontend-install - 安装前端依赖"
	@echo "  frontend-dev     - 前端开发模式"
	@echo "  frontend-build   - 构建前端生产版本"
	@echo "  frontend-preview - 预览前端构建"
	@echo ""
	@echo "🗄️  数据库命令:"
	@echo "  db-init         - 初始化数据库"
	@echo "  db-sample       - 插入示例数据"
	@echo "  db-add-users    - 添加测试用户账户"
	@echo "  db-update-models- 更新模型表结构（添加parent_id）"
	@echo "  db-check        - 检查数据库约束"
	@echo "  db-migrate      - 运行数据库迁移"
	@echo ""
	@echo "🚀 全栈命令:"
	@echo "  setup           - 完整环境设置"
	@echo "  dev-all         - 同时启动前后端开发服务器"

# 编译应用程序
build:
	@echo "正在编译应用程序..."
	@go build -o bin/server cmd/server/main.go
	@echo "编译完成: bin/server"

# 运行应用程序
run: build
	@echo "启动服务器..."
	@./bin/server

# 开发模式运行（直接运行源码）
dev:
	@echo "开发模式启动..."
	@go run cmd/server/main.go

# 清理编译文件
clean:
	@echo "清理编译文件..."
	@rm -rf bin/
	@echo "清理完成"

# 运行测试
test:
	@echo "运行测试..."
	@go test -v ./...

# 安装/更新依赖
deps:
	@echo "正在安装/更新依赖..."
	@go mod tidy
	@go mod download
	@echo "依赖安装完成"

# 初始化数据库（需要先配置数据库连接）
db-init:
	@echo "初始化数据库..."
	@psql -U postgres -d model_collection -f sql-script/01_init_database.sql
	@echo "数据库初始化完成"

# 插入示例数据
db-sample:
	@echo "插入示例数据..."
	@psql -U postgres -d model_collection -f sql-script/02_sample_data.sql
	@psql -U postgres -d model_collection -f sql-script/03_add_users.sql
	@echo "示例数据插入完成"

# 更新模型表结构（添加parent_id字段）
db-update-models:
	@echo "更新模型表结构..."
	@psql -U postgres -d model_collection -f sql-script/06_add_parent_id_to_models.sql
	@echo "模型表结构更新完成"

# 检查数据库约束
db-check:
	@echo "检查数据库约束..."
	@psql -U postgres -d model_collection -f sql-script/07_check_constraints.sql

# 添加测试用户（使用正确的bcrypt哈希密码）
db-add-users:
	@echo "添加测试用户（admin/admin123, user1/password1, user2/password2）..."
	@psql -U postgres -d model_collection -f sql-script/03_add_users.sql
	@echo "测试用户添加完成"

# 运行数据库迁移
db-migrate: build
	@echo "运行数据库迁移..."
	@DB_MIGRATE_ONLY=true ./bin/server
	@echo "数据库迁移完成"

# 格式化代码
fmt:
	@echo "格式化代码..."
	@go fmt ./...
	@echo "代码格式化完成"

# 代码检查
lint:
	@echo "运行代码检查..."
	@golangci-lint run
	@echo "代码检查完成"

# 前端相关命令
frontend-install:
	@echo "正在安装前端依赖..."
	@cd frontend && npm install
	@echo "前端依赖安装完成"

frontend-dev:
	@echo "启动前端开发服务器..."
	@cd frontend && npm run dev

frontend-build:
	@echo "构建前端生产版本..."
	@cd frontend && npm run build
	@echo "前端构建完成"

frontend-preview:
	@echo "预览前端构建..."
	@cd frontend && npm run preview

# 全栈开发命令
setup: deps frontend-install db-init db-sample
	@echo "✅ 完整开发环境设置完成！"
	@echo ""
	@echo "🚀 启动说明:"
	@echo "  1. 后端: make dev"
	@echo "  2. 前端: make frontend-dev"
	@echo "  3. 同时启动: make dev-all"

dev-all:
	@echo "同时启动前后端开发服务器..."
	@echo "后端: http://localhost:8080"
	@echo "前端: http://localhost:3000"
	@(trap 'kill 0' SIGINT; \
		make dev & \
		make frontend-dev & \
		wait) 