const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly} = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const {authorize} = require('../middlewares/index');


// ======================
// DASHBOARD ANALYTICS
// ======================
router.get('/analytics', protect, adminOnly, asyncHandler(adminController.getAnalytics));
router.get('/stats', protect, adminOnly, asyncHandler(adminController.getDashboardStats));
router.get('/stats/all', protect, adminOnly, asyncHandler(adminController.getAdminStats));

// ======================
// USER MANAGEMENT
// ======================
router.get('/users', protect, authorize('admin', 'supporter'), asyncHandler(adminController.getAllUsers));
router.get('/users/:id', protect, adminOnly, asyncHandler(adminController.getSingleUser));
router.put('/users/:id', protect, adminOnly, asyncHandler(adminController.updateUser));
router.patch('/users/:id', protect, adminOnly, asyncHandler(adminController.updateUser)); // Add this line
router.delete('/users/:id', protect, adminOnly, asyncHandler(adminController.deleteUser));



// ======================
// TALENT MANAGEMENT
// ======================
router.get('/talents', protect, adminOnly, asyncHandler(adminController.getAllTalents));
router.get('/talents/:id', protect, adminOnly, asyncHandler(adminController.getSingleTalent));
router.delete('/talents/:id', protect, adminOnly, asyncHandler(adminController.deleteTalent));

// ======================
// VOLUNTEER MANAGEMENT
// ======================
router.get('/volunteers', protect, adminOnly, asyncHandler(adminController.getAllVolunteers));
router.get('/volunteers/:id', protect, adminOnly, asyncHandler(adminController.getSingleVolunteer));
router.delete('/volunteers/:id', protect, adminOnly, asyncHandler(adminController.deleteVolunteer));

// ======================
// DONATIONS MANAGEMENT
// ======================
router.get('/donations', protect, adminOnly, asyncHandler(adminController.getAllDonations));
router.get('/donations/:id', protect, adminOnly, asyncHandler(adminController.getSingleDonation));
router.delete('/donations/:id', protect, adminOnly, asyncHandler(adminController.deleteDonation));

// ======================
// CHAT / MESSAGING
// ======================
router.get('/conversations', protect, adminOnly, asyncHandler(adminController.getAllConversations));
router.get('/conversations/:id/messages', protect, adminOnly, asyncHandler(adminController.getConversationMessages));
router.delete('/messages/:id', protect, adminOnly, asyncHandler(adminController.deleteMessage));
router.delete('/conversations/:id', protect, adminOnly, asyncHandler(adminController.deleteConversation));

module.exports = router;
