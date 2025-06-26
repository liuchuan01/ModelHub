# 高达模型收藏记录程序 - 前端

基于React + TypeScript + Vite开发的现代化前端界面。

## 🎨 设计特色

### 设计理念
- **博物馆式首页**：留白优雅，舒适浏览
- **侧边栏导航**：清晰的信息架构
- **简洁灰白配色**：现代化视觉风格
- **极简商务风卡片**：突出内容本身

### 核心体验
- **发现新模型**：流畅的浏览和搜索
- **快速标记**：一键收藏、购买标记（含动画）
- **状态管理**：清晰的个人状态展示
- **瀑布流布局**：自然的内容展示

## 🚀 快速开始

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn

### 2. 安装依赖
```bash
cd frontend
npm install
```

### 3. 开发环境启动
```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动，并自动代理后端API到 `http://localhost:8080`。

### 4. 构建生产版本
```bash
npm run build
```

### 5. 预览生产构建
```bash
npm run preview
```

## 📁 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── components/      # 可复用组件
│   │   └── Sidebar.tsx  # 侧边栏导航
│   ├── pages/          # 页面组件
│   │   ├── HomePage.tsx      # 博物馆式首页
│   │   ├── ExplorePage.tsx   # 模型探索页
│   │   ├── ModelDetailPage.tsx # 模型详情页
│   │   ├── FavoritesPage.tsx # 收藏列表页
│   │   └── PurchasedPage.tsx # 购买记录页
│   ├── styles/         # 样式文件
│   │   └── GlobalStyle.ts    # 全局样式
│   ├── types/          # TypeScript类型定义
│   │   └── index.ts    # 主要类型接口
│   ├── hooks/          # 自定义React Hooks
│   ├── services/       # API服务层
│   ├── App.tsx         # 主应用组件
│   └── main.tsx        # 应用入口
├── package.json        # 项目依赖
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
└── README.md          # 项目说明
```

## 🎯 已实现功能

### ✅ 基础架构
- [x] Vite + React + TypeScript 开发环境
- [x] React Router 路由管理
- [x] Styled Components 样式系统
- [x] React Query 状态管理
- [x] 简洁灰白主题配色

### ✅ 核心组件
- [x] 侧边栏导航（响应式）
- [x] 博物馆式首页布局
- [x] 全局样式系统
- [x] TypeScript类型定义

### 🔄 开发中
- [ ] 模型卡片组件（极简商务风）
- [ ] 购买标记动画（购物袋效果）
- [ ] 模型探索页面（瀑布流）
- [ ] 模型详情页面（无图片版本）
- [ ] API集成和数据管理
- [ ] 搜索和筛选功能

## 🛠 技术栈

### 核心框架
- **React 18**: 前端UI框架
- **TypeScript**: 类型安全
- **Vite**: 现代化构建工具

### 样式与UI
- **Styled Components**: CSS-in-JS样式解决方案
- **Lucide React**: 现代化图标库
- **React Spring**: 动画库（用于购买标记动画）

### 状态管理
- **React Query**: 服务端状态管理
- **React Router**: 路由管理

### 工具库
- **Axios**: HTTP客户端
- **React Masonry CSS**: 瀑布流布局

## 🎨 设计令牌

### 颜色系统
```css
/* 主要颜色 */
--color-white: #ffffff
--color-gray-50: #fafafa    /* 主背景 */
--color-gray-100: #f5f5f5   /* 次要背景 */
--color-gray-800: #424242   /* 主文字 */
--color-gray-600: #757575   /* 次要文字 */

/* 强调色 */
--color-blue-500: #2196f3   /* 主要按钮/链接 */
--color-green-500: #4caf50  /* 成功状态 */
```

### 间距系统
- 基础单位：8px
- 小间距：8px, 12px, 16px
- 中等间距：24px, 32px, 48px
- 大间距：64px, 80px

### 动画时长
- 快速：150ms
- 正常：300ms
- 慢速：500ms

## 🔗 API集成

前端通过Vite代理连接后端API：
- 开发环境：`http://localhost:8080/api`
- 自动处理CORS
- 支持JWT认证

## 📱 响应式设计

- **桌面端优先**：>768px 完整功能
- **移动端适配**：<768px 侧边栏隐藏，触摸友好
- **灵活布局**：Grid + Flexbox 自适应

## 🚧 开发规范

### 组件命名
- PascalCase：`ModelCard.tsx`
- 页面组件以`Page`结尾：`HomePage.tsx`

### 样式规范
- 使用CSS变量
- 遵循设计令牌
- 组件级styled-components

### TypeScript规范
- 严格类型检查
- 接口定义在`types/`目录
- 避免`any`类型

## 🔄 下一步计划

1. **完善模型卡片组件**
2. **实现购买标记动画**
3. **开发模型探索页面**
4. **集成后端API**
5. **添加搜索和筛选功能**
6. **优化移动端体验**

---

**开发状态**: 第一版架构完成 ✅  
**下一里程碑**: 核心组件开发 🚧 