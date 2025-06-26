-- 检查数据库中现有的约束名称
\c model_collection;

-- 查看users表的所有约束
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'users' 
    AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 查看所有表的唯一约束
SELECT 
    tc.table_name,
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name; 