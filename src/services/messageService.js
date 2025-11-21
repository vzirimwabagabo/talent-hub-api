const Message = require('../models/Message');

// Send a message from sender to receiver
async function sendMessage(sender, receiver, content) {
  const message = new Message({ sender, receiver, content });
  return await message.save();
}

// Retrieve all messages between user1 and user2 sorted by time
async function getConversation(userId) {
  return await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .sort({ sentAt: -1 })    // newest first
    .populate('sender', 'name email')
    .populate('receiver', 'name email');
}

// Mark a message as read by receiver
async function markMessageRead(userId, messageId) {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, receiver: userId },
    { read: true },
    { new: true }
  );
  if (!message) throw new Error('Message not found or not authorized');
  return message;
}

// Get all messages involving the user
async function getMessagesForUser(userId) {
  return await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .sort({ sentAt: -1 })    // newest first
    .populate('sender', 'name email')
    .populate('receiver', 'name email');
}

// Get unread messages for the user
async function getUnreadMessages(userId) {
  return await Message.find({
    receiver: userId,
    read: false
  }).sort({ sentAt: -1 });
}

// Delete a message owned by the user (sender or receiver)
async function deleteMessage(userId, messageId) {
  const result = await Message.findOneAndDelete({
    _id: messageId,
    $or: [{ sender: userId }, { receiver: userId }]
  });
  return result !== null;
}

module.exports = {
  sendMessage,
  getConversation,
  markMessageRead,
  getMessagesForUser,
  getUnreadMessages,
  deleteMessage,
};
