import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Masonry from 'react-masonry-css'
import { Search, Filter, Grid, List } from 'lucide-react'
import { useModels } from '../hooks/useModels'
import ModelCard from '../components/ModelCard'
import type { ModelListQuery } from '../types'

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
  }
  
  p {
    color: var(--color-gray-600);
    font-size: 1rem;
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
  
  .view-controls {
    display: flex;
    gap: 8px;
  }
`

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  background: ${props => props.$active ? 'var(--color-blue-500)' : 'var(--color-white)'};
  color: ${props => props.$active ? 'white' : 'var(--color-gray-600)'};
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: ${props => props.$active ? 'var(--color-blue-600)' : 'var(--color-gray-100)'};
  }
`

const MasonryContainer = styled(Masonry)`
  display: flex;
  margin-left: -16px;
  width: auto;
  
  .masonry-column {
    padding-left: 16px;
    background-clip: padding-box;
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

const ExplorePage: React.FC = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry')
  const [query, setQuery] = useState<ModelListQuery>({
    page: 1,
    page_size: 20,
  })

  const { data, isLoading, error } = useModels(query)

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

  const handleModelClick = (modelId: number) => {
    navigate(`/model/${modelId}`)
  }

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1000: 2,
    700: 1
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <p>正在加载模型数据...</p>
        </LoadingState>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <h3>加载失败</h3>
          <p>无法获取模型数据，请稍后重试。</p>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <h1>探索模型</h1>
        <p>发现你喜欢的高达模型</p>
      </Header>

      <SearchAndFilter>
        <SearchBox>
          <Search />
          <input
            type="text"
            placeholder="搜索模型名称..."
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
            value={query.series || ''}
            onChange={handleFilterChange('series')}
          >
            <option value="">所有系列</option>
            <option value="SEED">SEED</option>
            <option value="UC">UC</option>
            <option value="00">00</option>
            <option value="IBO">IBO</option>
          </FilterSelect>
          
          <FilterSelect
            value={query.status || ''}
            onChange={handleFilterChange('status')}
          >
            <option value="">所有状态</option>
            <option value="现货">现货</option>
            <option value="预售">预售</option>
            <option value="下架">下架</option>
          </FilterSelect>
        </FilterSection>
      </SearchAndFilter>

      <ResultsHeader>
        <div className="results-count">
          找到 {data?.total || 0} 个模型
        </div>
        <div className="view-controls">
          <ViewButton
            $active={viewMode === 'masonry'}
            onClick={() => setViewMode('masonry')}
            title="瀑布流视图"
          >
            <Grid />
          </ViewButton>
          <ViewButton
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            title="网格视图"
          >
            <List />
          </ViewButton>
        </div>
      </ResultsHeader>

      {data?.data && data.data.length > 0 ? (
        viewMode === 'masonry' ? (
          <MasonryContainer
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {data.data.map((model) => (
              <div key={model.id} style={{ marginBottom: '16px' }}>
                <ModelCard
                  model={model}
                  onClick={() => handleModelClick(model.id)}
                />
              </div>
            ))}
          </MasonryContainer>
        ) : (
          <ModelGrid>
            {data.data.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onClick={() => handleModelClick(model.id)}
              />
            ))}
          </ModelGrid>
        )
      ) : (
        <ErrorState>
          <h3>暂无模型</h3>
          <p>试试调整搜索条件或筛选条件。</p>
        </ErrorState>
      )}
    </Container>
  )
}

export default ExplorePage 