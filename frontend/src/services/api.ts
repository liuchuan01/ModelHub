import axios from 'axios'

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
    // 401错误 - 未授权，清除本地令牌
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      // 可以在这里触发重新登录
      window.location.href = '/login'
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