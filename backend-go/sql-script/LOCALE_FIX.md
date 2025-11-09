# 数据库Locale错误修复说明

## 问题描述
执行数据库初始化脚本时遇到以下错误：
```
[42809] ERROR: invalid LC_COLLATE locale name: "zh_CN.UTF-8"
Hint: If the locale name is specific to ICU, use ICU_LOCALE.
```

## 解决方案

### 1. Locale修复
将数据库创建语句中的locale设置从：
```sql
CREATE DATABASE IF NOT EXISTS model_collection 
    WITH ENCODING 'UTF8' 
    LC_COLLATE='zh_CN.UTF-8' 
    LC_CTYPE='zh_CN.UTF-8';
```

修改为：
```sql
CREATE DATABASE IF NOT EXISTS model_collection 
    WITH ENCODING 'UTF8' 
    LC_COLLATE='C' 
    LC_CTYPE='C';
```

### 2. 替代方案
如果你的系统支持中文locale，也可以尝试：
- macOS/Linux: `LC_COLLATE='C'` 或 `LC_COLLATE='en_US.UTF-8'`
- Windows: `LC_COLLATE='C'` 
- Docker PostgreSQL: 通常使用 `LC_COLLATE='C'`

## 表结构优化

### Models表字段调整
根据用户需求，优化了模型表结构：

**原结构：**
- `series` - 模型系列等级（如hg/mg/rg/pg）

**新结构：**
- `series` - 作品系列（如uc/seed/00/ibo等）
- `category` - 模型等级（如hg/mg/rg/pg等，默认'hg'）

### 示例数据更新
更新了示例数据以反映新的字段结构：
- UC系列：RX-78-2 高达、Z高达等
- CCA系列：沙扎比、ν高达等  
- IBO系列：巴巴托斯等
- Unicorn系列：独角兽高达等

### 查询脚本适配
- 更新了所有相关查询脚本
- 新增按模型等级和作品系列的双重统计
- 优化了厂商管理相关查询

## 执行顺序

修复后的正确执行顺序：
```bash
# 1. 初始化数据库和表结构
psql -U postgres -f 01_init_database.sql

# 2. 插入厂商和模型数据
psql -U postgres -d model_collection -f 02_sample_data.sql

# 3. 添加用户和收藏数据
psql -U postgres -d model_collection -f 03_add_users.sql

# 4. 查看评分功能演示
psql -U postgres -d model_collection -f 04_rating_examples.sql

# 5. 查看厂商管理功能演示
psql -U postgres -d model_collection -f 05_manufacturer_examples.sql
```

## 验证修复
执行以下命令验证数据库创建成功：
```sql
\c model_collection;
\dt  -- 查看所有表
SELECT COUNT(*) FROM models;  -- 应该显示13条记录
SELECT COUNT(*) FROM manufacturers;  -- 应该显示5条记录
```

如果仍有locale问题，请检查PostgreSQL配置或使用Docker PostgreSQL镜像。 