//Recodar instalar cada libreria, preguntar inge mejores opciones
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());
 
// Config los tokes por ahora 
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h';
 
// MySQL usando el archivo env, siempre configurar contreseña y archivo,ver si esxporta con el commit
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proyecto_login',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();
 
// Middleware para proteger rutas con JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Token faltante' });
 
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
    req.user = payload; 
    next();
  });
}
 
// Ruta raíz prueba para aver si get, usar POSTMAN 
app.get('/', (req, res) => res.send('ESTE ES EL BACKEND'));
 
//  Registro de la api POST
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Faltan datos (username/password)' });
 
  try {
    // Verificacion, configurar catth para despues ver otras opciones
    const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (exists.length > 0) return res.status(400).json({ message: 'Usuario ya existe' });
 
    // Hash para la contraseña ,ver otras opciones de encriptacion 
    const hashed = await bcrypt.hash(password, 10);
 
    await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashed, email || null]);
 
    return res.json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});
 
// Login api POST ver tambein si en token funcina con POSTMAN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Faltan datos (username/password)' });
  // Buscar usuario en login, ver si funciona token
  try {
    
    const [rows] = await pool.query('SELECT id, username, password FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });
 
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
 
    // Generar token, revisar si el se genera me diante react, preguntar si esta bien o no 
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
 
    return res.json({ message: 'Login OK', token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});
 
// Segurida de ruta de api
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});
 
// Obtener lista de usurios, ver si se puede cambiar a futuro con roles 
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    console.error('Users list error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});
 
// Al iniciar deveria ver el mensaje, si hay error verificar las rutas,
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));