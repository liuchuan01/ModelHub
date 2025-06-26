# 高达模型收藏记录程序 - Makefile

.PHONY: help build run clean test deps db-init db-migrate dev

# 默认目标
help:
	@echo "可用的命令:"
	@echo "  build           - 编译应用程序"
	@echo "  run             - 运行应用程序"
	@echo "  dev             - 开发模式运行"
	@echo "  clean           - 清理编译文件"
	@echo "  test            - 运行测试"
	@echo "  deps            - 安装/更新依赖"
	@echo "  db-init         - 初始化数据库"
	@echo "  db-sample       - 插入示例数据"
	@echo "  db-update-models- 更新模型表结构（添加parent_id）"
	@echo "  db-check        - 检查数据库约束"
	@echo "  db-migrate      - 运行数据库迁移"

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

# 完整的开发流程
setup: deps db-init db-sample
	@echo "开发环境设置完成！"
	@echo "现在可以运行 'make dev' 启动开发服务器" 