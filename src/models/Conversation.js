// models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],

  lastMessage: {
    content: { type: String, maxlength: 200 },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: { type: Date }
  },

  unreadCount: {
    type: Object,
    default: () => ({})
  }

}, {
  timestamps: true
});

// Improved pre-save hook - ensure participants are sorted and unique
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }

  // Remove duplicates and sort
  const uniqueParticipants = [...new Set(this.participants.map(p => p.toString()))];
  
  if (uniqueParticipants.length !== 2) {
    return next(new Error('Conversation must have 2 unique participants'));
  }

  // Sort by string representation and convert back to ObjectId
  this.participants = uniqueParticipants
    .sort()
    .map(id => new mongoose.Types.ObjectId(id));

  next();
});

// Create a compound index for unique conversations - FIXED
conversationSchema.index({ 
  'participants.0': 1, 
  'participants.1': 1 
}, { 
  unique: true 
});

// Alternative: Create a virtual field for the sorted participants and index that
conversationSchema.virtual('sortedParticipants').get(function() {
  return this.participants.map(p => p.toString()).sort();
});

module.exports = mongoose.model('Conversation', conversationSchema);