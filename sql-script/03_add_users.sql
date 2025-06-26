-- 高达模型收藏记录程序 - 添加用户数据
-- 注意：执行此脚本前需要先执行 01_init_database.sql

\c model_collection;

-- 插入预设用户数据 (密码已使用bcrypt加密)
-- admin/admin123, user1/password1, user2/password2, user3/password3
INSERT INTO users (username, password_hash) VALUES 
    ('admin', '$2a$10$ypd2N0BIXTFPoHh.08rpf.oKWwqf5nhzSVlZ.fN7u.wPCGB9x0ZVG'),
    ('user1', '$2a$10$JilfTSOCDcTZ.J5X8I3UUO.LkAKBtC7cWH2QigsLKUfG1PxITeYbG'),
    ('user2', '$2a$10$MYGxpNTZQn21OVGcc4rRRe///Cs5rHdnoHPOH9T2i7o.3U1qR/Vly'),
    ('user3', '$2a$10$Gd3TrjhRc4MAYvGEaVtu9.vIxfX06M6qmARVcXn95glPeYO3O/wkW');

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