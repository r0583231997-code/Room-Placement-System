import mongoose from 'mongoose'
const { Schema } = mongoose;
const temporaryPlacementSchema = new Schema({
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true // תאריך ספציפי לשיבוץ [cite: 11]
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  // שדה חשוב לפי האפיון: האם זה שיבוץ חדש או שחרור של חדר קיים? [cite: 11]
  type: { 
    type: String, 
    enum: ['placement', 'release'], 
    default: 'placement' 
  },
  
  purpose: { type: String }, // סיבת השיבוץ (למשל: תגבור לקראת מבחן) [cite: 11]
  notes: String
}, { timestamps: true });

export default mongoose.model('TemporaryPlacement', temporaryPlacementSchema);