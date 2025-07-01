import React from 'react'
import styled from 'styled-components'
import { ShoppingBag, Search, Calendar, DollarSign } from 'lucide-react'
import { usePurchased } from '../hooks/useModels'
import ModelCard from '../components/ModelCard'

const Container = styled.div`
  padding: 24px 48px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      color: var(--color-green-500);
    }
  }
  
  p {
    color: var(--color-gray-600);
    font-size: 1rem;
  }
`

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 24px;
  max-width: 400px;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    transition: border-color var(--transition-fast);
    
    &:focus {
      border-color: var(--color-blue-500);
      outline: none;
    }
    
    &::placeholder {
      color: var(--color-gray-500);
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--color-gray-400);
  }
`

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  
  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    svg {
      width: 20px;
      height: 20px;
      color: var(--color-gray-500);
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--color-gray-600);
      font-weight: 500;
    }
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-gray-900);
  }
  
  .stat-description {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    margin-top: 4px;
  }
`

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--color-gray-600);
`

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--color-gray-600);
  
  h3 {
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    color: var(--color-gray-300);
  }
  
  h3 {
    color: var(--color-gray-900);
    margin-bottom: 12px;
    font-size: 1.25rem;
  }
  
  p {
    color: var(--color-gray-600);
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .explore-button {
    background: var(--color-blue-500);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    
    &:hover {
      background: var(--color-blue-600);
    }
  }
`

const PurchasedPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  
  const { data: purchasedData, isLoading, error } = usePurchased({
    search: searchTerm || undefined,
    page: 1,
    page_size: 50,
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleExploreClick = () => {
    window.location.href = '/explore'
  }

  if (isLoading) {
    return (
      <Container>
        <Header>
          <h1>
            <ShoppingBag />
            已购买
          </h1>
        </Header>
        <LoadingState>
          <p>正在加载购买记录...</p>
        </LoadingState>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Header>
          <h1>
            <ShoppingBag />
            已购买
          </h1>
        </Header>
        <ErrorState>
          <h3>加载失败</h3>
          <p>无法获取购买记录，请稍后重试。</p>
        </ErrorState>
      </Container>
    )
  }

  const purchased = purchasedData?.data || []
  const totalPurchased = purchasedData?.total || 0

  const filteredPurchased = searchTerm
    ? purchased.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.series?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : purchased

  // 计算统计数据
  const purchasedByCategory = purchased.reduce((acc, model) => {
    acc[model.category] = (acc[model.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalSpending = purchased.reduce((sum, model) => {
    // 假设用户购买信息中有价格数据，这里做简单计算
    const avgPrice = model.category === 'pg' ? 500 : 
                    model.category === 'mg' ? 200 : 
                    model.category === 'rg' ? 150 : 100
    return sum + avgPrice
  }, 0)

  return (
    <Container>
      <Header>
        <h1>
          <ShoppingBag />
          已购买
        </h1>
        <p>你的模型收藏记录</p>
      </Header>

      {totalPurchased > 0 && (
        <>
          <StatsSection>
            <StatCard>
              <div className="stat-header">
                <ShoppingBag />
                <span className="stat-label">购买总数</span>
              </div>
              <div className="stat-value">{totalPurchased}</div>
              <div className="stat-description">已收集的模型数量</div>
            </StatCard>
            
            <StatCard>
              <div className="stat-header">
                <DollarSign />
                <span className="stat-label">预估总价值</span>
              </div>
              <div className="stat-value">¥{totalSpending.toLocaleString()}</div>
              <div className="stat-description">基于平均价格估算</div>
            </StatCard>
            
            <StatCard>
              <div className="stat-header">
                <Calendar />
                <span className="stat-label">收藏时间</span>
              </div>
              <div className="stat-value">
                {purchased.length > 0 ? new Date(purchased[0].created_at).getFullYear() : '-'}
              </div>
              <div className="stat-description">开始收集年份</div>
            </StatCard>
          </StatsSection>

          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder="搜索已购买的模型..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>
        </>
      )}

      {totalPurchased === 0 ? (
        <EmptyState>
          <ShoppingBag className="empty-icon" />
          <h3>还没有购买记录</h3>
          <p>
            当你购买了心仪的模型时，记得在探索页面标记为"已购买"，
            这样就可以在这里查看你的完整收藏记录了。
          </p>
          <button className="explore-button" onClick={handleExploreClick}>
            去探索模型
          </button>
        </EmptyState>
      ) : filteredPurchased.length === 0 ? (
        <ErrorState>
          <h3>未找到匹配的模型</h3>
          <p>试试其他搜索词或清空搜索框查看全部购买记录。</p>
        </ErrorState>
      ) : (
        <ModelGrid>
          {filteredPurchased.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onClick={() => window.location.href = `/model/${model.id}`}
            />
          ))}
        </ModelGrid>
      )}
    </Container>
  )
}

export default PurchasedPage 