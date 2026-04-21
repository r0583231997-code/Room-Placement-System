const mongoose = require('mongoose');
const { Schema } = mongoose;

const canceledBookingSchema = new Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const CanceledBooking = mongoose.model('CanceledBooking', canceledBookingSchema);
module.exports = CanceledBooking;