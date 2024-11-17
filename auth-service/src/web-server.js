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

  try {
    const user = users[username]

    if (user?.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    let token = tokens[username]

    if (!token) {
      token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 15), data: { username, role: user.role } }, secret)
      tokens[username] = token
    }

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

  if (!tokens[token]) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (users[decoded.data.username].role === decoded.data.role) {
      res.json('OK');
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(process.env.AUTH_PORT, () => {
  console.log(`Server is running on port ${process.env.AUTH_PORT}`);
});
