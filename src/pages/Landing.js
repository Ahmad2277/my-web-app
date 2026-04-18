import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

export default function Landing() {
  const [scrolled, setScrolled] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem(
      'renovisionUser'
    );
    if (user) navigate('/home');
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener(
      'scroll', handleScroll
    );
    return () =>
      window.removeEventListener(
        'scroll', handleScroll
      );
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className={`landing-nav ${
        scrolled ? 'scrolled' : ''
      }`}>
        <span className="landing-logo">
          Reno<span>Vision</span>
        </span>
        <div className="landing-nav-links">
          <button
            className="landing-nav-link"
            onClick={() => scrollTo('features')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Features
          </button>
          <button
            className="landing-nav-link"
            onClick={() =>
              scrollTo('how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            How It Works
          </button>
          <Link
            to="/login"
            className="landing-nav-link">
            Sign In
          </Link>
          <Link
            to="/login"
            className="landing-nav-btn">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" />

        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <div className="hero-badge">
            ✦ AI-Powered Interior Design
          </div>

          <h1 className="hero-title">
            Transform Your Space<br />
            <span className="hero-title-gold">
              With Intelligence
            </span>
          </h1>

          <p className="hero-subtitle">
            RenoVision uses cutting-edge
            Computer Vision, Explainable AI
            and Generative AI to revolutionize
            how you plan interior renovations.
            Smart, transparent and beautiful.
          </p>

          <div className="hero-buttons">
            <Link
              to="/login"
              className="btn-gold">
              Start Planning Free →
            </Link>
            <button
              className="btn-outline-gold"
              onClick={() =>
                scrollTo('how-it-works')}
              style={{
                border: 'none',
                cursor: 'pointer'
              }}
            >
              See How It Works
            </button>
          </div>

          <div className="hero-stats">
            {[
              { number: '3',
                label: 'AI Models' },
              { number: '10+',
                label: 'Room Types' },
              { number: '4',
                label: 'Design Styles' },
              { number: '100%',
                label: 'Explainable' }
            ].map((stat, i) => (
              <div key={i}
                className="hero-stat">
                <div
                  className="hero-stat-number">
                  {stat.number}
                </div>
                <div
                  className="hero-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="features-section"
        id="features">
        <div className="section" style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <span className="section-badge">
              ✦ Core Features
            </span>
            <h2 className="section-title">
              Everything You Need to{' '}
              <span style={{
                color: 'var(--gold)'
              }}>
                Renovate Smartly
              </span>
            </h2>
            <p className="section-subtitle"
              style={{ margin: '0 auto' }}>
              Powered by three AI models
              working together to give you
              the best renovation experience
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: '👁️',
                title: 'Computer Vision Analysis',
                desc: 'Best.pt model detects your furniture, room type, layout and dominant colors with highest accuracy.'
              },
              {
                icon: '💡',
                title: 'Explainable AI (XAI)',
                desc: 'Every recommendation comes with a clear explanation of why it was suggested — no black box decisions.'
              },
              {
                icon: '🎨',
                title: 'Generative AI Design',
                desc: 'DALL-E 3 HD creates beautiful visual previews keeping your existing furniture while adding new elements.'
              },
              {
                icon: '💰',
                title: 'Budget Aware Planning',
                desc: 'Unlimited budget options from Rs. 5,000 to Rs. 1 Crore with accurate cost estimates.'
              },
              {
                icon: '🏠',
                title: 'Indoor Room Support',
                desc: 'Bedroom, living room, kitchen, bathroom, dining room, study — all indoor room types supported.'
              },
              {
                icon: '📱',
                title: 'Web & Mobile App',
                desc: 'Available on web browser and Android mobile app with custom renovation prompts.'
              }
            ].map((feature, i) => (
              <div key={i}
                className="feature-card">
                <div
                  className="feature-icon-box">
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-desc">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="hiw-section"
        style={{ background: 'var(--black)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <span className="section-badge">
              ✦ Simple Process
            </span>
            <h2 className="section-title">
              How{' '}
              <span style={{
                color: 'var(--gold)'
              }}>
                RenoVision
              </span>{' '}
              Works
            </h2>
            <p className="section-subtitle"
              style={{ margin: '0 auto' }}>
              From photo to renovation plan
              in 4 simple steps
            </p>
          </div>

          <div className="hiw-steps">
            {[
              {
                icon: '📸',
                title: 'Upload Indoor Photo',
                desc: 'Take or upload a clear photo of the room you want to renovate'
              },
              {
                icon: '⚙️',
                title: 'Set Preferences',
                desc: 'Choose your budget, design style and add custom renovation request'
              },
              {
                icon: '🤖',
                title: 'AI Analysis',
                desc: 'Best.pt detects objects, XAI generates smart recommendations'
              },
              {
                icon: '✨',
                title: 'View Results',
                desc: 'Get recommendations with explanations and DALL-E 3 HD design preview'
              }
            ].map((step, i) => (
              <div key={i}
                className="hiw-step">
                <div
                  className="hiw-step-number">
                  {step.icon}
                </div>
                <h3 className="hiw-step-title">
                  {step.title}
                </h3>
                <p className="hiw-step-desc">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section style={{
        background: 'var(--black-2)',
        borderTop:
          '1px solid rgba(212,175,55,0.08)',
        borderBottom:
          '1px solid rgba(212,175,55,0.08)',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--gray-light)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}>
            Built With Industry Leading
            Technologies
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            {[
              'Python', 'FastAPI',
              'Best.pt', 'React.js',
              'React Native', 'DALL-E 3 HD',
              'SQLite', 'PyTorch',
              'OpenCV', 'Expo', 'Firebase'
            ].map((tech, i) => (
              <div key={i} style={{
                background:
                  'rgba(212,175,55,0.05)',
                border:
                  '1px solid rgba(212,175,55,0.15)',
                color: 'var(--white-soft)',
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '500'
              }}>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — Change 10 */}
      <footer className="landing-footer">
        <div className="footer-logo">
          Reno<span>Vision</span>
        </div>
        <p className="footer-text">
          RenoVision — Final Year Project |
          Lahore Garrison University |
          BSCS 2026
        </p>
        <p className="footer-text">
          Made by{' '}
          <span className="footer-gold">
            Ahmad Raza
          </span>
          {' '}&{' '}
          <span className="footer-gold">
            Tabeel John
          </span>
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--gray-mid)',
          marginTop: '0.5rem'
        }}>
          Supervised by Ms. Fatima Aslam
        </p>
      </footer>

    </div>
  );
}