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

  // 获取当前用户信息
  const { data: currentUser, isLoading: isUserLoading } = useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      enabled: isAuthenticated,
      onSuccess: (userData) => {
        setUser(userData)
      },
      onError: () => {
        // 如果获取用户信息失败，可能token已过期
        handleLogout()
      },
    }
  )

  // 登录mutation
  const loginMutation = useMutation(authService.login, {
    onSuccess: (loginData) => {
      setIsAuthenticated(true)
      setUser(loginData.user)
      queryClient.invalidateQueries('currentUser')
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
      throw error
    },
  })

  // 登出函数
  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    queryClient.clear()
  }

  // 登录函数
  const handleLogin = async (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials)
  }

  // 检查认证状态变化
  useEffect(() => {
    const token = authService.getToken()
    if (token && !isAuthenticated) {
      setIsAuthenticated(true)
    } else if (!token && isAuthenticated) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    user: currentUser || user,
    isLoading: isUserLoading || loginMutation.isLoading,
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