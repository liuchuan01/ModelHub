import React from 'react'
import styled from 'styled-components'
import { Heart, Search } from 'lucide-react'
import { useFavorites } from '../hooks/useModels'
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
      color: var(--color-pink-500);
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
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`

const StatCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  min-width: 150px;
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--color-gray-600);
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

const FavoritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  
  const { data: favoritesData, isLoading, error } = useFavorites({
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
            <Heart />
            我的收藏
          </h1>
        </Header>
        <LoadingState>
          <p>正在加载收藏列表...</p>
        </LoadingState>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Header>
          <h1>
            <Heart />
            我的收藏
          </h1>
        </Header>
        <ErrorState>
          <h3>加载失败</h3>
          <p>无法获取收藏列表，请稍后重试。</p>
        </ErrorState>
      </Container>
    )
  }

  const favorites = favoritesData?.data || []
  const totalFavorites = favoritesData?.total || 0

  const filteredFavorites = searchTerm
    ? favorites.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.series?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favorites

  return (
    <Container>
      <Header>
        <h1>
          <Heart />
          我的收藏
        </h1>
        <p>精心挑选的模型收藏</p>
      </Header>

      {totalFavorites > 0 && (
        <>
          <StatsSection>
            <StatCard>
              <div className="stat-value">{totalFavorites}</div>
              <div className="stat-label">总收藏</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">
                {favorites.filter(m => m.category === 'mg').length}
              </div>
              <div className="stat-label">MG模型</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">
                {favorites.filter(m => m.category === 'hg').length}
              </div>
              <div className="stat-label">HG模型</div>
            </StatCard>
          </StatsSection>

          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder="搜索收藏的模型..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>
        </>
      )}

      {totalFavorites === 0 ? (
        <EmptyState>
          <Heart className="empty-icon" />
          <h3>还没有收藏任何模型</h3>
          <p>
            在探索页面发现喜欢的模型时，点击收藏按钮就可以在这里查看了。
            开始建立你的专属模型收藏吧！
          </p>
          <button className="explore-button" onClick={handleExploreClick}>
            去探索模型
          </button>
        </EmptyState>
      ) : filteredFavorites.length === 0 ? (
        <ErrorState>
          <h3>未找到匹配的模型</h3>
          <p>试试其他搜索词或清空搜索框查看全部收藏。</p>
        </ErrorState>
      ) : (
        <ModelGrid>
          {filteredFavorites.map((model) => (
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

export default FavoritesPage 