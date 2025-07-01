import React from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingBag, Star, Calendar, DollarSign, Package, ExternalLink } from 'lucide-react'
import { useModel, useModelVariants, useModelActions } from '../hooks/useModels'

const Container = styled.div`
  padding: 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-gray-600);
  cursor: pointer;
  margin-bottom: 24px;
  font-size: 0.875rem;
  
  &:hover {
    color: var(--color-gray-900);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const ModelHeader = styled.div`
  margin-bottom: 32px;
  
  .title-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
  }
  
  .title-content {
    flex: 1;
  }
  
  .model-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin-bottom: 8px;
    line-height: 1.2;
  }
  
  .model-subtitle {
    color: var(--color-gray-600);
    font-size: 1.125rem;
    margin-bottom: 12px;
  }
  
  .model-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--color-gray-600);
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'favorite' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  ${props => {
    if (props.variant === 'favorite') {
      return `
        border-color: var(--color-pink-300);
        color: var(--color-pink-600);
        background: var(--color-white);
        
        &:hover {
          background: var(--color-pink-50);
          border-color: var(--color-pink-400);
        }
        
        &.active {
          background: var(--color-pink-500);
          color: white;
          border-color: var(--color-pink-500);
        }
      `
    } else if (props.variant === 'primary') {
      return `
        border-color: var(--color-green-500);
        background: var(--color-green-500);
        color: white;
        
        &:hover {
          background: var(--color-green-600);
          border-color: var(--color-green-600);
        }
        
        &.purchased {
          background: var(--color-green-600);
          border-color: var(--color-green-600);
        }
      `
    } else {
      return `
        border-color: var(--color-gray-300);
        background: var(--color-white);
        color: var(--color-gray-700);
        
        &:hover {
          background: var(--color-gray-50);
          border-color: var(--color-gray-400);
        }
      `
    }
  }}
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    if (props.status === '现货') {
      return `
        background: var(--color-green-100);
        color: var(--color-green-700);
      `
    } else if (props.status === '预售') {
      return `
        background: var(--color-yellow-100);
        color: var(--color-yellow-700);
      `
    } else {
      return `
        background: var(--color-gray-100);
        color: var(--color-gray-700);
      `
    }
  }}
`

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  .stars {
    display: flex;
    gap: 2px;
  }
  
  .rating-value {
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`

const InfoSection = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 16px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .info-item {
    .info-label {
      font-size: 0.875rem;
      color: var(--color-gray-600);
      margin-bottom: 4px;
    }
    
    .info-value {
      font-size: 1rem;
      color: var(--color-gray-900);
      font-weight: 500;
    }
  }
`

const VariantsSection = styled.div`
  margin-bottom: 24px;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 16px;
  }
  
  .variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
`

const VariantCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  padding: 16px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-blue-300);
    box-shadow: var(--shadow-sm);
  }
  
  .variant-name {
    font-weight: 500;
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  .variant-meta {
    display: flex;
    gap: 12px;
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: var(--color-gray-600);
`

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  
  h3 {
    color: var(--color-gray-900);
    margin-bottom: 8px;
  }
  
  p {
    color: var(--color-gray-600);
    margin-bottom: 24px;
  }
`

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const modelId = id ? parseInt(id, 10) : 0
  
  const { data: model, isLoading, error } = useModel(modelId)
  const { data: variants } = useModelVariants(modelId)
  const { favoriteModel, unfavoriteModel, markAsPurchased, unmarkAsPurchased } = useModelActions()

  const handleBack = () => {
    navigate(-1)
  }

  const handleFavorite = async () => {
    if (!model) return
    try {
      // 这里需要根据当前收藏状态来决定操作
      // 简化处理，实际应该检查 model.user_favorites
      await favoriteModel({ modelId: model.id })
    } catch (error) {
      console.error('Failed to favorite model:', error)
    }
  }

  const handlePurchase = async () => {
    if (!model) return
    try {
      await markAsPurchased({ 
        modelId: model.id, 
        purchaseData: {
          purchased_date: new Date().toISOString().split('T')[0]
        }
      })
    } catch (error) {
      console.error('Failed to mark as purchased:', error)
    }
  }

  const handleVariantClick = (variantId: number) => {
    navigate(`/model/${variantId}`)
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="currentColor" style={{ opacity: 0.5 }} />)
    }
    
    return stars
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState>
          <p>正在加载模型详情...</p>
        </LoadingState>
      </Container>
    )
  }

  if (error || !model) {
    return (
      <Container>
        <ErrorState>
          <h3>模型不存在</h3>
          <p>找不到指定的模型，可能已被删除或ID无效。</p>
          <ActionButton variant="secondary" onClick={handleBack}>
            返回上页
          </ActionButton>
        </ErrorState>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <ArrowLeft />
        返回
      </BackButton>

      <ModelHeader>
        <div className="title-section">
          <div className="title-content">
            <h1 className="model-title">{model.name}</h1>
            {model.series && (
              <p className="model-subtitle">{model.series} 系列</p>
            )}
            
            <div className="model-meta">
              <div className="meta-item">
                <Package />
                {model.category.toUpperCase()}
              </div>
              <div className="meta-item">
                <StatusBadge status={model.status}>{model.status}</StatusBadge>
              </div>
              {model.rating && (
                <div className="meta-item">
                  <RatingDisplay>
                    <div className="stars">
                      {renderStars(model.rating)}
                    </div>
                    <span className="rating-value">({model.rating})</span>
                  </RatingDisplay>
                </div>
              )}
              {model.release_date && (
                <div className="meta-item">
                  <Calendar />
                  {new Date(model.release_date).toLocaleDateString('zh-CN')}
                </div>
              )}
            </div>
          </div>
          
          <ActionButtons>
            <ActionButton variant="favorite" onClick={handleFavorite}>
              <Heart />
              收藏
            </ActionButton>
            <ActionButton variant="primary" onClick={handlePurchase}>
              <ShoppingBag />
              标记已购买
            </ActionButton>
          </ActionButtons>
        </div>
      </ModelHeader>

      <InfoSection>
        <h3>基本信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">厂商</div>
            <div className="info-value">{model.manufacturer.name}</div>
          </div>
          {model.manufacturer.country && (
            <div className="info-item">
              <div className="info-label">制造国家</div>
              <div className="info-value">{model.manufacturer.country}</div>
            </div>
          )}
          <div className="info-item">
            <div className="info-label">分类等级</div>
            <div className="info-value">{model.category.toUpperCase()}</div>
          </div>
          <div className="info-item">
            <div className="info-label">当前状态</div>
            <div className="info-value">{model.status}</div>
          </div>
          {model.series && (
            <div className="info-item">
              <div className="info-label">作品系列</div>
              <div className="info-value">{model.series}</div>
            </div>
          )}
          {model.release_date && (
            <div className="info-item">
              <div className="info-label">发售日期</div>
              <div className="info-value">
                {new Date(model.release_date).toLocaleDateString('zh-CN')}
              </div>
            </div>
          )}
        </div>
        
        {model.notes && (
          <div style={{ marginTop: '16px' }}>
            <div className="info-label">备注说明</div>
            <div className="info-value">{model.notes}</div>
          </div>
        )}
      </InfoSection>

      {model.manufacturer.website && (
        <InfoSection>
          <h3>厂商信息</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">厂商全称</div>
              <div className="info-value">{model.manufacturer.full_name || model.manufacturer.name}</div>
            </div>
            <div className="info-item">
              <div className="info-label">官方网站</div>
              <div className="info-value">
                <a 
                  href={model.manufacturer.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-blue-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  访问官网
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </InfoSection>
      )}

      {variants && variants.length > 0 && (
        <VariantsSection>
          <h3>相关版本</h3>
          <div className="variants-grid">
            {variants.map((variant) => (
              <VariantCard 
                key={variant.id} 
                onClick={() => handleVariantClick(variant.id)}
              >
                <div className="variant-name">{variant.name}</div>
                <div className="variant-meta">
                  <span>{variant.category.toUpperCase()}</span>
                  <span>{variant.status}</span>
                  {variant.rating && <span>⭐ {variant.rating}</span>}
                </div>
              </VariantCard>
            ))}
          </div>
        </VariantsSection>
      )}
    </Container>
  )
}

export default ModelDetailPage 