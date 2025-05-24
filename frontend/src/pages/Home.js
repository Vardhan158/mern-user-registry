import { useState } from 'react';
import axios from 'axios';
import '../common.css';

export default function Home() {
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckStatus = async () => {
    try {
      const res = await axios.get(`https://backend-82bb.onrender.com/api/attendance/status/${employeeId}`);
      setStatus(res.data.status);
      setMessage('');
    } catch {
      setMessage('Error checking status.');
    }
  };

  const handleCheckIn = async () => {
    const res = await axios.post('https://backend-82bb.onrender.com/api/attendance/checkin', { employeeId });
    setMessage(res.data.message);
    setStatus('checkedIn');
  };

  const handleCheckOut = async () => {
    const res = await axios.post('https://backend-82bb.onrender.com/api/attendance/checkout', { employeeId });
    setMessage(res.data.message);
    setStatus('checkedOut');
  };

  return (
    <div className="home-container">
      <h2 className="title">Attendance System</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <button className="submit-button" onClick={handleCheckStatus}>Check Status</button>

      {status === 'notCheckedIn' && (
        <button className="action-button checkin" onClick={handleCheckIn}>Check In</button>
      )}
      {status === 'checkedIn' && (
        <button className="action-button checkout" onClick={handleCheckOut}>Check Out</button>
      )}
      {status === 'checkedOut' && (
        <p className="info-text">Already Checked Out</p>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}
