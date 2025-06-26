import React from 'react'
import styled from 'styled-components'
import { Package, Plus, TrendingUp, Star, ShoppingBag, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const HomeContainer = styled.div`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-white);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 64px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 300;
    color: var(--color-gray-900);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  
  p {
    font-size: 1.125rem;
    color: var(--color-gray-600);
    font-weight: 300;
    margin-bottom: 24px;
  }
`

const WelcomeCard = styled.div`
  background: var(--color-gray-50);
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  max-width: 360px;
  margin: 0 auto;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-gray-800);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .welcome-text {
    text-align: left;
    
    .greeting {
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--color-gray-600);
      margin-bottom: 2px;
    }
    
    .username {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-gray-900);
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
`

const StatCard = styled.div`
  background: var(--color-white);
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  text-align: center;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-gray-300);
    box-shadow: var(--shadow-sm);
  }
  
  .icon {
    width: 32px;
    height: 32px;
    margin: 0 auto 12px;
    color: var(--color-gray-700);
    stroke-width: 1.5;
  }
  
  .number {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-black);
    margin-bottom: 6px;
  }
  
  .label {
    font-size: 0.8rem;
    color: var(--color-gray-600);
    font-weight: 400;
  }
`

const ActionSection = styled.section`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--color-gray-900);
    margin-bottom: 32px;
  }
`

const ActionButton = styled.button`
  background: var(--color-black);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-black);
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-gray-800);
    border-color: var(--color-gray-800);
  }
  
  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.5;
  }
`

const FeaturedSection = styled.section`
  h2 {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-gray-900);
    margin-bottom: 32px;
    text-align: center;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 60px;
      height: 1px;
      background: var(--color-gray-300);
    }
    
    &::before {
      left: calc(50% - 120px);
    }
    
    &::after {
      right: calc(50% - 120px);
    }
  }
`

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`

const SeriesCard = styled.div`
  background: var(--color-white);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  text-align: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-gray-300);
    box-shadow: var(--shadow-sm);
  }
  
  .series-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-black);
    margin-bottom: 6px;
  }
  
  .series-count {
    font-size: 0.8rem;
    color: var(--color-gray-600);
    font-weight: 400;
  }
`

const HomePage: React.FC = () => {
  const { user } = useAuth()

  // 获取用户名首字母作为头像
  const getAvatarText = (username?: string) => {
    if (!username) return 'U'
    return username.charAt(0).toUpperCase()
  }

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  return (
    <HomeContainer>
      <Header>
        <h1>
          <Package />
          我的高达模型收藏
        </h1>
        <p>探索、收藏、记录你的模型世界</p>
        
        <WelcomeCard>
          <div className="avatar">
            {getAvatarText(user?.username)}
          </div>
          <div className="welcome-text">
            <div className="greeting">{getGreeting()}！</div>
            <div className="username">{user?.username || '用户'}</div>
          </div>
        </WelcomeCard>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <Package className="icon" />
          <div className="number">247</div>
          <div className="label">总收藏</div>
        </StatCard>
        
        <StatCard>
          <TrendingUp className="icon" />
          <div className="number">12</div>
          <div className="label">本月新增</div>
        </StatCard>
        
        <StatCard>
          <Star className="icon" />
          <div className="number">18</div>
          <div className="label">心愿单</div>
        </StatCard>
      </StatsGrid>
      
      <ActionSection>
        <h2>开始探索</h2>
        <ActionButton>
          <Plus />
          发现新模型
        </ActionButton>
      </ActionSection>
      
      <FeaturedSection>
        <h2>最近关注的系列</h2>
        <SeriesGrid>
          <SeriesCard>
            <div className="series-name">SEED</div>
            <div className="series-count">23 个模型</div>
          </SeriesCard>
          
          <SeriesCard>
            <div className="series-name">UC</div>
            <div className="series-count">45 个模型</div>
          </SeriesCard>
          
          <SeriesCard>
            <div className="series-name">00</div>
            <div className="series-count">18 个模型</div>
          </SeriesCard>
        </SeriesGrid>
      </FeaturedSection>
    </HomeContainer>
  )
}

export default HomePage 