// login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { signInWithGoogle } from '../firebase';

const BACKEND_URL = 'https://ahmad3351-renovision.hf.space';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);

      console.log('Login response:', data); // debug

      if (data.success) {
        // ── FIXED: safe fallbacks so name is never undefined ──
        const userName =
          data.user?.name ||
          data.name ||
          email.split('@')[0] ||  // fallback to email prefix
          'User';

        const userEmail =
          data.user?.email ||
          data.email ||
          email;

        const token =
          data.token ||
          data.access_token ||
          '';

        localStorage.setItem(
          'renovisionUser',
          JSON.stringify({
            name: userName,
            email: userEmail,
            token: token,
            loginMethod: 'email'
          })
        );
        navigate('/home');
      } else {
        // ── FIXED: properly show backend error message ──
        setError(
          data.error ||
          data.message ||
          data.detail ||
          'Login failed. Please check your credentials.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        const formData = new FormData();
        formData.append('name', result.user.name);
        formData.append('email', result.user.email);
        formData.append('google_uid', result.user.uid);

        const response = await fetch(
          `${BACKEND_URL}/auth/google`,
          { method: 'POST', body: formData }
        );
        const data = await response.json();

        console.log('Google login response:', data); // debug

        if (data.success) {
          const userName =
            data.user?.name ||
            result.user.name ||
            result.user.email?.split('@')[0] ||
            'User';

          localStorage.setItem(
            'renovisionUser',
            JSON.stringify({
              name: userName,
              email: data.user?.email || result.user.email,
              token: data.token || '',
              photo: result.user.photo || '',
              loginMethod: 'google'
            })
          );
          navigate('/home');
        } else {
          setError(data.error || 'Google login failed');
        }
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid rgba(212,175,55,0.2)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#222222',
    color: '#F5F5F0',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#F5F5F0',
            letterSpacing: '-1px',
            margin: 0
          }}>
            Reno<span style={{ color: '#D4AF37' }}>Vision</span>
          </h1>
          <p style={{ color: '#888888', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            AI-Based Smart Interior Planner
          </p>
        </div>

        <div style={{
          background: '#1A1A1A',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(212,175,55,0.2)'
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#F5F5F0',
            marginBottom: '1.5rem',
            textAlign: 'center',
            letterSpacing: '-0.3px'
          }}>
            Sign In
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: '#222222',
              color: '#F5F5F0',
              border: '1.5px solid rgba(212,175,55,0.3)',
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#D4AF37' }}>G</span>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.15)' }} />
            <span style={{ fontSize: '0.8rem', color: '#555555' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.15)' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#F5F5F0' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#F5F5F0' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: loading
                  ? 'rgba(212,175,55,0.4)'
                  : 'linear-gradient(135deg, #F5D76E, #D4AF37, #B8960C)',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#888888', margin: '1.25rem 0 0.75rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#D4AF37', fontWeight: '700', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>

          <p style={{ textAlign: 'center', margin: 0 }}>
            <Link to="/" style={{ color: '#555555', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#555555', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          RenoVision — Final Year Project | Lahore Garrison University | BSCS 2024
        </p>
        <p style={{ textAlign: 'center', color: '#D4AF37', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '600' }}>
          Build by Ahmad Raza & Tabeel John
        </p>
      </div>
    </div>
  );
}

export default Login;
