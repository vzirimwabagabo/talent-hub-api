// src/services/reviewService.js
const Review = require('../models/Review');

exports.createReview = async (data) => {
  const review = new Review(data);
  return await review.save();
};

exports.getReviewsByReviewer = async (reviewerId) => {
  return await Review.find({ reviewer: reviewerId })
    .populate('talentProfile', 'title name')
    .populate('reviewer', 'name');
};

exports.getReviewsByTalent = async (talentId) => {
  return await Review.find({ talentProfile: talentId })
    .populate('reviewer', 'name')
    .sort({ createdAt: -1 });
};

exports.getAllReviews = async () => {
  return await Review.find()
    .populate('talentProfile')
    .populate('reviewer', 'name')
    .sort({ createdAt: -1 });
};

// ✅ Single, consistent deleteReview
exports.deleteReview = async (id, userId) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new Error('Review not found');
  }
  if (review.reviewer.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }
  await Review.findByIdAndDelete(id);
  return review;
};

exports.updateReview = async (id, userId, updateData) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new Error('Review not found');
  }
  if (review.reviewer.toString() !== userId.toString()) {
    throw new Error('Not authorized');
  }
  return await Review.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};