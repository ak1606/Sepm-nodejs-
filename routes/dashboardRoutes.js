// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const authenticateRole = require('../middleware/authMiddleware');

router.get('/student-dashboard', authenticateRole('student'), (req, res) => {
  res.send('<h1>Welcome to the Student Dashboard</h1><a href="/logout">Logout</a>');
});

router.get('/admin-dashboard', authenticateRole('admin'), (req, res) => {
  res.send('<h1>Welcome to the Admin Dashboard</h1><a href="/logout">Logout</a>');
});

module.exports = router;
