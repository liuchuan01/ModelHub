-- 为models表添加parent_id字段的迁移脚本
-- 执行时间: 2024年

\c model_collection;

-- 添加parent_id字段
ALTER TABLE models 
ADD COLUMN parent_id INTEGER REFERENCES models(id);

-- 为parent_id字段添加索引
CREATE INDEX idx_models_parent ON models(parent_id);

-- 添加注释
COMMENT ON COLUMN models.parent_id IS '父模型ID，用于支持换色衍生版本的关联';

-- 更新表注释
COMMENT ON TABLE models IS '模型表 - 存储高达模型基本信息，支持通过parent_id实现衍生版本（如换色版）的关联';

-- 验证字段是否添加成功
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'models' AND column_name = 'parent_id'; 