-- 高达模型收藏记录程序 - 评分功能演示脚本
-- 注意：执行此脚本前需要先执行前面的初始化脚本

\c model_collection;

-- 1. 查看所有模型的评分情况
SELECT 
    m.name as "模型名称",
    mf.name as "厂商",
    m.series as "作品系列",
    m.category as "等级",
    m.rating as "评分",
    m.status as "状态"
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
ORDER BY m.rating DESC, m.name;

-- 2. 评分分布统计
SELECT 
    rating as "评分",
    COUNT(*) as "模型数量",
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM models WHERE rating IS NOT NULL), 2) as "占比(%)"
FROM models 
WHERE rating IS NOT NULL
GROUP BY rating
ORDER BY rating DESC;

-- 3. 各厂商评分统计
SELECT 
    mf.name as "厂商",
    COUNT(*) as "模型数量",
    ROUND(AVG(m.rating), 2) as "平均评分",
    MAX(m.rating) as "最高评分",
    MIN(m.rating) as "最低评分"
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
WHERE m.rating IS NOT NULL
GROUP BY mf.name
ORDER BY AVG(m.rating) DESC;

-- 4. 各等级评分统计
SELECT 
    category as "模型等级",
    COUNT(*) as "模型数量", 
    ROUND(AVG(rating), 2) as "平均评分",
    MAX(rating) as "最高评分",
    MIN(rating) as "最低评分"
FROM models 
WHERE rating IS NOT NULL
GROUP BY category
ORDER BY AVG(rating) DESC;

-- 4b. 各作品系列评分统计
SELECT 
    series as "作品系列",
    COUNT(*) as "模型数量", 
    ROUND(AVG(rating), 2) as "平均评分",
    MAX(rating) as "最高评分",
    MIN(rating) as "最低评分"
FROM models 
WHERE rating IS NOT NULL
GROUP BY series
ORDER BY AVG(rating) DESC;

-- 5. 高评分模型推荐 (4.5分以上)
SELECT 
    m.name as "模型名称",
    mf.name as "厂商",
    m.series as "作品系列",
    m.category as "等级", 
    m.rating as "评分",
    m.notes as "备注"
FROM models m
JOIN manufacturers mf ON m.manufacturer_id = mf.id
WHERE m.rating >= 4.5
ORDER BY m.rating DESC, m.name;

-- 6. 评分区间统计
SELECT 
    CASE 
        WHEN rating >= 4.5 THEN '优秀 (4.5-5.0)'
        WHEN rating >= 4.0 THEN '良好 (4.0-4.4)'
        WHEN rating >= 3.5 THEN '一般 (3.5-3.9)'
        WHEN rating >= 3.0 THEN '较差 (3.0-3.4)'
        ELSE '很差 (0-2.9)'
    END as "评分等级",
    COUNT(*) as "模型数量"
FROM models 
WHERE rating IS NOT NULL
GROUP BY 
    CASE 
        WHEN rating >= 4.5 THEN '优秀 (4.5-5.0)'
        WHEN rating >= 4.0 THEN '良好 (4.0-4.4)'
        WHEN rating >= 3.5 THEN '一般 (3.5-3.9)'
        WHEN rating >= 3.0 THEN '较差 (3.0-3.4)'
        ELSE '很差 (0-2.9)'
    END
ORDER BY MIN(rating) DESC;

-- 7. 展示评分约束验证
-- 这些语句会因为约束而失败，用于演示数据完整性
/*
-- 无效评分示例（会报错）:
INSERT INTO models (factory, series, name, rating) VALUES ('测试', 'hg', '测试模型1', 5.3);  -- 超过5分
INSERT INTO models (factory, series, name, rating) VALUES ('测试', 'hg', '测试模型2', -0.5); -- 负数
INSERT INTO models (factory, series, name, rating) VALUES ('测试', 'hg', '测试模型3', 4.3);  -- 不是0.5的倍数
*/

-- 8. 厂商详细信息查看
SELECT 
    name as "厂商名称",
    full_name as "全称",
    founded_date as "成立时间",
    active_period_start as "活跃开始",
    active_period_end as "活跃结束",
    parent_company as "母公司",
    country as "国家",
    description as "描述"
FROM manufacturers
ORDER BY founded_date;

-- 9. 厂商活跃状态统计
SELECT 
    CASE 
        WHEN active_period_end IS NULL THEN '活跃中'
        ELSE '已停产'
    END as "活跃状态",
    COUNT(*) as "厂商数量"
FROM manufacturers
GROUP BY 
    CASE 
        WHEN active_period_end IS NULL THEN '活跃中'
        ELSE '已停产'
    END;

-- 10. 厂商模型产量统计
SELECT 
    mf.name as "厂商",
    mf.country as "国家",
    COUNT(m.id) as "模型数量",
    ROUND(AVG(m.rating), 2) as "平均评分"
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name, mf.country
ORDER BY COUNT(m.id) DESC, AVG(m.rating) DESC;

-- 11. 有效评分示例
-- 这些是允许的评分值: 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
SELECT 'Valid ratings: 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0' as note; 