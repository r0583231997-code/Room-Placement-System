const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  wing: { type: String, required: true },    // אגף 
  floor: { type: Number, required: true },   // קומה 
  size: { type: Number, required: true },    // גודל 
  hasProjector: { type: Boolean, default: false } // האם קיים מקרן 
});

module.exports = mongoose.model('Room', roomSchema);