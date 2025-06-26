import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authService } from '../services/authService'
import type { LoginRequest, User } from '../types'

// 认证状态Hook
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  )
  const [user, setUser] = useState<User | null>(authService.getStoredUser())
  const queryClient = useQueryClient()

  // 获取当前用户信息（仅在有token但没有用户信息时调用）
  const { data: currentUser, isLoading: isUserLoading } = useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      enabled: isAuthenticated && !user,
      onSuccess: (userData) => {
        setUser(userData)
      },
      onError: () => {
        // 如果获取用户信息失败，可能token已过期
        console.error('Failed to get current user, logging out')
        handleLogout()
      },
    }
  )

  // 登录mutation
  const loginMutation = useMutation(authService.login, {
    onSuccess: (loginData) => {
      console.log('Login successful:', loginData)
      setIsAuthenticated(true)
      setUser(loginData.user)
      // 清除可能的错误状态
      queryClient.setQueryData('currentUser', loginData.user)
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
    },
  })

  // 登出函数
  const handleLogout = () => {
    console.log('Logging out user...')
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    queryClient.clear()
    console.log('User logged out successfully')
  }

  // 登录函数
  const handleLogin = async (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials)
  }

  // 检查认证状态变化
  useEffect(() => {
    const token = authService.getToken()
    const storedUser = authService.getStoredUser()
    
    if (token && !isAuthenticated) {
      setIsAuthenticated(true)
      if (storedUser && !user) {
        setUser(storedUser)
      }
    } else if (!token && isAuthenticated) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [])

  return {
    isAuthenticated,
    user: user || currentUser,
    isLoading: isUserLoading,
    login: handleLogin,
    logout: handleLogout,
    loginError: loginMutation.error,
    isLoginLoading: loginMutation.isLoading,
  }
}

// 要求认证的Hook
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 重定向到登录页面
      window.location.href = '/login'
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
} 