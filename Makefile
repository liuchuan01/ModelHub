# Model Collect project-level Makefile

GO_DIR := backend-go
RUST_DIR := backend-rust
FRONTEND_DIR := frontend

.PHONY: help setup dev-all dev-all-go \
	frontend-install frontend-dev frontend-build frontend-preview \
	rust-build rust-run rust-test rust-fmt rust-watch \
	go-build go-run go-dev go-clean go-test go-deps go-fmt go-lint \
	go-db-init go-db-sample go-db-add-users go-db-update-models go-db-check go-db-migrate go-setup

GO_TARGETS := build run dev clean test deps fmt lint \
	db-init db-sample db-add-users db-update-models db-check db-migrate setup

help:
	@echo "📁 项目命令入口（Go legacy + Rust 后端 + 前端）"
	@echo ""
	@echo "Rust 后端:"
	@echo "  rust-build       - cargo build"
	@echo "  rust-run         - cargo run"
	@echo "  rust-test        - cargo test"
	@echo "  rust-watch       - cargo watch -x run"
	@echo ""
	@echo "Go 后端（legacy，位于backend-go/）:"
	@echo "  go-build/go-run/go-dev/... - 透传到 backend-go/Makefile"
	@echo ""
	@echo "前端:"
	@echo "  frontend-install - npm install"
	@echo "  frontend-dev     - npm run dev"
	@echo "  frontend-build   - npm run build"
	@echo "  frontend-preview - npm run preview"
	@echo ""
	@echo "组合命令:"
	@echo "  setup            - Go 后端依赖 + DB + 前端依赖"
	@echo "  dev-all          - 同时启动 Rust 后端与前端"
	@echo "  dev-all-go       - 同时启动 Go 后端与前端"

setup: go-setup frontend-install

dev-all:
	@echo "同时启动 Rust 后端与前端..."
	@echo "后端: http://localhost:8080"
	@echo "前端: http://localhost:3000"
	@(trap 'kill 0' SIGINT; \
		cd $(RUST_DIR) && cargo run & \
		cd $(FRONTEND_DIR) && npm run dev & \
		wait)

dev-all-go:
	@echo "同时启动 Go 后端与前端..."
	@echo "后端: http://localhost:8080"
	@echo "前端: http://localhost:3000"
	@(trap 'kill 0' SIGINT; \
		$(MAKE) -C $(GO_DIR) dev & \
		cd $(FRONTEND_DIR) && npm run dev & \
		wait)

frontend-install:
	@echo "正在安装前端依赖..."
	@cd $(FRONTEND_DIR) && npm install

frontend-dev:
	@echo "启动前端开发服务器..."
	@cd $(FRONTEND_DIR) && npm run dev

frontend-build:
	@echo "构建前端生产版本..."
	@cd $(FRONTEND_DIR) && npm run build

frontend-preview:
	@echo "预览前端构建..."
	@cd $(FRONTEND_DIR) && npm run preview

rust-build:
	@cd $(RUST_DIR) && cargo build

rust-run:
	@cd $(RUST_DIR) && cargo run

rust-test:
	@cd $(RUST_DIR) && cargo test

rust-fmt:
	@cd $(RUST_DIR) && cargo fmt

rust-watch:
	@cd $(RUST_DIR) && cargo watch -x run

$(addprefix go-,$(GO_TARGETS)):
	@cd $(GO_DIR) && $(MAKE) $(patsubst go-%,%,$@)
