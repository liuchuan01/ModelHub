import React, { useState } from 'react'
import styled from 'styled-components'
import { LogIn, Lock, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-gray-50);
  padding: 24px;
`

const LoginCard = styled.div`
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 380px;
  border: 1px solid var(--color-gray-200);
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  p {
    color: var(--color-gray-600);
    font-size: 0.875rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const InputGroup = styled.div`
  position: relative;
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-gray-700);
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    transition: border-color var(--transition-fast);
    background: var(--color-white);
    
    &:focus {
      border-color: var(--color-gray-600);
      outline: none;
    }
    
    &::placeholder {
      color: var(--color-gray-400);
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    bottom: 12px;
    width: 18px;
    height: 18px;
    color: var(--color-gray-400);
  }
`

const SubmitButton = styled.button`
  background: var(--color-black);
  color: white;
  border: 1px solid var(--color-black);
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-gray-800);
    border-color: var(--color-gray-800);
  }
  
  &:disabled {
    background: var(--color-gray-400);
    border-color: var(--color-gray-400);
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const ErrorMessage = styled.div`
  color: var(--color-red-600);
  font-size: 0.875rem;
  text-align: center;
  padding: 12px;
  background: var(--color-red-50);
  border: 1px solid var(--color-red-200);
  border-radius: var(--radius-md);
`

const TestAccounts = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-gray-200);
  
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-gray-700);
    margin-bottom: 12px;
  }
  
  .account-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .account-item {
    font-size: 0.75rem;
    color: var(--color-gray-600);
    padding: 8px 12px;
    background: var(--color-gray-50);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-gray-200);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    
    &:hover {
      background: var(--color-gray-100);
    }
  }
`

const LoginPage: React.FC = () => {
  const { login, isLoginLoading, loginError } = useAuth()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted:', credentials)
    
    try {
      await login(credentials)
      console.log('Login completed - AuthContext will handle state change')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleTestAccountClick = (username: string, password: string) => {
    setCredentials({ username, password })
  }

  const testAccounts = [
    { username: 'admin', password: 'admin123', name: '管理员' },
    { username: 'user1', password: 'password1', name: '用户1' },
    { username: 'user2', password: 'password2', name: '用户2' },
  ]

  return (
    <Container>
      <LoginCard>
        <Header>
          <h1>高达模型收藏系统</h1>
          <p>请登录以管理您的模型收藏</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
            <User />
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <Lock />
          </InputGroup>

          {loginError && (
            <ErrorMessage>
              {typeof loginError === 'string' ? loginError : '登录失败，请检查用户名和密码'}
            </ErrorMessage>
          )}

          <SubmitButton type="submit" disabled={isLoginLoading}>
            {isLoginLoading ? (
              '登录中...'
            ) : (
              <>
                <LogIn />
                登录
              </>
            )}
          </SubmitButton>
        </Form>

        <TestAccounts>
          <h3>测试账户</h3>
          <div className="account-list">
            {testAccounts.map((account) => (
              <div
                key={account.username}
                className="account-item"
                onClick={() => handleTestAccountClick(account.username, account.password)}
              >
                {account.name}: {account.username} / {account.password}
              </div>
            ))}
          </div>
        </TestAccounts>
      </LoginCard>
    </Container>
  )
}

export default LoginPage 