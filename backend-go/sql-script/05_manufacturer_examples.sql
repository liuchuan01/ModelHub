-- 高达模型收藏记录程序 - 厂商管理功能演示脚本
-- 注意：执行此脚本前需要先执行前面的初始化脚本

\c model_collection;

-- 1. 查看所有厂商基本信息
SELECT 
    name as "厂商名称",
    full_name as "全称", 
    founded_date as "成立时间",
    country as "国家",
    parent_company as "母公司",
    CASE 
        WHEN active_period_end IS NULL THEN '活跃中'
        ELSE '已停产'
    END as "活跃状态"
FROM manufacturers
ORDER BY founded_date;

-- 2. 厂商活跃时间分析
SELECT 
    name as "厂商名称",
    active_period_start as "开始活跃",
    active_period_end as "停止活跃",
    CASE 
        WHEN active_period_end IS NULL THEN 
            EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM active_period_start)
        ELSE 
            EXTRACT(YEAR FROM active_period_end) - EXTRACT(YEAR FROM active_period_start)
    END as "活跃年数"
FROM manufacturers
WHERE active_period_start IS NOT NULL
ORDER BY "活跃年数" DESC;

-- 3. 各国厂商统计
SELECT 
    country as "国家",
    COUNT(*) as "厂商数量",
    COUNT(CASE WHEN active_period_end IS NULL THEN 1 END) as "活跃厂商",
    COUNT(CASE WHEN active_period_end IS NOT NULL THEN 1 END) as "已停产厂商"
FROM manufacturers
GROUP BY country
ORDER BY "厂商数量" DESC;

-- 4. 厂商集团关系（母公司-子公司）
SELECT 
    COALESCE(parent_company, '独立厂商') as "集团",
    STRING_AGG(name, ', ') as "旗下厂商"
FROM manufacturers
GROUP BY parent_company
ORDER BY COUNT(*) DESC;

-- 5. 厂商模型产量和评分统计
SELECT 
    mf.name as "厂商",
    mf.country as "国家",
    COUNT(m.id) as "模型数量",
    ROUND(AVG(m.rating), 2) as "平均评分",
    MAX(m.rating) as "最高评分",
    MIN(m.rating) as "最低评分",
    COUNT(CASE WHEN m.rating >= 4.5 THEN 1 END) as "高评分模型数"
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name, mf.country
ORDER BY "模型数量" DESC, "平均评分" DESC;

-- 6. 厂商按等级模型分布
SELECT 
    mf.name as "厂商",
    COUNT(CASE WHEN m.category = 'hg' THEN 1 END) as "HG数量",
    COUNT(CASE WHEN m.category = 'mg' THEN 1 END) as "MG数量",
    COUNT(CASE WHEN m.category = 'rg' THEN 1 END) as "RG数量",
    COUNT(CASE WHEN m.category = 'pg' THEN 1 END) as "PG数量",
    COUNT(CASE WHEN m.category NOT IN ('hg','mg','rg','pg') THEN 1 END) as "其他数量"
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name
HAVING COUNT(m.id) > 0
ORDER BY COUNT(m.id) DESC;

-- 6b. 厂商按作品系列分布
SELECT 
    mf.name as "厂商",
    COUNT(CASE WHEN m.series = 'uc' THEN 1 END) as "UC系列",
    COUNT(CASE WHEN m.series = 'seed' THEN 1 END) as "SEED系列",
    COUNT(CASE WHEN m.series = '00' THEN 1 END) as "00系列",
    COUNT(CASE WHEN m.series = 'ibo' THEN 1 END) as "铁血系列",
    COUNT(CASE WHEN m.series = 'cca' THEN 1 END) as "逆袭夏亚",
    COUNT(CASE WHEN m.series NOT IN ('uc','seed','00','ibo','cca') THEN 1 END) as "其他系列"
FROM manufacturers mf
LEFT JOIN models m ON mf.id = m.manufacturer_id
GROUP BY mf.id, mf.name
HAVING COUNT(m.id) > 0
ORDER BY COUNT(m.id) DESC;

-- 7. 厂商成立年代分析
SELECT 
    CASE 
        WHEN EXTRACT(YEAR FROM founded_date) < 1950 THEN '1950年前'
        WHEN EXTRACT(YEAR FROM founded_date) < 1960 THEN '1950-1959'
        WHEN EXTRACT(YEAR FROM founded_date) < 1970 THEN '1960-1969'
        WHEN EXTRACT(YEAR FROM founded_date) < 1980 THEN '1970-1979'
        WHEN EXTRACT(YEAR FROM founded_date) < 1990 THEN '1980-1989'
        WHEN EXTRACT(YEAR FROM founded_date) < 2000 THEN '1990-1999'
        ELSE '2000年后'
    END as "成立年代",
    COUNT(*) as "厂商数量",
    STRING_AGG(name, ', ') as "厂商列表"
FROM manufacturers
WHERE founded_date IS NOT NULL
GROUP BY 
    CASE 
        WHEN EXTRACT(YEAR FROM founded_date) < 1950 THEN '1950年前'
        WHEN EXTRACT(YEAR FROM founded_date) < 1960 THEN '1950-1959'
        WHEN EXTRACT(YEAR FROM founded_date) < 1970 THEN '1960-1969'
        WHEN EXTRACT(YEAR FROM founded_date) < 1980 THEN '1970-1979'
        WHEN EXTRACT(YEAR FROM founded_date) < 1990 THEN '1980-1989'
        WHEN EXTRACT(YEAR FROM founded_date) < 2000 THEN '1990-1999'
        ELSE '2000年后'
    END
ORDER BY MIN(founded_date);

-- 8. 厂商详细档案（包含官网等信息）
SELECT 
    name as "厂商名称",
    full_name as "全称",
    founded_date as "成立时间",
    country as "国家",
    parent_company as "母公司",
    website as "官网",
    description as "描述"
FROM manufacturers
ORDER BY name;

-- 9. 活跃厂商的模型发布时间线
SELECT 
    mf.name as "厂商",
    MIN(m.release_date) as "首个模型发布",
    MAX(m.release_date) as "最新模型发布",
    COUNT(m.id) as "总模型数量"
FROM manufacturers mf
JOIN models m ON mf.id = m.manufacturer_id
WHERE mf.active_period_end IS NULL  -- 仍在活跃的厂商
GROUP BY mf.id, mf.name
ORDER BY "最新模型发布" DESC; 