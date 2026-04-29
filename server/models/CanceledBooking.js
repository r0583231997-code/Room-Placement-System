import mongoose from 'mongoose'
const { Schema } = mongoose;

const canceledBookingSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

export default mongoose.model('CanceledBooking', canceledBookingSchema);
