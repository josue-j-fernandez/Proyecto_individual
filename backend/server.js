const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const USERS_PATH = path.join(__dirname, 'users.json');

function readUsers() {
  try {
    if (!fs.existsSync(USERS_PATH)) return [];
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8') || '[]');
  } catch (err) {
    console.error('Error reading users.json', err);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// GET lista de usuarios
app.get('/api/users', (req, res) => {
  const users = readUsers().map(u => ({ username: u.username }));
  res.json(users);
});

// Registro
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Faltan campos' });

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  writeUsers(users);
  res.json({ message: 'Registro OK' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Faltan campos' });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

  
  res.json({ message: 'Login OK', user: { username } });
});

const PORT = process.env.PORT || 4000;
//Con esto puedo verificar de amnera rapida si la pi esta haceendo peticiones GET
app.get ('/', (req,res)=> {res.send('Backend funcionando' )});
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));