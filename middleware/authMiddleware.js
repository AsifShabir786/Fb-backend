const jwt = require('jsonwebtoken');
const response = require('../utils/responceHandler');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return response(res, 401, 'Authentication required. Please provide a token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return response(res, 401, 'Invalid or expired token');
  }
};

module.exports = authMiddleware;
