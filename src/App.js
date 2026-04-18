import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Help from './pages/Help';
import Login from './auth/Login';
import Register from './auth/Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] =
    useState('checking');

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(() => setBackendStatus('connected'))
      .catch(() =>
        setBackendStatus('disconnected'));
  }, []);

  return (
    <Router>

      {/* Backend Status Bar */}
      {backendStatus === 'disconnected' && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          ⚠️ Backend not running.
          Start: uvicorn main:app --reload
        </div>
      )}

      {backendStatus === 'connected' && (
        <div style={{
          background: '#d1fae5',
          color: '#065f46',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          ✅ Backend connected successfully
        </div>
      )}

      <div className="App">
        <Routes>

          {/* Public routes */}
          <Route path="/"
            element={<Landing />} />
          <Route path="/login"
            element={<Login />} />
          <Route path="/register"
            element={<Register />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } />

        </Routes>
      </div>

    </Router>
  );
}

export default App;