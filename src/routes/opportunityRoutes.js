// src/routes/opportunityRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createOpportunity, getAllOpportunities, getOpportunityById, updateOpportunity, deleteOpportunity } = require('../controllers/opportunityController');

router.post('/', protect, createOpportunity);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);
router.patch("/:id", protect, updateOpportunity);
router.delete("/:id", protect, deleteOpportunity);

module.exports = router;