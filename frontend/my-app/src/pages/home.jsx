import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function Home() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
 
  useEffect(() => {
    const user = sessionStorage.getItem('user')
    if (!user) {
      navigate('/') // no logueado -> login
      return
    }
    fetchUsers()
    // eslint-disable-next-line
  }, [])
 
  async function fetchUsers() {
    try {
      const res = await fetch('http://localhost:4000/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }
 
  const handleRegister = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsg(data.message || 'Error')
        return
      }
      setMsg('Usuario registrado')
      setUsername('')
      setPassword('')
      fetchUsers()
    } catch (err) {
      setMsg('Error de red')
    }
  }
 
  const handleLogout = () => {
    sessionStorage.removeItem('user')
    navigate('/')
  }
 
  return (
    <div style={{maxWidth:700, margin:'20px auto'}}>
      <h2>Página principal</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
 
      <section>
        <h3>Registrar nuevo usuario</h3>
        <form onSubmit={handleRegister}>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="usuario" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="contraseña" required />
          <button type="submit">Registrar</button>
        </form>
        <p style={{color:'green'}}>{msg}</p>
      </section>
 
      <section>
        <h3>Usuarios registrados</h3>
        <ul>
          {users.map(u => <li key={u.username}>{u.username}</li>)}
        </ul>
      </section>
    </div>
  )
}