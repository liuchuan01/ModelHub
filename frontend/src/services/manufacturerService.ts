import { apiClient, extractData, extractPaginatedData } from './api'
import type { Manufacturer, PaginatedResponse } from '../types'

// 厂商服务
export const manufacturerService = {
  // 获取厂商列表
  getManufacturers: async (): Promise<Manufacturer[]> => {
    const response = await apiClient.get('/manufacturers')
    return extractData<{ manufacturers: Manufacturer[] }>(response).manufacturers
  },
}

export default manufacturerService