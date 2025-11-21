// controllers/conversationController.js
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for current user
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email avatar role supporterType')
      .sort({ updatedAt: -1 });

    // Format response
    const formattedConversations = conversations.map(conv => {
      return {
        id: conv._id.toString(),
        participants: conv.participants.map(p => ({
          id: p._id.toString(),
          name: p.name,
          email: p.email,
          avatar: p.avatar,
          role: p.role,
          supporterType: p.supporterType
        })),
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          senderId: conv.lastMessage.sender ? conv.lastMessage.sender.toString() : null,
          sentAt: conv.lastMessage.sentAt
        } : null,
        unreadCount: conv.unreadCount?.[userId] || 0,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      };
    });

    res.status(200).json({ 
      success: true,
      conversations: formattedConversations 
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// @desc    Start a new conversation or return existing
// @route   POST /api/conversations
// @access  Private
const startConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user._id;
    

    // Validate participantId
    if (!participantId) {
      return res.status(400).json({ 
        success: false,
        message: 'Participant ID is required' 
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid participant ID format' 
      });
    }

    // Convert to ObjectId
    const participantObjectId = new mongoose.Types.ObjectId(participantId);
    
    // Prevent self-messaging
    if (participantObjectId.equals(currentUserId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot start conversation with yourself' 
      });
    }

    // Verify participant exists
    const participant = await User.findById(participantObjectId);
    if (!participant) {
      return res.status(404).json({ 
        success: false,
        message: 'Participant not found' 
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { 
        $all: [currentUserId, participantObjectId],
        $size: 2
      }
    }).populate('participants', 'name email avatar role supporterType');

    if (conversation) {
      console.log("Found existing conversation:", conversation._id);
      
      const formattedConv = {
        id: conversation._id.toString(),
        participants: conversation.participants.map(p => ({
          id: p._id.toString(),
          name: p.name,
          email: p.email,
          avatar: p.avatar,
          role: p.role,
          supporterType: p.supporterType
        })),
        lastMessage: conversation.lastMessage ? {
          content: conversation.lastMessage.content,
          senderId: conversation.lastMessage.sender ? 
            conversation.lastMessage.sender.toString() : null,
          sentAt: conversation.lastMessage.sentAt
        } : null,
        unreadCount: conversation.unreadCount?.[currentUserId.toString()] || 0,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
      
      return res.status(200).json({ 
        success: true,
        conversation: formattedConv 
      });
    }

    //console.log("Creating new conversation...");

    // Create new conversation with proper ObjectIds
    conversation = await Conversation.create({
      participants: [currentUserId, participantObjectId],
      unreadCount: {
        [currentUserId.toString()]: 0,
        [participantId]: 0
      }
    });

    // Populate participant data
    await conversation.populate('participants', 'name email avatar role supporterType');

    const formattedConv = {
      id: conversation._id.toString(),
      participants: conversation.participants.map(p => ({
        id: p._id.toString(),
        name: p.name,
        email: p.email,
        avatar: p.avatar,
        role: p.role,
        supporterType: p.supporterType
      })),
      lastMessage: null,
      unreadCount: 0,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    };

    res.status(201).json({ 
      success: true,
      data: formattedConv 
    });

  } catch (error) {
    console.error('Error starting conversation:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: 'Conversation already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/conversations/:conversationId/messages
// @access  Private
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    // Validate conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ 
        success: false,
        message: 'Conversation not found or access denied' 
      });
    }

    // Fetch messages with sender details
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email avatar')
      .sort({ sentAt: 1 });

    //console.log(`Found ${messages.length} messages`);

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      conversationId: msg.conversation.toString(),
      sender: {
        id: msg.sender._id.toString(),
        name: msg.sender.name,
        email: msg.sender.email,
        avatar: msg.sender.avatar
      },
      content: msg.content,
      read: msg.read,
      sentAt: msg.sentAt,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt
    }));

    // Mark messages as read for current user
    await Message.updateMany(
      { 
        conversation: conversationId, 
        sender: { $ne: userId }, // Messages not sent by current user
        read: false 
      },
      { read: true }
    );

    // Reset unread count for this conversation and user
    await Conversation.findByIdAndUpdate(
      conversationId,
      { 
        $set: { 
          [`unreadCount.${userId.toString()}`]: 0 
        } 
      }
    );

    res.status(200).json({ 
      success: true,
      messages: formattedMessages 
    });

  } catch (error) {
    console.error('Error getting conversation messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getConversations,
  startConversation,
  getConversationMessages
};