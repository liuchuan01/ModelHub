import React from 'react'
import styled from 'styled-components'
import { Package, Plus, TrendingUp, Star, ShoppingBag } from 'lucide-react'

const HomeContainer = styled.div`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
  
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
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  
  .icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    color: var(--color-blue-500);
  }
  
  .number {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  .label {
    font-size: 0.875rem;
    color: var(--color-gray-600);
    font-weight: 500;
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
  background: var(--color-blue-500);
  color: white;
  padding: 16px 32px;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--color-blue-600);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  svg {
    width: 20px;
    height: 20px;
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
  padding: 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: all var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .series-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  .series-count {
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Header>
        <h1>
          <Package />
          我的高达模型收藏
        </h1>
        <p>探索、收藏、记录你的模型世界</p>
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