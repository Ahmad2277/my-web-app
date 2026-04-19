import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Upload.css';

// ─────────────────────────────────────────
// Your Hugging Face backend URL
// ─────────────────────────────────────────
const BACKEND_URL = 'https://ahmad3351-renovision.hf.space';

// ─────────────────────────────────────────
// Wake up HF backend and poll until ready
// ─────────────────────────────────────────
async function wakeBackend(onStatus) {
  const WAKE_TIMEOUT_MS = 90000;
  const WAKE_POLL_MS = 4000;
  const start = Date.now();

  while (Date.now() - start < WAKE_TIMEOUT_MS) {
    const elapsed = Math.round((Date.now() - start) / 1000);
    onStatus(`⏳ Waking up backend... ${elapsed}s (free tier, please wait)`);

    try {
      const res = await fetch(`${BACKEND_URL}/wake`, {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ready === true) return true;
        // Server up but model still loading — keep polling
      }
    } catch {
      // Still sleeping — keep polling
    }

    await new Promise(resolve => setTimeout(resolve, WAKE_POLL_MS));
  }

  return false; // timed out
}

function Upload() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [budget, setBudget] = useState(50000);
  const [customBudget, setCustomBudget] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [style, setStyle] = useState('modern');
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState('');

  const actualBudget = useCustom ? (parseInt(customBudget) || 0) : budget;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG images are allowed');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG images are allowed');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload a room image first');
      return;
    }
    if (actualBudget < 5000) {
      setError('Minimum budget is Rs. 5,000');
      return;
    }

    const userStr = localStorage.getItem('renovisionUser');
    if (!userStr) {
      setError('You are not logged in. Please login again.');
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      setError('Session error. Please login again.');
      return;
    }

    if (!user.token) {
      setError('Session expired. Please login again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ── STEP 1: Check if backend is already awake ──
      setLoadingStep('🔌 Connecting to backend...');
      let isReady = false;

      try {
        const healthRes = await fetch(`${BACKEND_URL}/health`, {
          signal: AbortSignal.timeout(8000),
        });
        if (healthRes.ok) {
          const health = await healthRes.json();
          isReady = health.ready === true;
        }
      } catch {
        isReady = false;
      }

      // ── STEP 2: If not ready, wake it up ──
      if (!isReady) {
        const woke = await wakeBackend((msg) => setLoadingStep(msg));
        if (!woke) {
          setError('⏳ Backend took too long to wake up. Please wait 30 seconds and try again.');
          setLoading(false);
          setLoadingStep('');
          return;
        }
      }

      // ── STEP 3: Run analysis ──
      setLoadingStep('🔍 Detecting objects with Best.pt...');

      const t1 = setTimeout(() => setLoadingStep('🤖 Generating AI recommendations...'), 5000);
      const t2 = setTimeout(() => setLoadingStep('🎨 Creating design with DALL-E 3 HD...'), 12000);

      const formData = new FormData();
      formData.append('file', image);
      formData.append('budget', String(actualBudget));
      formData.append('style', style);
      formData.append('token', user.token);
      formData.append('user_prompt', userPrompt || '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      let response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(t1);
      clearTimeout(t2);

      let data = await response.json();

      // ── STEP 4: If 503 warming_up, wait 15s and retry once ──
      if (response.status === 503 && data.error === 'warming_up') {
        setLoadingStep('⏳ Model still loading, retrying in 15s...');
        await new Promise(r => setTimeout(r, 15000));

        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 180000);

        response = await fetch(`${BACKEND_URL}/analyze`, {
          method: 'POST',
          body: formData,
          signal: retryController.signal,
        });

        clearTimeout(retryTimeout);
        data = await response.json();
      }

      // ── Handle outdoor scene ──
      if (data.error === 'outdoor_scene' || data.is_outdoor === true) {
        setError(
          '🚫 Outdoor Image Detected: ' +
          (data.message || 'This app only works with indoor room photos. Please upload a photo taken inside a room.')
        );
        setLoading(false);
        setLoadingStep('');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      localStorage.setItem('renovisionResults', JSON.stringify(data));
      localStorage.setItem('renovisionImage', preview);
      navigate('/results');

    } catch (err) {
      console.error('Error:', err);

      if (err.name === 'AbortError') {
        setError('⏱️ Request timed out. The backend may be busy. Please try again.');
      } else if (err.message?.includes('outdoor')) {
        setError('🚫 Please upload an indoor room photo only.');
      } else if (err.message?.includes('401')) {
        setError('Session expired. Please logout and login again.');
      } else if (
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('fetch')
      ) {
        setError('🔌 Cannot reach backend. Please check your internet and try again.');
      } else {
        setError('Something went wrong: ' + err.message);
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const designStyles = [
    { id: 'modern', label: 'Modern', icon: '🏙️' },
    { id: 'classic', label: 'Classic', icon: '🏛️' },
    { id: 'minimalist', label: 'Minimalist', icon: '⬜' },
    { id: 'natural', label: 'Natural', icon: '🌿' }
  ];

  return (
    <div className="upload-page">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/home" className="navbar-brand">
          Reno<span>Vision</span>
        </Link>
        <div className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/help" className="nav-link">Help</Link>
        </div>
      </nav>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
            <h3>Analyzing Your Room...</h3>
            <p style={{
              color: '#D4AF37',
              fontWeight: '600',
              marginTop: '0.5rem',
              fontSize: '0.9rem'
            }}>
              {loadingStep}
            </p>
            <p style={{
              color: '#555555',
              fontSize: '0.8rem',
              marginTop: '0.75rem'
            }}>
              This may take 30–90 seconds
            </p>
          </div>
        </div>
      )}

      <div className="page-container">
        <h1 className="upload-title">Plan Your Renovation</h1>
        <p className="upload-subtitle">
          Upload an indoor room photo and set your preferences
        </p>

        {/* Outdoor Warning Banner */}
        <div style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: '#888888',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>
            <strong style={{ color: '#D4AF37' }}>Indoor photos only.</strong>{' '}
            Outdoor images will be rejected. Take photos inside your room.
          </span>
        </div>

        <div className="upload-grid">

          {/* Left — Image Upload */}
          <div className="card">
            <h2 className="section-title">📸 Upload Room Photo</h2>

            <div
              className={`drop-zone ${preview ? 'has-image' : ''}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {preview ? (
                <img src={preview} alt="Room preview" className="preview-image" />
              ) : (
                <div className="drop-placeholder">
                  <div className="drop-icon">🏠</div>
                  <p>Drag and drop your room photo here</p>
                  <p className="drop-hint">or click to browse</p>
                  <p className="drop-format">JPEG or PNG • Indoor only</p>
                </div>
              )}
            </div>

            <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {preview && (
              <button
                className="btn btn-secondary"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => { setImage(null); setPreview(null); setError(''); }}
              >
                Remove Image
              </button>
            )}

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginTop: '1rem',
                fontSize: '0.9rem',
                border: '1px solid rgba(239,68,68,0.3)',
                lineHeight: '1.6'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Right — Preferences */}
          <div className="card">
            <h2 className="section-title">⚙️ Your Preferences</h2>

            {/* Budget Section */}
            <div className="form-group">
              <label className="form-label">
                💰 Budget{' '}
                <span style={{ color: '#D4AF37', fontWeight: '800', fontSize: '1rem' }}>
                  Rs. {actualBudget.toLocaleString()}
                </span>
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button
                  onClick={() => setUseCustom(false)}
                  style={{
                    flex: 1, padding: '0.4rem', borderRadius: '6px',
                    border: '1px solid rgba(212,175,55,0.3)',
                    background: !useCustom ? '#D4AF37' : '#222222',
                    color: !useCustom ? '#0A0A0A' : '#888888',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                  }}
                >Slider</button>
                <button
                  onClick={() => setUseCustom(true)}
                  style={{
                    flex: 1, padding: '0.4rem', borderRadius: '6px',
                    border: '1px solid rgba(212,175,55,0.3)',
                    background: useCustom ? '#D4AF37' : '#222222',
                    color: useCustom ? '#0A0A0A' : '#888888',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                  }}
                >Custom Amount</button>
              </div>

              {!useCustom ? (
                <>
                  <input
                    type="range" min="5000" max="10000000" step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="budget-slider"
                    style={{ width: '100%' }}
                  />
                  <div className="slider-labels">
                    <span>Rs. 5,000</span>
                    <span>Rs. 1 Crore</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                    {[
                      { l: '10K', v: 10000 }, { l: '25K', v: 25000 },
                      { l: '50K', v: 50000 }, { l: '1L', v: 100000 },
                      { l: '5L', v: 500000 }, { l: '10L', v: 1000000 },
                      { l: '50L', v: 5000000 }, { l: '1Cr', v: 10000000 }
                    ].map((b) => (
                      <button
                        key={b.v}
                        onClick={() => { setBudget(b.v); setUseCustom(false); }}
                        style={{
                          padding: '0.3rem 0.7rem', borderRadius: '20px',
                          border: '1px solid rgba(212,175,55,0.3)',
                          background: budget === b.v && !useCustom ? '#D4AF37' : '#222222',
                          color: budget === b.v && !useCustom ? '#0A0A0A' : '#888888',
                          cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600'
                        }}
                      >
                        Rs. {b.l}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '1.1rem' }}>Rs.</span>
                    <input
                      type="number" min="5000" value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder="Enter amount"
                      style={{
                        flex: 1, padding: '0.75rem', background: '#222222',
                        border: '1.5px solid rgba(212,175,55,0.3)',
                        borderRadius: '8px', color: '#F5F5F0',
                        fontSize: '1rem', outline: 'none'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#555555', marginTop: '0.4rem' }}>
                    Minimum Rs. 5,000
                  </p>
                </div>
              )}
            </div>

            {/* Style Selection */}
            <div className="form-group">
              <label className="form-label">🎨 Design Style</label>
              <div className="style-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {designStyles.map((s) => (
                  <button
                    key={s.id}
                    className={`style-btn ${style === s.id ? 'active' : ''}`}
                    onClick={() => setStyle(s.id)}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="form-group">
              <label className="form-label">
                ✍️ Custom Request{' '}
                <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: '400' }}>
                  Optional
                </span>
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe what you want... e.g. 'I want a cozy bedroom with warm lighting, wooden furniture and plants near the window'"
                maxLength={300}
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: '#222222',
                  border: '1.5px solid rgba(212,175,55,0.2)', borderRadius: '8px',
                  color: '#F5F5F0', fontSize: '0.9rem', resize: 'vertical',
                  minHeight: '90px', fontFamily: 'inherit', lineHeight: '1.6', outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#555555', marginTop: '4px' }}>
                {userPrompt.length}/300
              </div>
            </div>

            {/* Summary */}
            <div className="budget-summary">
              <div className="budget-item">
                <span>Budget</span>
                <strong>Rs. {actualBudget.toLocaleString()}</strong>
              </div>
              <div className="budget-item">
                <span>Style</span>
                <strong>{designStyles.find(s => s.id === style)?.label || style}</strong>
              </div>
              {userPrompt && (
                <div className="budget-item">
                  <span>Custom Request</span>
                  <strong style={{ color: '#D4AF37', fontSize: '0.8rem' }}>✅ Added</strong>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
              onClick={handleSubmit}
              disabled={loading || !image}
            >
              {loading ? 'Analyzing...' : '🚀 Analyze My Room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
