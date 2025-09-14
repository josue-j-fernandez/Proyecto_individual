import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import './index.css'
// Se cambo rutas a App que tendra las rutas para poder configurarlas con los tokens
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <App />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
