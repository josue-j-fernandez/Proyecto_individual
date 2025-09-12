import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg(data.message || 'Error')
        return
      }
      sessionStorage.setItem('user', JSON.stringify(data.user))
      navigate('/home')
    } catch (err) {
      setMsg('Error de red')
    }
  }
 
  return (
    <div style={{maxWidth:400, margin:'50px auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="usuario" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <p style={{color:'red'}}>{msg}</p>
    </div>
  )
}