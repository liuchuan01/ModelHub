import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ModelDetailPage from './pages/ModelDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import PurchasedPage from './pages/PurchasedPage'
import AddModelPage from './pages/AddModelPage'

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
          <Route path="/add-model" element={<AddModelPage />} />
        </Routes>
      </MainContent>
    </AppContainer>
  )
}

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()

  console.log('App render:', { 
    isAuthenticated, 
    isLoading, 
    user: user?.username || 'null',
    timestamp: new Date().toISOString()
  })

  // 强制重新渲染检查
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  
  React.useEffect(() => {
    console.log('App: Auth state changed, forcing update')
    forceUpdate()
  }, [isAuthenticated, user])

  if (isLoading) {
    console.log('App: showing loading state')
    return (
      <LoadingContainer>
        <p>正在加载...</p>
      </LoadingContainer>
    )
  }

  if (isAuthenticated) {
    console.log('App: user is authenticated, showing main app')
    return <AuthenticatedApp />
  } else {
    console.log('App: user is not authenticated, showing login page')
    return <LoginPage />
  }
}

export default App