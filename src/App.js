import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Home from './Home';
import Dashboard from './Dashboard';
import Acerca from './infoExtra/acerca';
import Authentication from './cuidadores/Authentication';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/infoExtra/acerca" element={<Acerca />} />
          <Route path="/auth" element={<Authentication />} />
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
