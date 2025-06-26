#!/bin/bash

# 检查是否提供了环境变量文件路径
if [ -z "$1" ]; then
    echo "未指定环境变量文件"
    return 0 2>/dev/null || exit 0
fi

ENV_FILE="$1"

# 检查文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  环境变量文件不存在: $ENV_FILE"
    return 1 2>/dev/null || exit 1
fi


# 读取并导出环境变量
while IFS= read -r line || [ -n "$line" ]; do
    # 跳过空行和注释行
    if [ -z "$line" ] || [[ "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # 提取键值对（保持原始格式）
    if [[ "$line" =~ ^[[:space:]]*([^=]+)[[:space:]]*=[[:space:]]*(.*)[[:space:]]*$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # 去除前后空格
        key="$(echo "$key" | xargs)"
        value="$(echo "$value" | xargs)"
        
        # 如果值被引号包围，去除引号
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        
        if [ -n "$key" ]; then
            export "$key=$value"
        fi
    fi
done < "$ENV_FILE"

echo "✅ 环境变量加载完成"

# 验证关键环境变量
required_vars=("DB_USER" "DB_PASSWORD" "DB_NAME" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    val="$(eval echo \$$var)"
    if [ -z "$val" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  警告：以下环境变量未正确加载："
    printf '%s\n' "${missing_vars[@]}"
    return 1 2>/dev/null || exit 1
fi

echo "✅ 环境变量验证通过"
return 0 2>/dev/null || exit 0 