const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const users = require('./users.json');
const secret = require('./secret');

const app = express();
app.use(express.json());
app.use(cors());

const tokens = {}

app.post("/login", async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const user = users[username]

  if (user?.password !== password) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  let token = tokens[username]
  let isTokenValid

  if (token) {
    try {
      jwt.verify(token, secret)
      isTokenValid = true
    } catch {
      isTokenValid = false
    }
  }

  if (isTokenValid) {
    res.json({ token })
    return
  }
  

  try {
    token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 15), data: { username, role: user.role } }, secret)
    tokens[username] = token
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.post("/logout", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    delete tokens[decoded.data.username]
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    const actualToken = tokens[decoded.data.username]

    if (actualToken !== token) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    res.json('OK');
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(process.env.AUTH_PORT, () => {
  console.log(`Server is running on port ${process.env.AUTH_PORT}`);
});
