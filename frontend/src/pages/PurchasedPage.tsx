import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Search, ShoppingBag, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { usePurchased } from '../hooks/useModels'
import ModelCard from '../components/ModelCard'
import type { ModelListQuery } from '../types'
import { useAuth } from '../contexts/AuthContext'

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
  }
  
  p {
    color: var(--color-gray-600);
    font-size: 1rem;
  }
  
  svg {
    color: var(--color-green-500);
  }
`

const SearchAndFilter = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SearchBox = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
  
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

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  background: var(--color-white);
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-blue-500);
    outline: none;
  }
`

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .results-count {
    color: var(--color-gray-600);
    font-size: 0.875rem;
  }
  
  .stats {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 0.875rem;
    color: var(--color-gray-600);
    
    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      
      svg {
        width: 14px;
        height: 14px;
        color: var(--color-gray-500);
      }
      
      .value {
        font-weight: 600;
        color: var(--color-gray-900);
      }
    }
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

const ErrorMessage = styled.div`
  background-color: var(--color-red-50);
  border: 1px solid var(--color-red-200);
  color: var(--color-red-700);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: var(--color-red-500);
    width: 20px;
    height: 20px;
  }
  
  .message-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 0.875rem;
    }
  }
`

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  color: var(--color-gray-700);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-gray-50);
    border-color: var(--color-gray-400);
  }
`

const PurchasedPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState<ModelListQuery>({
    page: 1,
    page_size: 20,
    sort_by: 'purchased_date',
    sort_order: 'desc'
  })

  const { data, isLoading, error, refetch } = usePurchased(query)
  
  // 检查认证状态
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('PurchasedPage: 用户未认证，重定向到首页')
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(prev => ({
      ...prev,
      search: e.target.value || undefined,
      page: 1,
    }))
  }

  const handleFilterChange = (field: keyof ModelListQuery) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuery(prev => ({
      ...prev,
      [field]: e.target.value || undefined,
      page: 1,
    }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort_by, sort_order] = e.target.value.split(':')
    setQuery(prev => ({
      ...prev,
      sort_by,
      sort_order: sort_order as 'asc' | 'desc',
    }))
  }

  const handleModelClick = (modelId: number) => {
    navigate(`/model/${modelId}`)
  }
  
  const handleRetry = () => {
    refetch()
  }

  // 计算总价值
  const calculateTotalValue = () => {
    if (!data?.data) return 0
    return data.data.reduce((total: number, model: any) => {
      const price = model.user_purchases?.[0]?.purchased_price || 
                    model.price_history?.[0]?.price || 0
      return total + price
    }, 0)
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <p>正在加载购买数据...</p>
        </LoadingState>
      </Container>
    )
  }

  const totalValue = calculateTotalValue()

  return (
    <Container>
      <Header>
        <h1>
          <ShoppingBag fill="currentColor" />
          已购买模型
        </h1>
        <p>管理你已购买的高达模型</p>
      </Header>

      {error instanceof Error && (
        <ErrorMessage>
          <AlertCircle />
          <div className="message-content">
            <h4>获取购买数据失败</h4>
            <p>{error.message || '请检查网络连接或重新登录后再试'}</p>
          </div>
          <RetryButton onClick={handleRetry}>
            重试
          </RetryButton>
        </ErrorMessage>
      )}

      <SearchAndFilter>
        <SearchBox>
          <Search />
          <input
            type="text"
            placeholder="搜索已购买的模型..."
            value={query.search || ''}
            onChange={handleSearchChange}
          />
        </SearchBox>
        
        <FilterSection>
          <FilterSelect
            value={query.category || ''}
            onChange={handleFilterChange('category')}
          >
            <option value="">所有分类</option>
            <option value="hg">HG</option>
            <option value="mg">MG</option>
            <option value="rg">RG</option>
            <option value="pg">PG</option>
          </FilterSelect>
          
          <FilterSelect
            value={query.manufacturer || ''}
            onChange={handleFilterChange('manufacturer')}
          >
            <option value="">所有厂商</option>
            <option value="bandai">万代</option>
            <option value="kotobukiya">寿屋</option>
          </FilterSelect>
          
          <FilterSelect
            value={`${query.sort_by || 'purchased_date'}:${query.sort_order || 'desc'}`}
            onChange={handleSortChange}
          >
            <option value="purchased_date:desc">最近购买</option>
            <option value="purchased_date:asc">最早购买</option>
            <option value="purchased_price:desc">价格高到低</option>
            <option value="purchased_price:asc">价格低到高</option>
            <option value="name:asc">名称 A-Z</option>
          </FilterSelect>
        </FilterSection>
      </SearchAndFilter>

      <ResultsHeader>
        <div className="results-count">
          共购买了 {data?.total || 0} 个模型
        </div>
        
        {data?.total ? (
          <div className="stats">
            <div className="stat">
              <DollarSign />
              <span>总价值：</span>
              <span className="value">¥{totalValue.toLocaleString()}</span>
            </div>
          </div>
        ) : null}
      </ResultsHeader>

      {data?.data && data.data.length > 0 ? (
        <ModelGrid>
          {data.data.map((model: any) => (
            <ModelCard
              key={model.id}
              model={model}
              onClick={() => handleModelClick(model.id)}
            />
          ))}
        </ModelGrid>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: 'var(--color-gray-600)'
        }}>
          <div style={{
            fontSize: '48px',
            color: 'var(--color-gray-300)',
            marginBottom: '16px'
          }}>
            🛍️
          </div>
          <h3 style={{
            color: 'var(--color-gray-900)',
            marginBottom: '8px'
          }}>暂无购买记录</h3>
          <p>去探索页面发现并标记你已购买的模型吧！</p>
        </div>
      )}
    </Container>
  )
}

export default PurchasedPage 