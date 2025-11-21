const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats', protect, getDashboardStats);

module.exports = router;
