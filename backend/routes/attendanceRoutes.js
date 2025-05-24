const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const moment = require('moment');

router.post('/check', async (req, res) => {
  const { employeeId } = req.body;
  const today = moment().format('YYYY-MM-DD');
  const now = moment().format('HH:mm');

  let record = await Attendance.findOne({ employeeId, date: today });

  if (!record) {
    record = new Attendance({ employeeId, date: today, checkIn: now });
    await record.save();
    return res.send({ message: 'Checked in at ' + now });
  }

  if (!record.checkOut) {
    record.checkOut = now;
    await record.save();
    return res.send({ message: 'Checked out at ' + now });
  }

  res.send({ message: 'Already checked in and out today' });
});

router.post('/status', async (req, res) => {
  const { employeeId } = req.body;
  const records = await Attendance.find({ employeeId });

  const results = records.map(r => {
    const checkIn = moment(r.checkIn, 'HH:mm');
    const checkOut = moment(r.checkOut, 'HH:mm');
    const late = checkIn.isAfter(moment('09:15', 'HH:mm'));
    const early = checkOut.isBefore(moment('17:00', 'HH:mm'));
    const halfDay = checkOut.diff(checkIn, 'hours') < 4;
    return {
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      lateEntry: late,
      earlyExit: early,
      halfDay: halfDay,
    };
  });

  res.send(results);
});

module.exports = router;
