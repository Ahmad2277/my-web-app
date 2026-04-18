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

// ─────────────────────────────────────────
// Production Backend URL
// ─────────────────────────────────────────
const BACKEND_URL =
  'https://my-backend-ivrg.onrender.com';

function App() {
  const [backendStatus, setBackendStatus] =
    useState('checking');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/`,
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await res.json();
      if (data.message) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (e) {
      setBackendStatus('disconnected');
    }
  };

  return (
    <Router>

      {/* Backend Status Bar */}
      {backendStatus === 'disconnected' && (
        <div style={{
          background: '#1a0a0a',
          color: '#f87171',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '500',
          borderBottom:
            '1px solid rgba(239,68,68,0.3)'
        }}>
          ⚠️ Backend is starting up...
          Please wait a moment and refresh.
        </div>
      )}

      {backendStatus === 'connected' && (
        <div style={{
          background: 'rgba(212,175,55,0.05)',
          color: '#D4AF37',
          padding: '0.4rem 1rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: '500',
          borderBottom:
            '1px solid rgba(212,175,55,0.15)'
        }}>
          ✅ RenoVision AI is ready
        </div>
      )}

      <div className="App">
        <Routes>

          {/* Public routes */}
          <Route
            path="/"
            element={<Landing />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;