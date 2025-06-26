import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
`

const ModelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Container>
      <h1>模型详情</h1>
      <p>模型ID: {id}</p>
      <p>模型详情页面 - 开发中...</p>
    </Container>
  )
}

export default ModelDetailPage 