import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
 
export default function App() {
  return (
    <div>
      <header style={{padding:12, borderBottom:'1px solid #ddd', marginBottom:20}}>
        <nav style={{display:'flex', gap:12, alignItems:'center'}}>
          <Link to="/">Login</Link>
          <Link to="/register">Registro</Link>
          <Link to="/home">Página principal</Link>
        </nav>
      </header>
 
      <main style={{padding: 12}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
    </div>
  )
}
