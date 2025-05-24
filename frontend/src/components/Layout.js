import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Sidebar */}
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

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* Page content rendered here */}
      <div className="page-content" style={{ marginLeft: open ? 250 : 0, transition: 'margin-left 0.3s ease' }}>
        <Outlet />
      </div>
    </>
  );
}
