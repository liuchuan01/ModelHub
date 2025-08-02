import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/authService'
import { authEvents } from '../services/api'
import type { User, LoginRequest } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  loginError: string | null
  isLoginLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false)

  // 初始化认证状态
  useEffect(() => {
    console.log('AuthProvider: Initializing auth state...')
    const token = authService.getToken()
    const storedUser = authService.getStoredUser()
    
    if (token && storedUser) {
      console.log('AuthProvider: Found existing auth data')
      setIsAuthenticated(true)
      setUser(storedUser)
    } else {
      console.log('AuthProvider: No existing auth data')
      setIsAuthenticated(false)
      setUser(null)
    }
    
    setIsLoading(false)
    console.log('AuthProvider: Initialization complete', { token: !!token, user: storedUser?.username })
  }, [])
  
  // 监听未授权事件
  useEffect(() => {
    console.log('AuthProvider: Setting up unauthorized event listener')
    
    const handleUnauthorized = () => {
      console.log('AuthProvider: Received unauthorized event, logging out')
      // 清除本地存储的认证信息
      authService.logout()
      // 更新状态
      setIsAuthenticated(false)
      setUser(null)
      setLoginError('登录已过期，请重新登录')
    }
    
    // 添加事件监听
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    
    // 清理函数
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    console.log('AuthProvider: Starting login...')
    setIsLoginLoading(true)
    setLoginError(null)
    
    try {
      const loginData = await authService.login(credentials)
      console.log('AuthProvider: Login successful', loginData)
      
      // 立即更新状态
      setIsAuthenticated(true)
      setUser(loginData.user)
      
      console.log('AuthProvider: Auth state updated')
      
      // 强制重新渲染
      setTimeout(() => {
        console.log('AuthProvider: Forcing state refresh...')
        setIsAuthenticated(true)
        setUser(loginData.user)
      }, 0)
      
    } catch (error: any) {
      console.error('AuthProvider: Login failed', error)
      setLoginError(error.message || '登录失败')
      setIsAuthenticated(false)
      setUser(null)
      throw error
    } finally {
      setIsLoginLoading(false)
    }
  }

  const logout = () => {
    console.log('AuthProvider: Logging out...')
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setLoginError(null)
    
    // 强制重新渲染
    setTimeout(() => {
      console.log('AuthProvider: Logout state refresh...')
      setIsAuthenticated(false)
      setUser(null)
    }, 0)
    
    console.log('AuthProvider: Logout complete')
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    loginError,
    isLoginLoading,
  }

  console.log('AuthProvider render:', { isAuthenticated, user: user?.username || null, isLoading })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 