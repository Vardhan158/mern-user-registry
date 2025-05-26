import { useState } from 'react';
import axios from 'axios';
import '../common.css';

const ExportButtons = ({ employeeId }) => {
  if (!employeeId) return null;

  return (
    <div className="export-buttons">
      <button
        className="export-button csv"
        onClick={() =>
          window.open(`https://backend-82bb.onrender.com/api/attendance/${employeeId}/export/csv`, '_blank')
        }
      >
        Export CSV
      </button>
      <button
        className="export-button pdf"
        onClick={() =>
          window.open(`https://backend-82bb.onrender.com/api/attendance/${employeeId}/export/pdf`, '_blank')
        }
      >
        Export PDF
      </button>
    </div>
  );
};

export default function Dashboard() {
  const [employeeId, setEmployeeId] = useState('');
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAttendance = async () => {
    if (!employeeId.trim()) {
      setMessage('Please enter a valid Employee ID');
      setRecords([]);
      return;
    }
    try {
      const res = await axios.get(`https://backend-82bb.onrender.com/api/attendance/${employeeId.trim()}`);
      setRecords(res.data);
      setMessage(res.data.length ? '' : 'No attendance records found');
    } catch (err) {
      setMessage('Error fetching attendance');
      setRecords([]);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="title">Dashboard</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="input-field"
        />
        <button className="submit-button" onClick={fetchAttendance} disabled={!employeeId.trim()}>
          View Records
        </button>
      </div>

      {message && <p className="error-message">{message}</p>}

      {records.length > 0 && (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={i}>
                  <td>{rec.date}</td>
                  <td>{rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : '-'}</td>
                  <td>{rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '-'}</td>
                  <td>
                    {rec.status === 'on-time' && '✔ On-Time'}
                    {rec.status === 'late' && '⚠ Late Entry'}
                    {rec.status === 'half-day' && '⏱ Half-Day'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ExportButtons employeeId={employeeId.trim()} />
        </>
      )}
    </div>
  );
}
