# 高达模型收藏记录程序 - 数据库设计说明

## 概述

本数据库设计遵循"小而美"的原则，为高达模型收藏记录程序提供核心数据存储支持。

## 数据库表结构

### 1. users (用户表)
存储预设用户信息，支持2-5位朋友间共享使用。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| password_hash | VARCHAR(255) | 加密后的密码 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 2. manufacturers (厂商表)
存储厂商基本信息、活跃时间、从属关系等。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| name | VARCHAR(100) | 厂商名称（唯一）|
| full_name | VARCHAR(200) | 厂商全称 |
| founded_date | DATE | 成立时间 |
| active_period_start | DATE | 活跃期开始时间 |
| active_period_end | DATE | 活跃期结束时间（NULL表示仍在活跃）|
| parent_company | VARCHAR(200) | 母公司/从属关系 |
| country | VARCHAR(100) | 国家/地区 |
| website | VARCHAR(300) | 官方网站 |
| description | TEXT | 厂商描述 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 3. models (模型表)
存储高达模型的基本信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| manufacturer_id | INTEGER | 厂商ID（外键）|
| series | VARCHAR(200) | 作品系列（如uc/seed/00/ibo等）|
| category | VARCHAR(20) | 模型等级（默认hg，如hg/mg/rg/pg）|
| name | VARCHAR(300) | 名称（必填）|
| status | VARCHAR(20) | 状态（默认'现货'）|
| release_date | DATE | 上市日期 |
| rating | DECIMAL(2,1) | 评分（0-5，支持0.5）|
| notes | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 4. price_history (价格历史表)
记录模型价格变化历史，支持价格走势图功能。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| model_id | INTEGER | 模型ID（外键）|
| price | DECIMAL(10,2) | 价格（必填）|
| price_date | DATE | 价格记录日期（必填）|
| source | VARCHAR(200) | 价格来源（默认'pdd'）|
| notes | TEXT | 价格备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 5. user_model_purchase (用户模型购买关系表)
记录每个用户对模型的购买状态，支持个性化标记功能。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| user_id | INTEGER | 用户ID（外键）|
| model_id | INTEGER | 模型ID（外键）|
| purchased | BOOLEAN | 是否已购买 |
| purchased_date | DATE | 购买日期 |
| purchased_price | DECIMAL(10,2) | 购买价格 |
| purchase_notes | TEXT | 购买备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**约束：** `(user_id, model_id)` 唯一，确保同一用户对同一模型只有一条记录。

### 6. user_model_favorite (用户模型收藏表)
记录用户收藏的模型，独立于购买状态。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键 |
| user_id | INTEGER | 用户ID（外键）|
| model_id | INTEGER | 模型ID（外键）|
| favorite_notes | TEXT | 收藏备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**约束：** `(user_id, model_id)` 唯一，确保同一用户对同一模型只有一条收藏记录。

## 执行顺序

1. **初始化数据库：** 
   ```bash
   psql -U postgres -f 01_init_database.sql
   ```

2. **插入示例数据：**
   ```bash
   psql -U postgres -d model_collection -f 02_sample_data.sql
   ```

3. **添加用户数据和收藏数据：**
   ```bash
   psql -U postgres -d model_collection -f 03_add_users.sql
   ```

4. **查看评分功能演示：**
   ```bash
   psql -U postgres -d model_collection -f 04_rating_examples.sql
   ```

5. **查看厂商管理功能演示：**
   ```bash
   psql -U postgres -d model_collection -f 05_manufacturer_examples.sql
   ```

## 故障排除

如果遇到locale相关错误，请参考：[LOCALE_FIX.md](./LOCALE_FIX.md)

## 性能优化

### 索引设计
- `idx_manufacturers_name`: 按厂商名称查询优化
- `idx_manufacturers_country`: 按国家查询优化
- `idx_manufacturers_parent_company`: 按母公司查询优化
- `idx_models_manufacturer`: 按厂商查询优化
- `idx_models_series`: 按作品系列查询优化  
- `idx_models_category`: 按模型等级查询优化
- `idx_models_name`: 按名称查询优化
- `idx_models_rating`: 按评分查询和排序优化
- `idx_price_history_model_date`: 价格历史查询优化
- `idx_user_model_purchase_user`: 用户购买记录查询优化
- `idx_user_model_purchase_model`: 模型购买状态查询优化
- `idx_user_model_favorite_user`: 用户收藏记录查询优化
- `idx_user_model_favorite_model`: 模型收藏状态查询优化

### 自动更新机制
- 所有表都配置了 `updated_at` 自动更新触发器

## 常用查询示例

### 1. 查看用户的购买列表
```sql
SELECT m.name, mf.name as manufacturer, m.series, ump.purchased, ump.purchased_date, ump.purchased_price
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
JOIN user_model_purchase ump ON m.id = ump.model_id
WHERE ump.user_id = 1 AND ump.purchased = true
ORDER BY ump.purchased_date DESC;
```

### 2. 查看模型价格历史
```sql
SELECT price, price_date, source
FROM price_history
WHERE model_id = 1
ORDER BY price_date ASC;
```

### 3. 按厂商统计模型数量
```sql
SELECT mf.name as manufacturer, COUNT(m.id) as count
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name
ORDER BY count DESC;
```

### 4. 查看某个模型的所有用户购买状态
```sql
SELECT u.username, ump.purchased, ump.purchased_date, ump.purchased_price
FROM users u
LEFT JOIN user_model_purchase ump ON u.id = ump.user_id AND ump.model_id = 1
ORDER BY u.username;
```

### 5. 查看用户收藏列表
```sql
SELECT m.name, mf.name as manufacturer, m.series, umf.favorite_notes, umf.created_at
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
JOIN user_model_favorite umf ON m.id = umf.model_id
WHERE umf.user_id = 1
ORDER BY umf.created_at DESC;
```

### 6. 查看模型的收藏统计
```sql
SELECT m.name, COUNT(umf.id) as favorite_count
FROM models m
LEFT JOIN user_model_favorite umf ON m.id = umf.model_id
GROUP BY m.id, m.name
ORDER BY favorite_count DESC;
```

### 7. 按评分排序查看模型
```sql
SELECT m.name, mf.name as manufacturer, m.series as work_series, m.category, m.rating, m.status
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
WHERE m.rating IS NOT NULL
ORDER BY m.rating DESC, m.name;
```

### 8. 评分统计分析
```sql
-- 评分分布统计
SELECT rating, COUNT(*) as count
FROM models
WHERE rating IS NOT NULL
GROUP BY rating
ORDER BY rating DESC;

-- 按模型等级统计平均评分
SELECT category, 
       COUNT(*) as model_count,
       AVG(rating) as avg_rating,
       MAX(rating) as max_rating,
       MIN(rating) as min_rating
FROM models
WHERE rating IS NOT NULL
GROUP BY category
ORDER BY avg_rating DESC;

-- 按作品系列统计平均评分
SELECT series, 
       COUNT(*) as model_count,
       AVG(rating) as avg_rating,
       MAX(rating) as max_rating,
       MIN(rating) as min_rating
FROM models
WHERE rating IS NOT NULL
GROUP BY series
ORDER BY avg_rating DESC;
```

### 9. 高评分模型推荐
```sql
SELECT m.name, mf.name as manufacturer, m.series as work_series, m.category, m.rating, m.notes
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
WHERE m.rating >= 4.5
ORDER BY m.rating DESC, m.name;
```

### 10. 厂商详细信息查询
```sql
SELECT 
    name,
    full_name,
    founded_date,
    CASE 
        WHEN active_period_end IS NULL THEN '活跃中'
        ELSE '已停产'
    END as status,
    country,
    parent_company
FROM manufacturers
ORDER BY founded_date;
```

### 11. 厂商模型产量和评分统计
```sql
SELECT 
    mf.name as manufacturer,
    mf.country,
    COUNT(m.id) as model_count,
    ROUND(AVG(m.rating), 2) as avg_rating,
    MAX(m.rating) as max_rating
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name, mf.country
ORDER BY model_count DESC, avg_rating DESC;
```

## 功能特性

### 厂商管理
- 独立的厂商表，标准化厂商信息管理
- 记录厂商基本信息：全称、成立时间、国家等
- 活跃时间管理：记录厂商的活跃期开始和结束时间
- 从属关系：支持记录母公司和子公司关系
- 厂商统计：提供厂商模型产量、评分统计等分析

### 收藏功能
- 用户可以独立收藏感兴趣的模型
- 收藏功能独立于购买状态，允许用户标记想要但还未购买的模型
- 支持为每个收藏添加个人备注
- 提供收藏统计和分析功能

### 购买管理
- 记录详细的购买信息（日期、价格、备注）
- 支持多用户独立的购买状态管理
- 可查看朋友间的购买情况，避免重复购买

### 价格追踪
- 支持多源价格记录
- 为价格走势分析提供数据基础
- 默认价格来源设置为拼多多（pdd）

### 评分系统
- 支持0-5分评分，精度为0.5分（如4.5分）
- 数据库层面约束确保评分有效性
- 支持按评分排序和筛选
- 提供评分统计和分析功能

## 注意事项

1. **密码安全：** 示例数据中的密码hash为占位符，实际应用中需要使用bcrypt加密
2. **数据完整性：** 外键约束确保数据一致性
3. **扩展性：** 表结构支持后续功能扩展
4. **编码：** 数据库使用UTF-8编码，支持中文内容
5. **执行顺序：** 必须按照脚本编号顺序执行，确保依赖关系正确 