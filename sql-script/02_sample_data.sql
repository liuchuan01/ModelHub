-- 高达模型收藏记录程序 - 示例数据脚本
-- 注意：执行此脚本前需要先执行 01_init_database.sql

\c model_collection;

-- 插入厂商数据
INSERT INTO manufacturers (name, full_name, founded_date, active_period_start, active_period_end, parent_company, country, website, description) VALUES 
    ('万代', '万代股份有限公司', '1950-07-05', '1980-01-01', NULL, NULL, '日本', 'https://www.bandai.co.jp', '日本知名玩具和模型制造商，高达模型的主要生产厂商'),
    ('寿屋', '株式会社寿屋', '1953-01-01', '1998-01-01', NULL, NULL, '日本', 'https://www.kotobukiya.co.jp', '日本模型制造商，以Frame Arms和美少女手办闻名'),
    ('Moderoid', 'Good Smile Company', '2001-05-01', '2015-01-01', NULL, 'Good Smile Company', '日本', 'https://www.goodsmile.info', 'Good Smile Company旗下机器人模型品牌'),
    ('青岛', '青岛文化教材社', '1968-01-01', '1990-01-01', NULL, NULL, '日本', 'https://www.aoshima-bk.co.jp', '日本模型制造商，主要生产汽车和机器人模型'),
    ('田宫', '田宫模型有限公司', '1946-01-01', '1960-01-01', NULL, NULL, '日本', 'https://www.tamiya.com', '世界知名模型制造商，以精密度和质量著称');

-- 插入一些经典高达模型数据
INSERT INTO models (manufacturer_id, series, category, name, release_date, rating, notes) VALUES 
    (1, 'uc', 'rg', 'RX-78-2 高达', '2010-07-31', 4.5, '第一款RG系列产品'),
    (1, 'uc', 'mg', 'RX-78-2 高达 Ver.3.0', '2013-07-13', 4.8, '30周年纪念版本'),
    (1, 'uc', 'pg', 'RX-78-2 高达', '1998-08-23', 4.2, 'PG系列开山之作'),
    (1, 'uc', 'hg', 'RX-78-2 高达 REVIVE', '2015-07-18', 4.0, 'HG REVIVE系列'),
    (1, 'z', 'rg', 'MSZ-006 Z高达', '2020-12-19', 4.7, '可变形设计'),
    
    (1, 'cca', 'mg', 'MSN-04 沙扎比', '2006-03-25', 4.9, '夏亚专用机体'),
    (1, 'unicorn', 'hg', 'RX-0 独角兽高达', '2014-04-26', 4.3, 'NT-D系统搭载'),
    (1, 'cca', 'rg', 'MSN-02 沙扎比', '2019-07-06', 4.6, 'RG系列最大机体'),
    (1, 'cca', 'mg', 'RX-93 ν高达', '2005-07-23', 4.8, '逆袭的夏亚主角机'),
    (1, 'ibo', 'hg', 'ASW-G-08 巴巴托斯', '2015-10-03', 4.1, '铁血的奥尔芬斯主角机'),
    
    (2, 'original', 'fa', 'YSX-24 バーゼラルド', '2019-12-07', 3.8, '原创机甲设计'),
    (2, 'original', 'hg', 'ガバナー エクスアーマータイプ', '2018-03-31', 3.5, '六角装甲系列'),
    (3, 'ggg', 'mod', '勇者王 ガオガイガー', '2020-11-28', 4.0, '勇者系列机器人');

-- 插入价格历史记录
INSERT INTO price_history (model_id, price, price_date, source, notes) VALUES 
    -- RX-78-2 高达 RG版 价格变化
    (1, 2200.00, '2010-07-31', '万代官方', '首发价格'),
    (1, 1980.00, '2015-03-15', '亚马逊', '促销价格'),
    (1, 1650.00, '2020-07-01', '淘宝店铺', '代理商价格'),
    (1, 1800.00, '2023-06-15', '实体店', '当前市场价'),
    
    -- RX-78-2 高达 MG Ver.3.0 价格变化  
    (2, 4400.00, '2013-07-13', '万代官方', '首发价格'),
    (2, 3960.00, '2018-12-25', '模型店', '圣诞促销'),
    (2, 3300.00, '2021-05-20', '网购平台', '折扣价'),
    (2, 3850.00, '2023-08-10', '模型专卖店', '现在价格'),
    
    -- PG RX-78-2 价格变化
    (3, 22000.00, '1998-08-23', '万代官方', '首发价格'),
    (3, 18700.00, '2005-01-10', '模型店', '降价销售'),
    (3, 16500.00, '2015-11-11', '电商平台', '双十一特价'),
    (3, 19800.00, '2023-09-01', '收藏品店', '现在市价');

-- 插入用户购买状态记录
INSERT INTO user_model_purchase (user_id, model_id, purchased, purchased_date, purchased_price, purchase_notes) VALUES 
    -- 管理员的购买记录
    (1, 1, true, '2015-04-01', 1980.00, '第一个RG模型'),
    (1, 2, true, '2018-12-25', 3960.00, '圣诞节购入'),
    (1, 4, true, '2020-08-15', 1200.00, '二手购入'),
    (1, 5, false, null, null, '想要购买'),
    (1, 6, true, '2021-03-20', 7200.00, '生日礼物'),
    
    -- 用户一的购买记录
    (2, 1, true, '2020-09-10', 1650.00, '入坑作品'),
    (2, 3, false, null, null, '梦想收藏'),
    (2, 7, true, '2022-05-05', 2100.00, '独角兽系列'),
    (2, 10, true, '2023-01-15', 1500.00, '铁血系列'),
    
    -- 用户二的购买记录  
    (3, 2, false, null, null, '考虑购买'),
    (3, 8, true, '2021-08-08', 4200.00, '沙扎比收藏'),
    (3, 9, true, '2022-11-20', 4500.00, 'ν高达'),
    (3, 11, true, '2023-02-28', 3800.00, '寿屋产品'),
    
    -- 用户三的购买记录
    (4, 1, true, '2021-06-01', 1800.00, '朋友推荐'),
    (4, 4, true, '2021-07-15', 1320.00, '官方价购入'),
    (4, 12, false, null, null, '关注中'),
    (4, 13, true, '2023-03-10', 6500.00, '勇者系列粉丝');

-- 插入收藏记录
INSERT INTO user_model_favorite (user_id, model_id, favorite_notes) VALUES 
    -- 需要插入用户数据后才能使用，这里先用注释
    -- (1, 2, '想要的MG版本'),
    -- (1, 3, '梦想中的PG'),
    -- (1, 8, '沙扎比真帅'),
    -- (2, 1, '入门首选'),
    -- (2, 5, 'Z高达太酷了'),
    -- (2, 9, 'ν高达经典'),
    -- (3, 6, '夏亚专用机'),
    -- (3, 11, '寿屋品质不错'),
    -- (4, 4, '性价比很高'),
    -- (4, 10, '铁血系列喜欢'),
    -- (4, 13, '勇者系列收藏');

-- 查询验证数据
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Manufacturers count:' as info, COUNT(*) as count FROM manufacturers
UNION ALL
SELECT 'Models count:' as info, COUNT(*) as count FROM models  
UNION ALL
SELECT 'Price records count:' as info, COUNT(*) as count FROM price_history
UNION ALL  
SELECT 'Purchase records count:' as info, COUNT(*) as count FROM user_model_purchase
UNION ALL
SELECT 'Favorite records count:' as info, COUNT(*) as count FROM user_model_favorite; 