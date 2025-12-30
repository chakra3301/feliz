import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Ensure custom cursor is applied
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.cursor = "url('/cursor.png') 10 10, auto"
  document.documentElement.style.cursor = "url('/cursor.png') 10 10, auto"
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

