// routes/conversationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const asyncHandler = require('express-async-handler');
const {getConversationMessages, getConversations, startConversation} = require("../controllers/conversationController")

// Get all conversations for current user
router.get('/', protect, asyncHandler(getConversations));

// Start a new conversation (or get existing)
router.post('/', protect, asyncHandler(startConversation));

// Get messages in a conversation
router.get('/:conversationId/messages', protect, asyncHandler(getConversationMessages));

module.exports = router;