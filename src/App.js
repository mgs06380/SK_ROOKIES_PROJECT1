import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Schedule from './pages/Schedule';
import Calendar from './pages/Calendar';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<PrivateRoute element={<Main />} />} />
        <Route path="/schedule" element={<PrivateRoute element={<Schedule />} />} />
        <Route path="/calendar" element={<PrivateRoute element={<Calendar />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;