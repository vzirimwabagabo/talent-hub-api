// src/controllers/reviewController.js
const reviewService = require('../services/reviewService');

exports.createReview = async (req, res, next) => {
  try {
    const { talentProfile, rating, comment } = req.body;
    const reviewer = req.user._id; // authenticated user

    const review = await reviewService.createReview({
      talentProfile,
      reviewer,
      rating,
      comment
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByReviewer(req.user._id);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByTalent = async (req, res, next) => {
  try {
    const { talentId } = req.params;
    const reviews = await reviewService.getReviewsByTalent(talentId);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const updated = await reviewService.updateReview(req.params.id, req.user._id, req.body);
    res.json({ success: true, review: updated });
  } catch (error) {
    if (error.message === 'Not authorized' || error.message === 'Review not found') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user._id);
    res.status(204).send(); // No content
  } catch (error) {
    if (error.message === 'Not authorized' || error.message === 'Review not found') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};