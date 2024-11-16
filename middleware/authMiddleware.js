// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateRole(role) {
  return (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(403).send('Access denied');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) return res.status(403).send('Access denied');
      next();
    } catch (err) {
      res.status(403).send('Invalid token');
    }
  };
}

module.exports = authenticateRole;
