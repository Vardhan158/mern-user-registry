import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddEmployee from './pages/AddEmployee';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import EmployeeList from './components/EmployeeList';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/add-employee" replace />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-list" element={<EmployeeList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
