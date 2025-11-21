const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middlewares/index');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSuggestedUsers
} = require('../controllers/userController');

const router = express.Router();

// GET all users - admin only
router.get('/', protect, authorize('admin'), getAllUsers);

// Suggested users route (must be BEFORE /:id)
router.get('/suggested', protect, asyncHandler(getSuggestedUsers));


// Routes using ID
router.route('/:id')
  .get(protect, authorize('admin', 'supporter'), getUserById)
  .put(protect, authorize('admin', 'supporter'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);
  

module.exports = router;
