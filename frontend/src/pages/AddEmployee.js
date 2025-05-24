import { useState } from 'react';
import axios from 'axios';
import '../common.css'

export default function AddEmployee() {
  const [employeeId, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    try {
      const res = await axios.post('https://backend-c6uk.onrender.com', { employeeId, name });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <input placeholder="Employee ID" value={employeeId} onChange={(e) => setId(e.target.value)} />
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      {message && <p>{message}</p>}
    </div>
  );
}
