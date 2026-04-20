import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    // This checks if user has seen disclaimer before
  const [showDisclaimer, setShowDisclaimer] = React.useState(
    !localStorage.getItem('disclaimerAccepted')
  );

  // This runs when user clicks the button
  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };
  return (
    <div className="home">
        {/* ── Disclaimer Popup ── */}
      {showDisclaimer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}>

            {/* Warning Icon */}
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              ⚠️
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Important Disclaimer
            </h2>

            {/* Message */}
            <p style={{
              color: '#64748b',
              lineHeight: '1.8',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              RenoVision is an AI-powered <strong>decision support tool</strong> designed
              to assist with interior renovation planning only.
              <br /><br />
              All recommendations are <strong>advisory</strong> and should
              NOT be treated as professional interior design advice.
              <br /><br />
              Always consult a <strong>qualified interior designer or
              contractor</strong> before making actual renovation decisions,
              especially for structural changes involving walls,
              plumbing or electrical systems.
              <br /><br />
              Estimated costs are <strong>approximate</strong> and may
              vary based on your location and market conditions.
            </p>

            {/* Accept Button */}
            <button
              onClick={acceptDisclaimer}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              I Understand — Continue to RenoVision
            </button>

            {/* Small note */}
            <p style={{
              marginTop: '0.75rem',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              This message will not appear again after you accept
            </p>

          </div>
        </div>
      )}
      {/* Navbar */}
<nav className="navbar">
  <Link to="/home" className="navbar-brand">
  Reno<span>Vision</span>
  </Link>

  <div className="nav-links">
    <Link to="/help" className="nav-link">
      Help
    </Link>

    {localStorage.getItem('renovisionUser') ? (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{
          fontSize: '0.9rem',
          color: '#64748b',
          fontWeight: '500'
        }}>
          👤 {JSON.parse(
            localStorage.getItem('renovisionUser')
          ).name}
        </span>
        <button
          onClick={() => {
            localStorage.removeItem('renovisionUser');
            window.location.reload();
          }}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.85rem',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          Sign Out
        </button>
      </div>
    ) : (
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <Link to="/login"
          className="btn btn-secondary"
          style={{
            fontSize: '0.9rem',
            padding: '0.5rem 1rem'
          }}>
          Sign In
        </Link>
        <Link to="/register"
          className="btn btn-accent"
          style={{
            fontSize: '0.9rem',
            padding: '0.5rem 1rem'
          }}>
          Register
        </Link>
      </div>
    )}
  </div>
</nav>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Interior
            <span className="highlight"> Renovation Planner</span>
          </h1>
          <p className="hero-subtitle">
            Upload a photo of your room and get instant AI-powered
            renovation recommendations with visual design previews.
            Powered by Computer Vision and Explainable AI.
          </p>
          <div className="hero-buttons">
            <Link to="/upload" className="btn btn-primary">
              Start Planning Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2 className="features-title">How RenoVision Works</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Upload Room Photo</h3>
            <p>Simply upload a photo of any room in your home. Our AI will analyze it instantly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>AI Room Analysis</h3>
            <p>Computer Vision detects your furniture, room type, colors and layout automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Smart Recommendations</h3>
            <p>Get personalized renovation suggestions based on your budget and style preferences.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Visual Design Preview</h3>
            <p>See an AI-generated preview of how your renovated room will look before spending anything.</p>
          </div>

        </div>
      </div>

      <footer className="footer">
  <p>
    RenoVision — Final Year Project |
    Lahore Garrison University | BSCS 2026
    <br />
    <span style={{ color: '#D4AF37' }}>
      Build by Ahmad Raza & Tabeel John
    </span>
  </p>
</footer>

    </div>
  );
}


export default Home;