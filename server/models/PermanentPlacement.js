import mongoose from 'mongoose'
const { Schema } = mongoose;
const permanentPlacementSchema = new Schema({
  // קישור לחדר - מאפשר לשלוף את נתוני החדר (אגף, קומה וכו') [cite: 10]
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true 
  },
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ['א', 'ב', 'ג', 'ד', 'ה', 'ו'] // הגבלה לימי עבודה
  },
  startTime: { type: String, required: true }, // פורמט "HH:mm"
  endTime: { type: String, required: true },
  purpose: { type: String, required: true },   // שם השיעור או הקבוצה
  isActive: { type: Boolean, default: true }
}, { timestamps: true }); // מוסיף אוטומטית תאריך יצירה ועדכון

export default mongoose.model('PermanentPlacement', permanentPlacementSchema);