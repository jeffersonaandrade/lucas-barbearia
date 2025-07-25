import './App.css'
import { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import { SuspenseWrapper } from './components/ui/suspense-wrapper.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Lazy loading para componentes menos críticos
const About = lazy(() => import('./components/About.jsx'))
const Services = lazy(() => import('./components/Services.jsx'))
const Testimonials = lazy(() => import('./components/Testimonials.jsx'))

const Contact = lazy(() => import('./components/Contact.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

// Páginas do sistema de filas
const EntrarFila = lazy(() => import('./pages/EntrarFila.jsx'))
const StatusFila = lazy(() => import('./pages/StatusFila.jsx'))
const VisualizarFila = lazy(() => import('./pages/VisualizarFila.jsx'))
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'))
const QRCodeGenerator = lazy(() => import('./components/QRCodeGenerator.jsx'))
const BarbeariasList = lazy(() => import('./components/BarbeariasList.jsx'))
const NotFound = lazy(() => import('./components/NotFound.jsx'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy.jsx'))
const TermsOfService = lazy(() => import('./components/TermsOfService.jsx'))
const Avaliacao = lazy(() => import('./components/Avaliacao.jsx'))
const AvaliacoesList = lazy(() => import('./components/AvaliacoesList.jsx'))

// Componentes administrativos
const Login = lazy(() => import('./components/Login.jsx'))
const RecuperarSenha = lazy(() => import('./components/RecuperarSenha.jsx'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard.jsx'))


const AdminUsuarios = lazy(() => import('./components/AdminUsuarios.jsx'))
const AdminBarbearias = lazy(() => import('./components/AdminBarbearias.jsx'))
const AdminFuncionarios = lazy(() => import('./components/AdminFuncionarios.jsx'))
const AdminAdicionarFila = lazy(() => import('./components/AdminAdicionarFila.jsx'))
const AdminFilas = lazy(() => import('./components/AdminFilas.jsx'))
const AdminRelatorios = lazy(() => import('./components/AdminRelatorios.jsx'))
const Unauthorized = lazy(() => import('./components/Unauthorized.jsx'))
const TestUserCreation = lazy(() => import('./components/TestUserCreation.jsx'))
const ApiTest = lazy(() => import('./components/ApiTest.jsx'))
const DebugAPI = lazy(() => import('./components/DebugAPI.jsx'))

function AppContent() {
  const location = useLocation();
  
  // Verificar se está em uma rota administrativa
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen">
      <Routes>
          {/* Página inicial */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Hero />
                <SuspenseWrapper>
                  <About />
                </SuspenseWrapper>
                <SuspenseWrapper>
                  <Services />
                </SuspenseWrapper>
                <SuspenseWrapper>
                  <Testimonials />
                </SuspenseWrapper>
                <SuspenseWrapper>
                  <Contact />
                </SuspenseWrapper>
              </main>
              <SuspenseWrapper>
                <Footer />
              </SuspenseWrapper>
              <WhatsAppFloat />
            </>
          } />
          
          {/* Rotas do sistema de filas */}
          <Route path="/entrar-fila" element={
            <SuspenseWrapper>
              <EntrarFila />
            </SuspenseWrapper>
          } />
          
          {/* Rota principal para entrar na fila via QR Code */}
          <Route path="/barbearia/:id/entrar-fila" element={
            <SuspenseWrapper>
              <EntrarFila />
            </SuspenseWrapper>
          } />
          
          {/* Rota de desenvolvimento para testes (sem QR Code) */}
          <Route path="/dev/barbearia/:id/entrar-fila" element={
            <SuspenseWrapper>
              <EntrarFila />
            </SuspenseWrapper>
          } />
          
          <Route path="/barbearia/:id/status-fila" element={
            <SuspenseWrapper>
              <StatusFila />
            </SuspenseWrapper>
          } />
          
          <Route path="/barbearia/:id/visualizar-fila" element={
            <SuspenseWrapper>
              <VisualizarFila />
            </SuspenseWrapper>
          } />
          
          {/* Rotas administrativas */}
          <Route path="/admin/login" element={
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          } />
          
          <Route path="/admin/recuperar-senha" element={
            <SuspenseWrapper>
              <RecuperarSenha />
            </SuspenseWrapper>
          } />
          
          {/* Rotas administrativas específicas - devem vir antes da rota /admin genérica */}
          <Route path="/admin/usuarios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuspenseWrapper>
                <AdminUsuarios />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/barbearias" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuspenseWrapper>
                <AdminBarbearias />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/funcionarios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuspenseWrapper>
                <AdminFuncionarios />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/adicionar-fila" element={
            <ProtectedRoute allowedRoles={['admin', 'gerente', 'barbeiro']}>
              <SuspenseWrapper>
                <AdminAdicionarFila />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/filas" element={
            <ProtectedRoute allowedRoles={['admin', 'gerente', 'barbeiro']}>
              <SuspenseWrapper>
                <AdminFilas />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/relatorios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuspenseWrapper>
                <AdminRelatorios />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'gerente', 'barbeiro']}>
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/unauthorized" element={
            <ProtectedRoute allowedRoles={['admin', 'gerente', 'barbeiro']}>
              <SuspenseWrapper>
                <Unauthorized />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          

          
          {/* Rota para gerar QR Code da barbearia */}
          <Route path="/qr-code/:barbeariaId" element={
            <SuspenseWrapper>
              <QRCodeGenerator />
            </SuspenseWrapper>
          } />
          
          <Route path="/barbearias" element={
            <SuspenseWrapper>
              <BarbeariasList />
            </SuspenseWrapper>
          } />
          
          {/* Páginas legais */}
          <Route path="/privacidade" element={
            <SuspenseWrapper>
              <PrivacyPolicy />
            </SuspenseWrapper>
          } />
          
          <Route path="/termos" element={
            <SuspenseWrapper>
              <TermsOfService />
            </SuspenseWrapper>
          } />
          
          {/* Rota para avaliação após atendimento */}
          <Route path="/barbearia/:id/avaliacao" element={
            <SuspenseWrapper>
              <Avaliacao />
            </SuspenseWrapper>
          } />
          
          {/* Rota para lista de avaliações (admin) */}
          <Route path="/avaliacoes" element={
            <SuspenseWrapper>
              <AvaliacoesList />
            </SuspenseWrapper>
          } />
          
          <Route path="/debug" element={
            <SuspenseWrapper>
              <DebugAPI />
            </SuspenseWrapper>
          } />
          

          
          {/* Rota /admin genérica - deve vir por último */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'gerente', 'barbeiro']}>
              <SuspenseWrapper>
                <AdminPanel />
              </SuspenseWrapper>
            </ProtectedRoute>
          } />
          
          <Route path="/test-user-creation" element={
            <SuspenseWrapper>
              <TestUserCreation />
            </SuspenseWrapper>
          } />
          
          <Route path="/api-test" element={
            <SuspenseWrapper>
              <ApiTest />
            </SuspenseWrapper>
          } />
          
          <Route path="/debug-api" element={
            <SuspenseWrapper>
              <DebugAPI />
            </SuspenseWrapper>
          } />
          
          {/* Rota catch-all para páginas não encontradas */}
          <Route path="*" element={
            <SuspenseWrapper>
              <NotFound />
            </SuspenseWrapper>
          } />
        </Routes>
        
        {/* Componentes globais que devem aparecer em todas as páginas */}
        {!isAdminRoute && <WhatsAppFloat />}
        <CookieConsent />
      </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
