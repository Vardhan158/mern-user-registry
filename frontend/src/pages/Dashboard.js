import { useState } from 'react';
import axios from 'axios';
import '../common.css';

const ExportButtons = ({ employeeId }) => {
  if (!employeeId) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={() => window.open(`https://backend-82bb.onrender.com/api/attendance/${employeeId}/export/csv`, '_blank')}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 4,
          marginRight: 8,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Export CSV
      </button>
      <button
        onClick={() => window.open(`https://backend-c6uk.onrender.com/api/attendance/${employeeId}/export/pdf`, '_blank')}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer'
        }}
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
      const res = await axios.get(`https://backend-c6uk.onrender.com/api/attendance/${employeeId.trim()}`);
      setRecords(res.data);
      setMessage(res.data.length ? '' : 'No attendance records found');
    } catch (err) {
      setMessage('Error fetching attendance');
      setRecords([]);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Dashboard</h2>
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        style={{ padding: 8, width: '60%', marginRight: 10 }}
      />
      <button onClick={fetchAttendance} disabled={!employeeId.trim()}>
        View Records
      </button>

      {message && <p style={{ marginTop: 20, color: 'red' }}>{message}</p>}

      {records.length > 0 && (
        <>
          <table
            border="1"
            cellPadding="10"
            style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}
          >
            <thead style={{ backgroundColor: '#f0f0f0' }}>
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
