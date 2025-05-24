import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://backend-c6uk.onrender.com/employees') // Update to actual API path
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        return res.json();
      })
      .then(data => setEmployees(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      
      {loading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Employee ID</th>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.employeeId}>
                <td className="border px-4 py-2">{emp.employeeId}</td>
                <td className="border px-4 py-2">{emp.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
