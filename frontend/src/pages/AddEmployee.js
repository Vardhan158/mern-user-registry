import { useState } from 'react';
import axios from 'axios';
import '../common.css';

export default function AddEmployee() {
  const [employeeId, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    if (!employeeId || !name) {
      setMessage('Please enter both Employee ID and Name.');
      return;
    }

    try {
      const res = await axios.post('https://backend-c6uk.onrender.com/employees', { employeeId, name });
      setMessage(res.data.message || 'Employee added successfully');
      setId('');
      setName('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error adding employee';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="add-employee-container">
      <h2>Add Employee</h2>
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setId(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <button onClick={handleAdd} className="submit-button">
        Add
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
