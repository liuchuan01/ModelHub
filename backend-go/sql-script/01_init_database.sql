-- 高达模型收藏记录程序 - 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS model_collection 
    WITH ENCODING 'UTF8' 
    LC_COLLATE='C' 
    LC_CTYPE='C';

\c model_collection;

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户表 - 存储预设用户信息
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- 存储加密后的密码
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 厂商表 - 存储厂商基本信息
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,        -- 厂商名称
    full_name VARCHAR(200),                   -- 厂商全称
    founded_date DATE,                        -- 成立时间
    active_period_start DATE,               -- 活跃期开始时间
    active_period_end DATE,                 -- 活跃期结束时间（null表示仍在活跃）
    parent_company VARCHAR(200),            -- 母公司/从属关系
    country VARCHAR(100),                   -- 国家/地区
    website VARCHAR(300),                   -- 官方网站
    description TEXT,                       -- 厂商描述
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 模型表 - 存储高达模型基本信息
CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES models(id), -- 父模型ID（外键，用于支持换色衍生版本）
    manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id), -- 厂商ID（外键）
    series VARCHAR(200) ,   -- 00/seed/gto/etc
    name VARCHAR(300) NOT NULL,          -- 名称
    status VARCHAR(20) DEFAULT '现货', -- 状态 现货/预售/下架
    category VARCHAR(20) DEFAULT 'hg', -- 分类 hg/mg/rg/pg
    release_date DATE,                     -- 上市日期
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5 AND (rating * 2) = FLOOR(rating * 2)), -- 评分 0-5，支持0.5
    notes TEXT,                           -- 备注
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 价格历史表 - 存储模型价格变化记录
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,         -- 价格
    price_date DATE NOT NULL,             -- 价格记录日期
    source VARCHAR(200) DEFAULT 'pdd',                  -- 价格来源 (可选，如店铺名等)
    notes TEXT,                          -- 价格备注
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 用户模型购买关系表 - 存储用户对模型的购买状态
CREATE TABLE user_model_purchase (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    purchased BOOLEAN DEFAULT FALSE,       -- 是否已购买
    purchased_date DATE,                  -- 购买日期
    purchased_price DECIMAL(10,2),        -- 购买价格
    purchase_notes TEXT,                  -- 购买备注
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, model_id)            -- 确保同一用户对同一模型只有一条记录
);

-- 6. 用户模型收藏表 - 存储用户收藏的模型
CREATE TABLE user_model_favorite (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    favorite_notes TEXT,                  -- 收藏备注
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, model_id)            -- 确保同一用户对同一模型只有一条收藏记录
);

-- 创建索引以优化查询性能
CREATE INDEX idx_manufacturers_name ON manufacturers(name);
CREATE INDEX idx_manufacturers_country ON manufacturers(country);
CREATE INDEX idx_manufacturers_parent_company ON manufacturers(parent_company);
CREATE INDEX idx_models_parent ON models(parent_id);
CREATE INDEX idx_models_manufacturer ON models(manufacturer_id);
CREATE INDEX idx_models_series ON models(series);
CREATE INDEX idx_models_category ON models(category);
CREATE INDEX idx_models_name ON models(name);
CREATE INDEX idx_models_rating ON models(rating);
CREATE INDEX idx_price_history_model_date ON price_history(model_id, price_date);
CREATE INDEX idx_user_model_purchase_user ON user_model_purchase(user_id);
CREATE INDEX idx_user_model_purchase_model ON user_model_purchase(model_id);
CREATE INDEX idx_user_model_favorite_user ON user_model_favorite(user_id);
CREATE INDEX idx_user_model_favorite_model ON user_model_favorite(model_id);

-- 创建更新时间自动更新的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为各表添加更新时间自动更新触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_history_updated_at BEFORE UPDATE ON price_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_model_purchase_updated_at BEFORE UPDATE ON user_model_purchase 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_model_favorite_updated_at BEFORE UPDATE ON user_model_favorite 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS '用户表 - 存储预设用户信息';
COMMENT ON TABLE manufacturers IS '厂商表 - 存储厂商基本信息、活跃时间、从属关系等';
COMMENT ON TABLE models IS '模型表 - 存储高达模型基本信息，支持通过parent_id实现衍生版本（如换色版）的关联';
COMMENT ON TABLE price_history IS '价格历史表 - 存储模型价格变化记录';
COMMENT ON TABLE user_model_purchase IS '用户模型购买关系表 - 存储用户对模型的购买状态';
COMMENT ON TABLE user_model_favorite IS '用户模型收藏表 - 存储用户收藏的模型'; 