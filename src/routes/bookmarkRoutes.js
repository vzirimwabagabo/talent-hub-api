// src/routes/bookmarkRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const {
 createBookmark,
  getUserBookmarks,
  deleteBookmark
} = require('../controllers/bookmarkController');

// Add a new bookmark
router.post('/', protect, asyncHandler(createBookmark));

// Get all bookmarks for the logged-in user
router.get('/', protect, asyncHandler(getUserBookmarks));

// Delete a bookmark by ID
router.delete('/:id', protect, asyncHandler(deleteBookmark));

module.exports = router;
