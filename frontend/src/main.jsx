import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // ← This should match your actual App file
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
