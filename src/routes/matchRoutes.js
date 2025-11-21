// src/routes/matchRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createMatchRequest, updateMatchRequestStatus, getMatchRequestsForTalent } = require('../controllers/matchRequestController');

router.post('/', protect, createMatchRequest);
router.get('/my', protect, getMatchRequestsForTalent);
router.patch('/:id/status', protect, updateMatchRequestStatus);

module.exports = router;