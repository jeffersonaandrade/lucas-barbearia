import './App.css'
import { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import { SuspenseWrapper } from './components/ui/suspense-wrapper.jsx'

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
const DebugPanel = lazy(() => import('./components/DebugPanel.jsx'))
const TestComponent = lazy(() => import('./components/TestComponent.jsx'))

function App() {
  return (
    <Router>
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
          <Route path="/barbearia/:id/entrar-fila" element={
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
          
          <Route path="/admin" element={
            <SuspenseWrapper>
              <AdminPanel />
            </SuspenseWrapper>
          } />
          
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
          
          <Route path="/debug" element={
            <SuspenseWrapper>
              <DebugPanel />
            </SuspenseWrapper>
          } />
          
          <Route path="/test" element={
            <SuspenseWrapper>
              <TestComponent />
            </SuspenseWrapper>
          } />
          
          {/* Rota de desenvolvimento para testes */}
          <Route path="/dev/entrar-fila/:barbeariaId" element={
            <SuspenseWrapper>
              <EntrarFila />
            </SuspenseWrapper>
          } />
        </Routes>
    </div>
    </Router>
  )
}

export default App
