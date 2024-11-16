const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
      if (err) return res.status(500).send('Server error');
      if (results.length > 0) return res.status(400).send('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, role],
        (err) => {
          if (err) return res.status(500).send('Error registering user');
          res.status(201).send('User registered successfully');
        }
      );
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set authToken cookie
    res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({ message: 'Login successful' });
  });
};


exports.getUser = (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(200).json({ username: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ username: decoded.username });
  } catch (error) {
    res.status(200).json({ username: null });
  }
};
