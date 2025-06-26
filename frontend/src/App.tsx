import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ModelDetailPage from './pages/ModelDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import PurchasedPage from './pages/PurchasedPage'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--color-gray-50);
`

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px; /* 侧边栏宽度 */
  min-height: 100vh;
  transition: margin-left var(--transition-normal);
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: var(--color-gray-600);
`

const AuthenticatedApp: React.FC = () => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/model/:id" element={<ModelDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/purchased" element={<PurchasedPage />} />
        </Routes>
      </MainContent>
    </AppContainer>
  )
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <LoadingContainer>
        <p>正在加载...</p>
      </LoadingContainer>
    )
  }

  return isAuthenticated ? <AuthenticatedApp /> : <LoginPage />
}

export default App 