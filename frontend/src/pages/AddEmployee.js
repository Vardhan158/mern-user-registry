import { useState } from 'react';
import axios from 'axios';
import '../common.css';

export default function AddEmployee() {
  const [employeeId, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    try {
      const res = await axios.post('https://backend-82bb.onrender.com/api/employees', { employeeId, name });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="add-employee-container">
      <h2 className="title">Add Employee</h2>
      <input
        className="input-field"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="input-field"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="submit-button" onClick={handleAdd}>Add</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
