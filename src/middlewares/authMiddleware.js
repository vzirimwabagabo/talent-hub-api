const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  // Extract Bearer token from authorization header (case-insensitive)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB and attach to request excluding sensitive data
    req.user = await User.findById(decoded.id).select('-password');

    // Remove this mock line when DB is enabled
    // req.user = { id: decoded.id, role: 'admin', name: 'Mock User' };

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user.id = decoded.id;

    // Move forward to next middleware/controller
    next();
  } catch (error) {
    console.error('❌ AUTH FAILURE:', error.name, '-', error.message);

    // Determine HTTP status code for error type
    const isAuthError = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';
    const statusCode = isAuthError ? 401 : 500;

    const message = isAuthError
      ? 'Not authorized, token failed validation'
      : 'Internal Server Error during authentication process.';

    return res.status(statusCode).json({ success: false, message });
  }
};

exports.adminOnly = (req, res, next) => {
  // Confirm user is authenticated and has admin role
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
};
