import axios from 'axios'

// 创建一个自定义事件，用于通知认证状态变化
export const authEvents = {
  emit401Error: () => {
    const event = new CustomEvent('auth:unauthorized')
    window.dispatchEvent(event)
  }
}

// 创建axios实例
export const apiClient = axios.create({
  baseURL: '/api', // Vite代理会将/api转发到后端
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加JWT令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理通用错误
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401错误 - 未授权，发出事件通知而不是直接重定向
    if (error.response?.status === 401) {
      console.log('API: 收到401未授权响应，发出事件通知')
      // 发出自定义事件，让AuthContext处理
      authEvents.emit401Error()
    }
    
    // 处理网络错误
    if (!error.response) {
      error.message = '网络连接失败，请检查网络设置'
    }
    
    return Promise.reject(error)
  }
)

// API响应数据提取器
export const extractData = <T>(response: any): T => {
  return response.data
}

// 分页数据提取器
export const extractPaginatedData = <T>(response: any) => {
  return {
    data: response.data.models || response.data.data || [],
    total: response.data.total || 0,
    page: response.data.page || 1,
    page_size: response.data.page_size || 20,
    total_pages: response.data.total_pages || 0,
  }
}

export default apiClient 