import { apiClient, extractData, extractPaginatedData } from './api'
import type { Model, ModelListQuery, PaginatedResponse } from '../types'

// 模型服务
export const modelService = {
  // 获取模型列表
  getModels: async (query: ModelListQuery = {}): Promise<PaginatedResponse<Model>> => {
    const params = new URLSearchParams()
    
    // 构建查询参数
    if (query.page) params.append('page', query.page.toString())
    if (query.page_size) params.append('page_size', query.page_size.toString())
    if (query.search) params.append('search', query.search)
    if (query.manufacturer) params.append('manufacturer', query.manufacturer)
    if (query.series) params.append('series', query.series)
    if (query.category) params.append('category', query.category)
    if (query.status) params.append('status', query.status)
    if (query.sort_by) params.append('sort_by', query.sort_by)
    if (query.sort_order) params.append('sort_order', query.sort_order)

    const response = await apiClient.get(`/models?${params.toString()}`)
    return extractPaginatedData<Model>(response)
  },

  // 获取模型详情
  getModelById: async (id: number): Promise<Model> => {
    const response = await apiClient.get(`/models/${id}`)
    return extractData<{ model: Model }>(response).model
  },

  // 获取模型衍生版本
  getModelVariants: async (id: number): Promise<Model[]> => {
    const response = await apiClient.get(`/models/${id}/variants`)
    return extractData<{ variants: Model[] }>(response).variants
  },

  // 创建新模型
  createModel: async (modelData: Partial<Model>): Promise<Model> => {
    const response = await apiClient.post('/models', modelData)
    return extractData<{ model: Model }>(response).model
  },

  // 更新模型
  updateModel: async (id: number, modelData: Partial<Model>): Promise<Model> => {
    const response = await apiClient.put(`/models/${id}`, modelData)
    return extractData<{ model: Model }>(response).model
  },

  // 删除模型
  deleteModel: async (id: number): Promise<void> => {
    await apiClient.delete(`/models/${id}`)
  },

  // 收藏模型
  favoriteModel: async (modelId: number, notes?: string): Promise<void> => {
    await apiClient.post('/user/favorites', {
      model_id: modelId,
      favorite_notes: notes,
    })
  },

  // 取消收藏
  unfavoriteModel: async (modelId: number): Promise<void> => {
    await apiClient.delete(`/user/favorites/${modelId}`)
  },

  // 标记为已购买
  markAsPurchased: async (
    modelId: number, 
    purchaseData: {
      purchased_date?: string
      purchased_price?: number
      purchase_notes?: string
    }
  ): Promise<void> => {
    await apiClient.post('/user/purchases', {
      model_id: modelId,
      purchased: true,
      ...purchaseData,
    })
  },

  // 取消购买标记
  unmarkAsPurchased: async (modelId: number): Promise<void> => {
    await apiClient.delete(`/user/purchases/${modelId}`)
  },

  // 获取用户收藏列表
  getFavorites: async (query: ModelListQuery = {}): Promise<PaginatedResponse<Model>> => {
    const params = new URLSearchParams()
    if (query.page) params.append('page', query.page.toString())
    if (query.page_size) params.append('page_size', query.page_size.toString())

    const response = await apiClient.get(`/user/favorites?${params.toString()}`)
    return extractPaginatedData<Model>(response)
  },

  // 获取用户购买记录
  getPurchased: async (query: ModelListQuery = {}): Promise<PaginatedResponse<Model>> => {
    const params = new URLSearchParams()
    if (query.page) params.append('page', query.page.toString())
    if (query.page_size) params.append('page_size', query.page_size.toString())

    const response = await apiClient.get(`/user/purchases?${params.toString()}`)
    return extractPaginatedData<Model>(response)
  },
}

export default modelService 