import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import AmbulancePage from './pages/AmbulancePage';
import DoctorView from './pages/DoctorView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ambulance" element={<AmbulancePage />} />
        <Route path="/doctor" element={<DoctorView />} />
      </Routes>
    </Router>
  );
}

export default App;