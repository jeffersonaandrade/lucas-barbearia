import './App.css'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import CookieConsent from './components/CookieConsent.jsx'

import { AuthProvider } from './contexts/AuthContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'


function AppContent() {
  const location = useLocation();
  
  // Verificar se está em uma rota administrativa
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen">
      {/* Header e Hero apenas para a página inicial */}
      {location.pathname === '/' && (
        <>
          <Header />
          <Hero />
        </>
      )}
      
      {/* Sistema de rotas centralizado */}
      <AppRoutes />
      
      {/* Componentes globais que devem aparecer em todas as páginas */}
      {!isAdminRoute && <WhatsAppFloat />}
      <CookieConsent />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
