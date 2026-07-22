import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Mostrar un mensaje para saber que el script se ejecuta
console.log('🚀 Iniciando World Tour Coach...')

// Asegurarnos de que el root existe
const rootElement = document.getElementById('root')
console.log('📦 Root element:', rootElement)

if (rootElement) {
  console.log('✅ Renderizando App...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('❌ No se encontró el elemento root!')
}