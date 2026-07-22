import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🚀 Iniciando World Tour Coach...')

const rootElement = document.getElementById('root')
console.log('📦 Root element:', rootElement)

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  console.error('❌ No se encontró el elemento root!')
}