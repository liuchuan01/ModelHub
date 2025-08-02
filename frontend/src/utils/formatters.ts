/**
 * 格式化日期字符串
 * @param dateString - ISO格式的日期字符串或其他可被Date解析的字符串
 * @param options - 格式化选项
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }
): string => {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效日期';
  }
};

/**
 * 格式化价格
 * @param price - 价格数值
 * @param currency - 货币符号，默认为 ¥
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (
  price: number | undefined | null,
  currency: string = '¥'
): string => {
  if (price === undefined || price === null) return '暂无价格';
  
  return `${currency}${price.toLocaleString('zh-CN')}`;
};

/**
 * 格式化评分
 * @param rating - 评分数值
 * @param maxRating - 最高评分，默认为 5
 * @returns 格式化后的评分字符串
 */
export const formatRating = (
  rating: number | undefined | null,
  maxRating: number = 5
): string => {
  if (rating === undefined || rating === null) return '暂无评分';
  
  return `${rating.toFixed(1)}/${maxRating.toFixed(1)}`;
}; 