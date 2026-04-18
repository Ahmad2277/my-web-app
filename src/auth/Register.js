import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { signInWithGoogle } from '../firebase';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  // ── Regular Register ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email ||
        !password || !confirm) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters'
      );
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(
        name, email, password
      );

      if (data.success) {
        localStorage.setItem(
          'renovisionUser',
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            token: data.token,
            loginMethod: 'email'
          })
        );
        setSuccess(
          'Account created! Redirecting...'
        );
        setTimeout(() => navigate('/home'), 1500);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google Register ──
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        const formData = new FormData();
        formData.append('name', result.user.name);
        formData.append('email',
          result.user.email);
        formData.append('google_uid',
          result.user.uid);

        const response = await fetch(
          'http://localhost:8000/auth/google',
          {
            method: 'POST',
            body: formData
          }
        );
        const data = await response.json();

        if (data.success) {
          localStorage.setItem(
            'renovisionUser',
            JSON.stringify({
              name: data.user.name,
              email: data.user.email,
              token: data.token,
              photo: result.user.photo,
              loginMethod: 'google'
            })
          );
          navigate('/home');
        } else {
          setError(
            data.error || 'Google login failed'
          );
        }
      } else {
        setError(
          result.error || 'Google login failed'
        );
      }
    } catch (err) {
      setError('Google login failed.');
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
    color: '#F5F5F0'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#F5F5F0'
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
      <div style={{
        width: '100%',
        maxWidth: '420px'
      }}>

        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#F5F5F0',
            letterSpacing: '-1px'
          }}>
            Reno
            <span style={{ color: '#D4AF37' }}>
              Vision
            </span>
          </h1>
          <p style={{
            color: '#888888',
            marginTop: '0.5rem',
            fontSize: '0.9rem'
          }}>
            Create your free account
          </p>
        </div>

        {/* Card */}
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
            textAlign: 'center'
          }}>
            Register
          </h2>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border:
                '1px solid rgba(239,68,68,0.3)'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background:
                'rgba(212,175,55,0.1)',
              color: '#D4AF37',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border:
                '1px solid rgba(212,175,55,0.3)'
            }}>
              ✅ {success}
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
              border:
                '1.5px solid rgba(212,175,55,0.3)',
              borderRadius: '50px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '900',
              color: '#D4AF37'
            }}>
              G
            </span>
            {googleLoading
              ? 'Connecting...'
              : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              flex: 1, height: '1px',
              background:
                'rgba(212,175,55,0.15)'
            }}></div>
            <span style={{
              fontSize: '0.8rem',
              color: '#555555'
            }}>
              or register with email
            </span>
            <div style={{
              flex: 1, height: '1px',
              background:
                'rgba(212,175,55,0.15)'
            }}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>

            <div style={{
              marginBottom: '1rem'
            }}>
              <label style={labelStyle}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)}
                placeholder="Ahmad Raza"
                style={inputStyle}
                onFocus={(e) =>
                  e.target.style.borderColor =
                    '#D4AF37'}
                onBlur={(e) =>
                  e.target.style.borderColor =
                    'rgba(212,175,55,0.2)'}
              />
            </div>

            <div style={{
              marginBottom: '1rem'
            }}>
              <label style={labelStyle}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) =>
                  e.target.style.borderColor =
                    '#D4AF37'}
                onBlur={(e) =>
                  e.target.style.borderColor =
                    'rgba(212,175,55,0.2)'}
              />
            </div>

            <div style={{
              marginBottom: '1rem'
            }}>
              <label style={labelStyle}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                style={inputStyle}
                onFocus={(e) =>
                  e.target.style.borderColor =
                    '#D4AF37'}
                onBlur={(e) =>
                  e.target.style.borderColor =
                    'rgba(212,175,55,0.2)'}
              />
            </div>

            <div style={{
              marginBottom: '1.5rem'
            }}>
              <label style={labelStyle}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) =>
                  setConfirm(e.target.value)}
                placeholder="Repeat your password"
                style={inputStyle}
                onFocus={(e) =>
                  e.target.style.borderColor =
                    '#D4AF37'}
                onBlur={(e) =>
                  e.target.style.borderColor =
                    'rgba(212,175,55,0.2)'}
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
                cursor: loading
                  ? 'not-allowed' : 'pointer'
              }}
            >
              {loading
                ? '⏳ Creating account...'
                : 'Create Account'}
            </button>

          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            fontSize: '0.9rem',
            color: '#888888'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#D4AF37',
              fontWeight: '700',
              textDecoration: 'none'
            }}>
              Sign in here
            </Link>
          </p>

          <p style={{
            textAlign: 'center',
            marginTop: '0.75rem'
          }}>
            <Link to="/" style={{
              color: '#555555',
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}>
              ← Back to Home
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;