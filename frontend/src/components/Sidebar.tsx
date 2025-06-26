import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  Package
} from 'lucide-react'

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background-color: var(--color-white);
  border-right: 1px solid var(--color-gray-200);
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
  padding: 0 24px 32px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  margin-bottom: 24px;
  
  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-900);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    font-size: 0.875rem;
    color: var(--color-gray-500);
    margin-top: 4px;
  }
`

const NavList = styled.nav`
  padding: 0 12px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-bottom: 4px;
  
  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
  }
  
  &.active {
    background-color: var(--color-blue-500);
    color: white;
    
    svg {
      color: white;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: inherit;
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

const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
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
    </SidebarContainer>
  )
}

export default Sidebar 