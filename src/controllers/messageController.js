const Message = require('../models/Message');
const messageService = require('../services/messageService');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Send a new message
exports.sendMessage = async (req, res, next) => {
  const {conversationId, senderId, content} = req.body;
  console.log(req.body)
  try {
      if(conversationId === undefined || conversationId === null || conversationId === '') return res.status(400).json({ success: false, message: 'conversationId is required' });
  if(senderId === undefined || senderId === null || senderId === '') return res.status(400).json({ success: false, message: 'senderId is required' });
  if(content === undefined || content === null || content === '') return res.status(400).json({ success: false, message: 'content is required' }); 


  const conversation = await Conversation.findById(conversationId);
  if(!conversation) return res.status(404).json({ success: false, message: 'conversation not found' });


  const sender = await User.findById(senderId);
  if(!sender) return res.status(404).json({ success: false, message: 'sender not found' });

  const message = await Message.create({conversation: conversationId, sender: senderId, content});
  res.status(201).json({ success: true, message });
    
  } catch (error) {

    next(error);
    
  }







  // try {
  //   const sender = req.user._id;
  //   const { receiver, content } = req.body;

  //   const message = await messageService.sendMessage(sender, receiver, content);
  //   res.status(201).json({ success: true, data: message });
  // } catch (error) {
  //   next(error);
  // }
};

// Get messages between current user and another user (conversation)
exports.getConversation = async (req, res, next) => {
  try {
    const userId = req.user._id;
    //const otherUserId = req.params.userId;

    const messages = await messageService.getConversation(userId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
exports.markMessageRead = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;

    const updatedMessage = await messageService.markMessageRead(userId, messageId);
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
};

// Get all messages for the authenticated user
exports.getUserMessages = async (req, res, next) => {
  try {
    //const userId = req.user._id;
    // Assuming this service function returns all messages involving user
    //const messages = await messageService.getMessagesForUser(userId);
    console.log("called from here ")
    const messages = await Message.find({}).populate('sender', 'name email').populate('receiver', 'name email');

    console.log(messages);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// Get all unread messages for the authenticated user
exports.getUnreadMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Assuming a service function to get unread messages exists
    const unreadMessages = await messageService.getUnreadMessages(userId);
    res.status(200).json({ success: true, data: unreadMessages });
  } catch (error) {
    next(error);
  }
};

// Mark a message as read
exports.markAsRead = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;
    const updatedMessage = await messageService.markMessageRead(userId, messageId);
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
};

// Delete a message by ID for the authenticated user
exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;
    const deleted = await messageService.deleteMessage(userId, messageId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found or not authorized' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
