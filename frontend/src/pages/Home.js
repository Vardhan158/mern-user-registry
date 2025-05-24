import { useState } from 'react';
import axios from 'axios';
import '../common.css'

export default function Home() {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/status/${employeeId}`);
      setStatus(res.data.status);
      setMessage('');
    } catch {
      setMessage('Error checking status.');
    }
  };

  const handleCheckIn = async () => {
    const res = await axios.post('http://localhost:5000/api/attendance/checkin', { employeeId });
    setMessage(res.data.message);
    setStatus('checkedIn');
  };

  const handleCheckOut = async () => {
    const res = await axios.post('http://localhost:5000/api/attendance/checkout', { employeeId });
    setMessage(res.data.message);
    setStatus('checkedOut');
  };

  return (
    <div>
      <h2>Home</h2>
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <button onClick={handleCheckStatus}>Check</button>

      {status === 'notCheckedIn' && <button onClick={handleCheckIn}>Check In</button>}
      {status === 'checkedIn' && <button onClick={handleCheckOut}>Check Out</button>}
      {status === 'checkedOut' && <p>Already Checked Out</p>}

      {message && <p>{message}</p>}
    </div>
  );
}
