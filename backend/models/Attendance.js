const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String }, // 'on-time', 'late', 'half-day'
});

module.exports = mongoose.model('Attendance', attendanceSchema);
