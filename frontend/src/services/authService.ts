import { apiClient, extractData } from './api'
import type { LoginRequest, LoginResponse, User } from '../types'

// 认证服务
export const authService = {
  // 用户登录
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials)
    const loginData = extractData<LoginResponse>(response)
    
    // 保存token和用户信息到localStorage
    localStorage.setItem('auth_token', loginData.token)
    localStorage.setItem('user_info', JSON.stringify(loginData.user))
    
    return loginData
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile')
    return extractData<{ user: User }>(response).user
  },

  // 登出
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token')
  },

  // 获取本地存储的用户信息
  getStoredUser: (): User | null => {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 获取本地存储的token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token')
  },
}

export default authService 