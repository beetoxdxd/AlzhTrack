import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Home from './Home';
import Login from './cuidadores/login';
import Dashboard from './Dashboard';
import Register from './cuidadores/registro';
import Acerca from './infoExtra/acerca';
import AuthSlider from './cuidadores/Auth';
import Xd from './cuidadores/xd'; // Importing the xd component, if needed

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cuidadores/login" element={<Login />} />
          <Route path="/cuidadores/registro" element={<Register />} />
          <Route path="/infoExtra/acerca" element={<Acerca />} />
          <Route path="/auth" element={<AuthSlider />} />
          <Route path="/xd" element={<Xd />} />
          {/* Protected route for the dashboard */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
