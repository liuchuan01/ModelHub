import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Calendar, 
  DollarSign, 
  Tag,
  Package,
  ArrowLeft,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react'
import { useModel, useModelVariants, useModelActions } from '../hooks/useModels'
import { formatDate, formatPrice, formatRating } from '../utils/formatters'

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
  padding: 8px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-gray-600);
  font-size: 0.875rem;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-gray-50);
    border-color: var(--color-gray-400);
    color: var(--color-gray-800);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const ModelHeader = styled.div`
  margin-bottom: 32px;
`

const ModelTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  
  .title-content {
    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-gray-900);
      margin-bottom: 8px;
    }
    
    .model-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.875rem;
      color: var(--color-gray-600);
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        
        svg {
          width: 16px;
          height: 16px;
          color: var(--color-gray-500);
        }
      }
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`

const ActionButton = styled.button<{ $variant?: 'favorite' | 'purchase' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  ${props => props.$variant === 'favorite' ? `
    background: ${props.theme?.isFavorited ? 'var(--color-red-50)' : 'var(--color-white)'};
    color: ${props.theme?.isFavorited ? 'var(--color-red-600)' : 'var(--color-gray-600)'};
    border: 1px solid ${props.theme?.isFavorited ? 'var(--color-red-200)' : 'var(--color-gray-200)'};
    
    &:hover {
      background: ${props.theme?.isFavorited ? 'var(--color-red-100)' : 'var(--color-gray-50)'};
      border-color: ${props.theme?.isFavorited ? 'var(--color-red-300)' : 'var(--color-gray-300)'};
    }
  ` : `
    background: ${props.theme?.isPurchased ? 'var(--color-green-50)' : 'var(--color-white)'};
    color: ${props.theme?.isPurchased ? 'var(--color-green-600)' : 'var(--color-gray-600)'};
    border: 1px solid ${props.theme?.isPurchased ? 'var(--color-green-200)' : 'var(--color-gray-200)'};
    
    &:hover {
      background: ${props.theme?.isPurchased ? 'var(--color-green-100)' : 'var(--color-gray-50)'};
      border-color: ${props.theme?.isPurchased ? 'var(--color-green-300)' : 'var(--color-gray-300)'};
    }
  `}
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case '现货':
        return `
          background: var(--color-green-100);
          color: var(--color-green-700);
        `
      case '预售':
        return `
          background: var(--color-orange-100);
          color: var(--color-orange-700);
        `
      case '下架':
        return `
          background: var(--color-gray-100);
          color: var(--color-gray-600);
        `
      default:
        return `
          background: var(--color-gray-100);
          color: var(--color-gray-600);
        `
    }
  }}
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Section = styled.section`
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  padding: 24px;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 18px;
      height: 18px;
      color: var(--color-gray-500);
    }
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`

const InfoItem = styled.div`
  .label {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 0.875rem;
    color: var(--color-gray-900);
    font-weight: 500;
  }
`

const PriceHistory = styled.div`
  .price-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--color-gray-100);
    
    &:last-child {
      border-bottom: none;
    }
    
    .price-date {
      font-size: 0.875rem;
      color: var(--color-gray-600);
    }
    
    .price-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-gray-900);
    }
    
    .price-source {
      font-size: 0.75rem;
      color: var(--color-gray-500);
      margin-top: 2px;
    }
  }
`

const VariantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VariantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    background: var(--color-gray-100);
    border-color: var(--color-gray-300);
  }
  
  .variant-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .variant-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-gray-900);
    }
    
    .variant-meta {
      font-size: 0.75rem;
      color: var(--color-gray-600);
    }
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: var(--color-gray-400);
  }
`

const Notes = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-700);
  line-height: 1.6;
  
  p {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
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

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(false) // 实际应从API获取
  const [isPurchased, setIsPurchased] = useState(false) // 实际应从API获取
  
  const modelId = parseInt(id || '0', 10)
  const { data: model, isLoading, error } = useModel(modelId)
  const { data: variants } = useModelVariants(modelId)
  
  const {
    favoriteModel,
    unfavoriteModel,
    markAsPurchased,
    unmarkAsPurchased,
    isFavoriting,
    isMarkingPurchased
  } = useModelActions()

  const handleBack = () => {
    navigate(-1)
  }
  
  const handleFavoriteClick = async () => {
    try {
      if (isFavorited) {
        await unfavoriteModel(modelId)
        setIsFavorited(false)
      } else {
        await favoriteModel({ modelId })
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Favorite action failed:', error)
    }
  }

  const handlePurchaseClick = async () => {
    try {
      if (isPurchased) {
        await unmarkAsPurchased(modelId)
        setIsPurchased(false)
      } else {
        await markAsPurchased({
          modelId,
          purchaseData: {
            purchased_date: new Date().toISOString().split('T')[0]
          }
        })
        setIsPurchased(true)
      }
    } catch (error) {
      console.error('Purchase action failed:', error)
    }
  }
  
  const handleVariantClick = (variantId: number) => {
    navigate(`/model/${variantId}`)
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

  if (error || !model) {
    return (
      <Container>
        <ErrorState>
          <h3>加载失败</h3>
          <p>无法获取模型数据，请稍后重试。</p>
        </ErrorState>
      </Container>
    )
  }

  const latestPrice = model.price_history && model.price_history.length > 0 
    ? model.price_history[0].price 
    : undefined

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <ArrowLeft />
        返回
      </BackButton>
      
      <ModelHeader>
        <ModelTitle>
          <div className="title-content">
            <h1>{model.name}</h1>
            <div className="model-meta">
              <div className="meta-item">
                <Package />
                <span>{model.manufacturer?.name || '未知厂商'}</span>
              </div>
              <div className="meta-item">
                <Tag />
                <span>{model.category?.toUpperCase()}</span>
              </div>
              {model.series && (
                <div className="meta-item">
                  <Info />
                  <span>{model.series}</span>
                </div>
              )}
              {model.rating && (
                <div className="meta-item">
                  <Star fill="currentColor" />
                  <span>{model.rating.toFixed(1)}</span>
                </div>
              )}
              <StatusBadge $status={model.status}>{model.status}</StatusBadge>
            </div>
          </div>
          
          <ActionButtons>
            <ActionButton
              $variant="favorite"
              theme={{ isFavorited }}
              onClick={handleFavoriteClick}
              disabled={isFavoriting}
            >
              <Heart fill={isFavorited ? 'currentColor' : 'none'} />
              {isFavorited ? '已收藏' : '收藏'}
            </ActionButton>
            
            <ActionButton
              $variant="purchase"
              theme={{ isPurchased }}
              onClick={handlePurchaseClick}
              disabled={isMarkingPurchased}
            >
              <ShoppingBag fill={isPurchased ? 'currentColor' : 'none'} />
              {isPurchased ? '已拥有' : '标记为已购买'}
            </ActionButton>
          </ActionButtons>
        </ModelTitle>
      </ModelHeader>
      
      <ContentGrid>
        <MainContent>
          <Section>
            <h2>
              <Info />
              模型信息
            </h2>
            <InfoGrid>
              <InfoItem>
                <div className="label">厂商</div>
                <div className="value">{model.manufacturer?.name || '未知'}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">分类</div>
                <div className="value">{model.category?.toUpperCase() || '未知'}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">系列</div>
                <div className="value">{model.series || '未分类'}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">状态</div>
                <div className="value">{model.status || '未知'}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">发售日期</div>
                <div className="value">{formatDate(model.release_date || '')}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">评分</div>
                <div className="value">{formatRating(model.rating)}</div>
              </InfoItem>
              {latestPrice && (
                <InfoItem>
                  <div className="label">当前价格</div>
                  <div className="value">{formatPrice(latestPrice)}</div>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>
          
          {model.notes && (
            <Section>
              <h2>备注信息</h2>
              <Notes>
                <p>{model.notes}</p>
              </Notes>
            </Section>
          )}
        </MainContent>
        
        <SideContent>
          {model.price_history && model.price_history.length > 0 && (
            <Section>
              <h2>
                <DollarSign />
                价格历史
              </h2>
              <PriceHistory>
                {model.price_history.map((price) => (
                  <div key={price.id} className="price-item">
                    <div>
                      <div className="price-date">{formatDate(price.price_date)}</div>
                      {price.source && <div className="price-source">{price.source}</div>}
                    </div>
                    <div className="price-value">{formatPrice(price.price)}</div>
                  </div>
                ))}
              </PriceHistory>
            </Section>
          )}
          
          {variants && variants.length > 0 && (
            <Section>
              <h2>
                <Package />
                相关版本
              </h2>
              <VariantsList>
                {variants.map((variant) => (
                  <VariantItem 
                    key={variant.id}
                    onClick={() => handleVariantClick(variant.id)}
                  >
                    <div className="variant-info">
                      <div className="variant-name">{variant.name}</div>
                      <div className="variant-meta">
                        {variant.category?.toUpperCase()} • {variant.status}
                      </div>
                    </div>
                    <ChevronRight />
                  </VariantItem>
                ))}
              </VariantsList>
            </Section>
          )}
        </SideContent>
      </ContentGrid>
    </Container>
  )
}

export default ModelDetailPage 