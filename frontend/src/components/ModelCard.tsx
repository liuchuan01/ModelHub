import React, { useState } from 'react'
import styled from 'styled-components'
import { Heart, ShoppingBag, Star, Calendar, DollarSign } from 'lucide-react'
import { useSpring, animated } from 'react-spring'
import type { Model } from '../types'
import { useModelActions } from '../hooks/useModels'

interface ModelCardProps {
  model: Model
  showActions?: boolean
  onClick?: () => void
}

const Card = styled.div`
  background: var(--color-white);
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-gray-300);
    box-shadow: var(--shadow-sm);
  }
`

const ModelHeader = styled.div`
  margin-bottom: 12px;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-gray-900);
    margin-bottom: 4px;
    line-height: 1.4;
  }
  
  .model-info {
    font-size: 0.875rem;
    color: var(--color-gray-600);
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const ModelMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  
  svg {
    width: 14px;
    height: 14px;
    color: var(--color-orange-500);
  }
`

const Price = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 14px;
    height: 14px;
    color: var(--color-green-500);
  }
`

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button<{ $variant?: 'favorite' | 'purchase' }>`
  flex: 1;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all var(--transition-fast);
  
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
    width: 12px;
    height: 12px;
    stroke-width: 1.5;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
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

const ModelCard: React.FC<ModelCardProps> = ({ 
  model, 
  showActions = true, 
  onClick 
}) => {
  // 从模型数据中获取收藏和购买状态
  const isFavorited = !!model.user_favorites?.length
  const isPurchased = !!model.user_purchases?.length
  
  const {
    favoriteModel,
    unfavoriteModel,
    markAsPurchased,
    unmarkAsPurchased,
    isFavoriting,
    isMarkingPurchased
  } = useModelActions()

  // 购买动画
  const [purchaseAnimation, setPurchaseAnimation] = useSpring(() => ({
    scale: 1,
    rotate: 0,
  }))

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (isFavorited) {
        await unfavoriteModel(model.id)
      } else {
        await favoriteModel({ modelId: model.id })
      }
    } catch (error) {
      console.error('Favorite action failed:', error)
    }
  }

  const handlePurchaseClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      if (isPurchased) {
        await unmarkAsPurchased(model.id)
      } else {
        // 购买动画效果
        setPurchaseAnimation.start({
          scale: 1.2,
          rotate: 10,
          config: { tension: 300, friction: 10 },
          onRest: () => {
            setPurchaseAnimation.start({
              scale: 1,
              rotate: 0,
              config: { tension: 200, friction: 20 }
            })
          }
        })
        
        await markAsPurchased({
          modelId: model.id,
          purchaseData: {
            purchased_date: new Date().toISOString().split('T')[0]
          }
        })
      }
    } catch (error) {
      console.error('Purchase action failed:', error)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    }
  }

  // 格式化价格
  const formatPrice = (price?: number) => {
    if (!price) return '暂无价格'
    return `¥${price}`
  }

  // 获取最新价格
  const latestPrice = model.price_history?.[0]?.price

  return (
    <Card onClick={handleCardClick}>
      <ModelHeader>
        <h3>{model.name}</h3>
        <div className="model-info">
          <span>{model.manufacturer?.name || '未知厂商'}</span>
          <span>•</span>
          <span>{model.category?.toUpperCase()}</span>
          <span>•</span>
          <span>{model.series || '未分类'}</span>
          <span>•</span>
          <StatusBadge $status={model.status}>{model.status}</StatusBadge>
        </div>
      </ModelHeader>

      <ModelMeta>
        {model.rating && (
          <Rating>
            <Star fill="currentColor" />
            <span>{model.rating.toFixed(1)}</span>
          </Rating>
        )}
        
        {latestPrice && (
          <Price>
            <DollarSign />
            <span>{formatPrice(latestPrice)}</span>
          </Price>
        )}
      </ModelMeta>

      {showActions && (
        <ActionBar>
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
            <animated.div style={purchaseAnimation}>
              <ShoppingBag fill={isPurchased ? 'currentColor' : 'none'} />
            </animated.div>
            {isPurchased ? '已拥有' : '标记'}
          </ActionButton>
        </ActionBar>
      )}
    </Card>
  )
}

export default ModelCard 