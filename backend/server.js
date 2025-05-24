require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Attendance = require('./models/Attendance');
const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
// Add new employee
app.post('/api/employees', async (req, res) => {
  const { employeeId, name } = req.body;
  const exists = await Employee.findOne({ employeeId });
  if (exists) return res.status(400).json({ message: 'Employee already exists' });

  const emp = new Employee({ employeeId, name });
  await emp.save();
  res.json({ message: 'Employee added successfully.' });
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  const employees = await Employee.find().sort({ name: 1 });
  res.json(employees);
});

// Check attendance status
app.get('/api/attendance/status/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const emp = await Employee.findOne({ employeeId });
  if (!emp) return res.status(404).json({ message: 'Employee not found.' });

  const today = new Date().toISOString().split('T')[0];
  const attendance = await Attendance.findOne({ employeeId, date: today });

  if (!attendance) return res.json({ status: 'notCheckedIn' });
  if (!attendance.checkOut) return res.json({ status: 'checkedIn' });
  return res.json({ status: 'checkedOut' });
});

// Check-in
app.post('/api/attendance/checkin', async (req, res) => {
  const { employeeId } = req.body;
  const emp = await Employee.findOne({ employeeId });
  if (!emp) return res.status(404).json({ message: 'Employee not found.' });

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const exists = await Attendance.findOne({ employeeId, date: today });
  if (exists) return res.status(400).json({ message: 'Already checked in today.' });

  const isExact10AM = now.getHours() === 10 && now.getMinutes() === 0;

  const attendance = new Attendance({
    employeeId,
    date: today,
    checkIn: now,
    status: isExact10AM ? 'on-time' : 'late',
  });

  await attendance.save();
  res.json({ message: isExact10AM ? 'Checked in on time (10 AM).' : 'Checked in, but late.' });
});

// Check-out
app.post('/api/attendance/checkout', async (req, res) => {
  const { employeeId } = req.body;
  const emp = await Employee.findOne({ employeeId });
  if (!emp) return res.status(404).json({ message: 'Employee not found.' });

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const attendance = await Attendance.findOne({ employeeId, date: today });

  if (!attendance || !attendance.checkIn)
    return res.status(400).json({ message: 'Check-in not found.' });

  if (attendance.checkOut)
    return res.status(400).json({ message: 'Already checked out.' });

  attendance.checkOut = now;

  const hoursWorked = (now - new Date(attendance.checkIn)) / (1000 * 60 * 60);
  const isExact4PM = now.getHours() === 16 && now.getMinutes() === 0;
  const isHalfDay = new Date(attendance.checkIn).getHours() >= 12 || hoursWorked < 4;

  if (isHalfDay) attendance.status = 'half-day';

  await attendance.save();

  let msg = isExact4PM ? 'Checked out at exactly 4 PM.' : 'Checked out.';
  if (isHalfDay) msg += ' Marked as half-day.';
  res.json({ message: msg });
});

// Attendance history
app.get('/api/attendance/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const emp = await Employee.findOne({ employeeId });
  if (!emp) return res.status(404).json({ message: 'Employee not found.' });

  const records = await Attendance.find({ employeeId }).sort({ date: -1 });
  res.json(records);
});

// Export as CSV
app.get('/api/attendance/:employeeId/export/csv', async (req, res) => {
  const records = await Attendance.find({ employeeId: req.params.employeeId });
  if (!records.length) return res.status(404).send('No records found.');

  const fields = ['employeeId', 'date', 'checkIn', 'checkOut', 'status'];
  const parser = new Parser({ fields });
  const csv = parser.parse(records);

  res.header('Content-Type', 'text/csv');
  res.attachment(`attendance_${req.params.employeeId}.csv`);
  return res.send(csv);
});

// Export as PDF
app.get('/api/attendance/:employeeId/export/pdf', async (req, res) => {
  const records = await Attendance.find({ employeeId: req.params.employeeId });
  if (!records.length) return res.status(404).send('No records found.');

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=attendance_${req.params.employeeId}.pdf`);
  doc.pipe(res);

  doc.fontSize(16).text(`Attendance Report for ${req.params.employeeId}`, { underline: true });
  doc.moveDown();

  records.forEach(rec => {
    doc.fontSize(12).text(
      `Date: ${rec.date}\nCheck-in: ${rec.checkIn}\nCheck-out: ${rec.checkOut}\nStatus: ${rec.status}\n`
    );
    doc.moveDown();
  });

  doc.end();
});

app.listen(5000, () => console.log('✅ Server running on port 5000'));
