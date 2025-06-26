-- 高达模型收藏记录程序 - 添加用户数据
-- 注意：执行此脚本前需要先执行 01_init_database.sql

\c model_collection;

-- 插入预设用户数据 (密码需要在应用层进行加密)
-- 这里使用占位符，实际应用中需要使用bcrypt生成真实的hash值
INSERT INTO users (username, password_hash) VALUES 
    ('admin', '$2a$10$placeholder_hash_admin'),
    ('user1', '$2a$10$placeholder_hash_user1'),
    ('user2', '$2a$10$placeholder_hash_user2'),
    ('user3', '$2a$10$placeholder_hash_user3');

-- 现在可以插入收藏记录了
INSERT INTO user_model_favorite (user_id, model_id, favorite_notes) VALUES 
    (1, 2, '想要的MG版本'),
    (1, 3, '梦想中的PG'),
    (1, 8, '沙扎比真帅'),
    (2, 1, '入门首选'),
    (2, 5, 'Z高达太酷了'),
    (2, 9, 'ν高达经典'),
    (3, 6, '夏亚专用机'),
    (3, 11, '寿屋品质不错'),
    (4, 4, '性价比很高'),
    (4, 10, '铁血系列喜欢'),
    (4, 13, '勇者系列收藏');

-- 验证数据
SELECT 'Users:' as type, COUNT(*) as count FROM users
UNION ALL
SELECT 'Favorites:' as type, COUNT(*) as count FROM user_model_favorite;

-- 查看收藏数据
SELECT u.username, m.name, umf.favorite_notes
FROM user_model_favorite umf
JOIN users u ON umf.user_id = u.id
JOIN models m ON umf.model_id = m.id
ORDER BY u.username, umf.created_at; 