import mongoose from 'mongoose'
const { Schema } = mongoose;
const roomSchema = new Schema({
  wing: { type: String, required: true },    // אגף 
  floor: { type: Number, required: true },   // קומה 
  size: { type: Number, required: true },    // גודל 
  hasProjector: { type: Boolean, default: false } // האם קיים מקרן 
});

export default mongoose.model('Room', roomSchema);