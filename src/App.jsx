import './App.css'
import { lazy } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhatsAppFloat from './components/WhatsAppFloat.jsx'
import CalendlyFloat from './components/CalendlyFloat.jsx'
import { SuspenseWrapper } from './components/ui/suspense-wrapper.jsx'

// Lazy loading para componentes menos críticos
const About = lazy(() => import('./components/About.jsx'))
const Videos = lazy(() => import('./components/Videos.jsx'))
const Courses = lazy(() => import('./components/Courses.jsx'))
const Testimonials = lazy(() => import('./components/Testimonials.jsx'))
const FAQ = lazy(() => import('./components/FAQ.jsx'))
const Contact = lazy(() => import('./components/Contact.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SuspenseWrapper>
          <About />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <Videos />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <Courses />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <Testimonials />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <FAQ />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <Contact />
        </SuspenseWrapper>
      </main>
      <SuspenseWrapper>
        <Footer />
      </SuspenseWrapper>
      <WhatsAppFloat />
      <CalendlyFloat />
    </div>
  )
}

export default App
