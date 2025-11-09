import React, { useState } from 'react'
import styled from 'styled-components'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  editable?: boolean
}

const StarContainer = styled.div<{ editable?: boolean }>`
  display: flex;
  gap: 4px;
  ${props => props.editable && `
    cursor: pointer;
  `}
  border: none;
  outline: none;
`

const StarWrapper = styled.div<{ filled: boolean }>`
  color: ${props => props.filled ? 'var(--color-orange-500)' : 'var(--color-gray-300)'};
  transition: color 0.2s ease;
`

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, editable = false }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (index: number) => {
    if (!editable) return
    onRatingChange(index)
  }

  const handleStarHover = (index: number) => {
    if (!editable) return
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    if (!editable) return
    setHoverRating(0)
  }

  return (
    <StarContainer 
      editable={editable}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <StarWrapper
          key={index}
          filled={index <= (hoverRating || rating)}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
        >
          <Star 
            size={24} 
            fill={index <= (hoverRating || rating) ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </StarWrapper>
      ))}
    </StarContainer>
  )
}

export default StarRating