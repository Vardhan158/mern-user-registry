import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <div className={`sidebar ${open ? 'open' : ''}`}>
        <h3>Attendance</h3>
        <nav>
          <ul>
            <li>
              <Link to="/home" onClick={() => setOpen(false)}>
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/add-employee" onClick={() => setOpen(false)}>
                ➕ Add Employee
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/employee-list" onClick={() => setOpen(false)}>
                👥 Employee List
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}
