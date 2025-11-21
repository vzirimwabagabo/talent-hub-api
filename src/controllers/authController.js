const authService = require('../services/authService');
const { success, error } = require('../utils/response');

exports.registerUser = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    success(res, 'Registration successful', user, 201);
  } catch (err) {
    // Check for Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return error(res, messages.join(' '), 400); // 400 Bad Request
    }

    // Check for MongoDB duplicate key error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return error(res, 'An account with this email already exists.', 409); // 409 Conflict
    }

    // Log the full error for debugging and then send response
    console.error('REGISTRATION_ERROR_DETAIL:', err);
    error(res, err.message || 'An unexpected error occurred during registration.', err.statusCode || 500);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    success(res, 'Login successful', user);
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email, req.protocol, req.get('host'));
    success(res, 'Password reset email sent');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    success(res, 'Password reset successful');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.getUserProfile = async (req, res, next) => { 
    // This avoids a second, failing database query.
    if (req.user) {
        // You should only return the necessary fields to the client.
        const userProfile = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            // Include other non-sensitive fields as needed (e.g., createdAt)
        };
        success(res, 'User profile retrieved', userProfile);
    } else {
        // Fallback safety check if req.user somehow wasn't set.
        error(res, 'Authentication failed: User data not available', 401);
    }
};

exports.deleteUser = async (req, res, next) => { 
  try {
    await authService.deleteUser(req.user.id);
    success(res, 'User deleted successfully');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
 };

exports.deleteAllUsers = async (req, res, next) => { 
  try {
    await authService.deleteAllUsers();
    success(res, 'All users deleted successfully');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
};

exports.createAdminAccount = async (req, res, next) => { 
  try {
    await authService.createAdminAccount();
    success(res, 'Admin account created successfully');
  } catch (err) {
    error(res, err.message, err.statusCode);
  }
 };