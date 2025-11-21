// create a temporary file: dropIndex.js
//const mongoose = require('mongoose');
const Conversation = require('../models/Conversation'); // adjust path as needed

async function dropIndex() {
  try {
    //await mongoose.connect('your-mongodb-connection-string');
    await Conversation.collection.dropIndex("participants_1");
    console.log("Index dropped successfully");
  } catch (error) {
    console.log("Error dropping index:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

//dropIndex();

module.exports = dropIndex