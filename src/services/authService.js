const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const Jwt = require('jsonwebtoken');

async function createUser(data) {
  // Let Mongoose model handle the validation and creation
  // The pre-save hook in the User model will hash the password
  try {
    return await User.create(data);
  } catch (error) {
    // Re-throw the error to be caught by the controller
    throw error;
  }
}

async function login(email, password) { // 'password' is the argument name
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email address');
    error.statusCode = 401;
    throw error;
  }

  // 💡 FIX: Use the 'password' argument, not 'enteredPassword'
  const isPasswordValid = await user.matchPassword(password); 
  if (!isPasswordValid) {
    const error = new Error('Invalid password');
    error.statusCode = 401;
    throw error;
  }

  const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return {
   user:{
  id: user._id,
   name: user.name,
   email: user.email,
   role: user.role
},
    token,
  };
}

async function findUserByEmail(email, selectPassword = false) {
  return await User.findOne({ email }).select(selectPassword ? '+password' : '');
}

async function verifyPassword(user, enteredPassword) {
  return await bcrypt.compare(enteredPassword, user.password);
}

async function generateResetTokenForUser(user) {
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });
  return resetToken;
}

async function resetUserPasswordByToken(token, password) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) throw new Error('Invalid or expired token');
  user.password = password; // The 'pre-save' hook in the User model will hash this
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  return await user.save();
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
  generateResetTokenForUser,
  resetUserPasswordByToken,
  login,
};
