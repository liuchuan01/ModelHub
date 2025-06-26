// 用户类型
export interface User {
  id: number
  username: string
  created_at: string
  updated_at: string
}

// 厂商类型
export interface Manufacturer {
  id: number
  name: string
  full_name?: string
  founded_date?: string
  active_period_start?: string
  active_period_end?: string
  parent_company?: string
  country?: string
  website?: string
  description?: string
  created_at: string
  updated_at: string
}

// 模型类型
export interface Model {
  id: number
  parent_id?: number
  manufacturer_id: number
  series?: string
  name: string
  status: string
  category: string
  release_date?: string
  rating?: number
  notes?: string
  created_at: string
  updated_at: string
  
  // 关联数据
  manufacturer: Manufacturer
  parent?: Model
  children?: Model[]
  price_history?: PriceHistory[]
  user_purchases?: UserModelPurchase[]
  user_favorites?: UserModelFavorite[]
}

// 价格历史类型
export interface PriceHistory {
  id: number
  model_id: number
  price: number
  price_date: string
  source: string
  notes?: string
  created_at: string
  updated_at: string
}

// 用户模型购买关系
export interface UserModelPurchase {
  id: number
  user_id: number
  model_id: number
  purchased: boolean
  purchased_date?: string
  purchased_price?: number
  purchase_notes?: string
  created_at: string
  updated_at: string
}

// 用户模型收藏关系
export interface UserModelFavorite {
  id: number
  user_id: number
  model_id: number
  favorite_notes?: string
  created_at: string
  updated_at: string
}

// API响应类型
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// 模型列表查询参数
export interface ModelListQuery {
  page?: number
  page_size?: number
  search?: string
  manufacturer?: string
  series?: string
  category?: string
  status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// 登录请求/响应类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  expires_in: number
} 