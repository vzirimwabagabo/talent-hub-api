// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  createReview,
  getUserReviews,
  getAllReviews,
  deleteReview,
  getReviewsByTalent,
  updateReview
} = require('../controllers/reviewController');
// Routes
router.post('/', protect, asyncHandler(createReview));
router.get('/me', protect, asyncHandler(getUserReviews));
router.get('/', protect, adminOnly, asyncHandler(getAllReviews));
router.get('/talent/:talentId', protect, asyncHandler(getReviewsByTalent)); // ✅ also add this if used
router.put('/:id', protect, asyncHandler(updateReview)); // ✅ now defined
router.delete('/:id', protect, asyncHandler(deleteReview));

module.exports = router;