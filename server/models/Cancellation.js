import mongoose from 'mongoose'
const { Schema } = mongoose;
const cancellationSchema = new Schema({
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  }, // קישור לחדר מהקובץ Room.js
  date: { 
    type: Date, 
    required: true 
  }, // התאריך שבו הביטול תקף
  reason: { 
    type: String, 
    default: "לא צוינה סיבה" 
  } // למה החדר מבוטל (שיפוץ, אירוע וכו')
});

export default mongoose.model('Cancellation', cancellationSchema);