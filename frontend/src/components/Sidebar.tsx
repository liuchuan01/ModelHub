import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  Package,
  LogOut,
  User,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background-color: var(--color-white);
  border-right: var(--border-width) solid var(--border-color);
  padding: 24px 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    
    &.open {
      transform: translateX(0);
    }
  }
`

const Logo = styled.div`
  padding: 0 24px 24px 24px;
  border-bottom: var(--border-width) solid var(--border-color);
  margin-bottom: 20px;
  
  h1 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-black);
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  p {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    margin-top: 4px;
    font-weight: 400;
  }
`

const NavList = styled.nav`
  padding: 0 12px 140px 12px; /* 给底部留出空间给用户区域 */
  height: calc(100vh - 140px); /* 减去logo和用户区域的高度 */
  overflow-y: auto; /* 如果内容过多可以滚动 */
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  font-size: 0.875rem;
  font-weight: 400;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
  border: 1px solid transparent;
  
  &:hover {
    background-color: var(--color-gray-50);
    color: var(--color-gray-900);
    border-color: var(--color-gray-200);
  }
  
  &.active {
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
    border-color: var(--color-gray-200);
    font-weight: 500;
    
    svg {
      color: var(--color-gray-900);
    }
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: inherit;
    stroke-width: 1.5;
  }
`

const NavSection = styled.div`
  margin-bottom: 24px;
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-gray-200);
    padding-bottom: 24px;
  }
`

const SectionTitle = styled.div`
  padding: 0 12px 8px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const UserSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 12px;
  border-top: var(--border-width) solid var(--border-color);
  background-color: var(--color-white);
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  margin-bottom: 8px;
  
  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: var(--color-gray-800);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    font-size: 0.75rem;
  }
  
  .user-details {
    flex: 1;
    min-width: 0;
    
    .username {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-gray-900);
      margin-bottom: 1px;
    }
    
    .role {
      font-size: 0.7rem;
      color: var(--color-gray-500);
      font-weight: 400;
    }
  }
`

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  color: var(--color-gray-600);
  border: 1px solid var(--color-gray-200);
  font-size: 0.8rem;
  font-weight: 400;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-gray-50);
    border-color: var(--color-gray-300);
    color: var(--color-gray-900);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  svg {
    width: 14px;
    height: 14px;
    stroke-width: 1.5;
  }
`

const LogoutConfirmModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  p {
    color: var(--color-gray-600);
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
`

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  ${props => props.$variant === 'primary' ? `
    background-color: var(--color-red-500);
    color: white;
    border: 1px solid var(--color-red-500);
    
    &:hover {
      background-color: var(--color-red-600);
      border-color: var(--color-red-600);
    }
  ` : `
    background-color: var(--color-white);
    color: var(--color-gray-600);
    border: 1px solid var(--color-gray-300);
    
    &:hover {
      background-color: var(--color-gray-50);
    }
  `}
`

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // 获取用户名首字母作为头像
  const getAvatarText = (username?: string) => {
    if (!username) return 'U'
    return username.charAt(0).toUpperCase()
  }

  // 判断用户角色
  const getUserRole = (username?: string) => {
    if (username === 'admin') return '管理员'
    return '用户'
  }

  return (
    <>
      <SidebarContainer>
        <Logo>
          <h1>
            <Package />
            模型收藏
          </h1>
          <p>高达模型管理平台</p>
        </Logo>
        
        <NavList>
          <NavSection>
            <NavItem 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              <Home />
              首页
            </NavItem>
            
            <NavItem 
              to="/explore"
              className={location.pathname === '/explore' ? 'active' : ''}
            >
              <Search />
              探索模型
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>我的收藏</SectionTitle>
            
            <NavItem 
              to="/favorites"
              className={location.pathname === '/favorites' ? 'active' : ''}
            >
              <Heart />
              收藏列表
            </NavItem>
            
            <NavItem 
              to="/purchased"
              className={location.pathname === '/purchased' ? 'active' : ''}
            >
              <ShoppingBag />
              已购买
            </NavItem>
          </NavSection>
          
          <NavSection>
            <NavItem 
              to="/stats"
              className={location.pathname === '/stats' ? 'active' : ''}
            >
              <BarChart3 />
              统计分析
            </NavItem>
            
            <NavItem 
              to="/settings"
              className={location.pathname === '/settings' ? 'active' : ''}
            >
              <Settings />
              设置
            </NavItem>
          </NavSection>
        </NavList>

        <UserSection>
          <UserInfo>
            <div className="avatar">
              {getAvatarText(user?.username)}
            </div>
            <div className="user-details">
              <div className="username">{user?.username || '未知用户'}</div>
              <div className="role">{getUserRole(user?.username)}</div>
            </div>
          </UserInfo>
          
          <LogoutButton onClick={handleLogoutClick}>
            <LogOut />
            退出登录
          </LogoutButton>
        </UserSection>
      </SidebarContainer>

      <LogoutConfirmModal $show={showLogoutConfirm}>
        <ModalContent>
          <h3>确认退出</h3>
          <p>您确定要退出登录吗？退出后需要重新输入用户名和密码才能继续使用。</p>
          <div className="modal-actions">
            <ModalButton $variant="secondary" onClick={handleCancelLogout}>
              取消
            </ModalButton>
            <ModalButton $variant="primary" onClick={handleConfirmLogout}>
              退出登录
            </ModalButton>
          </div>
        </ModalContent>
      </LogoutConfirmModal>
    </>
  )
}

export default Sidebar 