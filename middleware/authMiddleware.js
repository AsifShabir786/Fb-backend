const jwt = require('jsonwebtoken');
const response = require('../utils/responceHandler');

const authMiddleware = (req, res, next) => {
  // Get token from cookie or Authorization header
  let token = req?.cookies?.auth_token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return response(res, 401, 'Authentication required. Please provide a token');
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    return response(res, 401, 'Invalid token or expired. Please try again');
  }
};

module.exports = authMiddleware;
