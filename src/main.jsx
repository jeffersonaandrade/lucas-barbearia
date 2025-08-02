import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Importar utilitário de bypass para desenvolvimento
import './utils/devBypass.js'

// Importar sistema de expiração automática do localStorage
import './utils/localStorageExpiration.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
