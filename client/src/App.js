import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AmbulancePage from './pages/AmbulancePage';
import DoctorView from './pages/DoctorView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ambulance" element={<AmbulancePage />} />
        <Route path="/doctor" element={<DoctorView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;