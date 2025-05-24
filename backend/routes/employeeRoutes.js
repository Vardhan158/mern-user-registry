const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.post('/add', async (req, res) => {
  const { employeeId, name } = req.body;
  const employee = new Employee({ employeeId, name });
  await employee.save();
  res.send({ message: 'Employee added' });
});

module.exports = router;
