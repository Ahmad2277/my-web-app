import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

const faqs = [
  {
    question: "What types of room photos can I upload?",
    answer: "You can upload any indoor room photo in JPEG or PNG format. The system works best with clear, well-lit photos of bedrooms, living rooms, kitchens, dining rooms, bathrooms, and study rooms. Make sure the photo shows the room clearly without too much blur."
  },
  {
    question: "How does the AI detect furniture?",
    answer: "RenoVision uses YOLOv8, a state-of-the-art Computer Vision model, to detect furniture items in your room photo. It identifies items like beds, sofas, chairs, TVs, refrigerators, and more with confidence scores. The higher the confidence score, the more certain the AI is about the detection."
  },
  {
    question: "How are renovation recommendations generated?",
    answer: "The Explainable AI (XAI) module analyzes your detected furniture, room type, budget and style preferences. It then applies a rule-based reasoning engine to generate personalized recommendations. Each recommendation includes a clear explanation of WHY it was suggested."
  },
  {
    question: "What does the budget slider control?",
    answer: "The budget slider sets your maximum renovation budget in Pakistani Rupees (Rs.). The system will only suggest renovations that fit within your budget. Higher budgets unlock more renovation options like false ceilings, modular kitchens, and premium furniture."
  },
  {
    question: "What are the different design styles?",
    answer: "Modern: Clean lines, neutral colors, contemporary furniture. Classic: Warm tones, traditional furniture, elegant details. Minimalist: Simple, uncluttered, monochrome palette. Natural: Plants, wood textures, earthy tones. Industrial: Exposed brick, metal accents, raw textures."
  },
  {
    question: "How is the AI design image generated?",
    answer: "The GenAI module uses Stable Diffusion, an advanced AI image generation model, to create a visual preview of your renovated room based on your room type, style preference, budget tier and top recommendations. This gives you a visual idea of how your room could look after renovation."
  },
  {
    question: "Is my uploaded photo stored anywhere?",
    answer: "No. Your uploaded room photo is processed immediately by the AI and then permanently deleted from the server. We do not store, share or use your photos for any other purpose. Your privacy is completely protected."
  },
  {
    question: "Why did the system not detect any furniture?",
    answer: "This can happen if: (1) The photo is too dark or blurry. (2) The room is very empty. (3) The furniture is very unusual or not in a standard style. Try uploading a clearer, brighter photo with more visible furniture items."
  },
  {
    question: "Are the renovation recommendations guaranteed?",
    answer: "No. RenoVision is a decision support tool — all recommendations are advisory only. Always consult a qualified interior designer or contractor before making any actual renovation decisions, especially for structural changes like walls, plumbing or electrical systems."
  },
  {
    question: "How long does the analysis take?",
    answer: "Typically 20 to 60 seconds depending on your internet speed and server load. The Computer Vision analysis takes about 5-10 seconds. The AI image generation takes 20-50 seconds as it runs on cloud servers."
  }
];

function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="help-page">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Reno<span>Vision</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/upload" className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Start Planning
          </Link>
        </div>
      </nav>

      <div className="page-container">

        {/* Header */}
        <div className="help-header">
          <h1>Help Center</h1>
          <p>Everything you need to know about using RenoVision</p>
        </div>

        {/* How it works */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">🚀 How RenoVision Works</h2>
          <div className="steps-grid">

            <div className="help-step">
              <div className="help-step-number">1</div>
              <div className="help-step-icon">📸</div>
              <h3>Upload Photo</h3>
              <p>Take or select a clear photo of the room you want to renovate. JPEG and PNG formats are supported.</p>
            </div>

            <div className="help-step">
              <div className="help-step-number">2</div>
              <div className="help-step-icon">⚙️</div>
              <h3>Set Preferences</h3>
              <p>Set your renovation budget using the slider and select your preferred interior design style.</p>
            </div>

            <div className="help-step">
              <div className="help-step-number">3</div>
              <div className="help-step-icon">👁️</div>
              <h3>AI Analyzes Room</h3>
              <p>Our Computer Vision AI scans your photo and detects room type, furniture items, colors and layout.</p>
            </div>

            <div className="help-step">
              <div className="help-step-number">4</div>
              <div className="help-step-icon">💡</div>
              <h3>Get Recommendations</h3>
              <p>The Explainable AI generates personalized renovation suggestions with clear reasons for each.</p>
            </div>

            <div className="help-step">
              <div className="help-step-number">5</div>
              <div className="help-step-icon">🎨</div>
              <h3>View Design Preview</h3>
              <p>See an AI-generated visual of how your renovated room could look with your chosen style.</p>
            </div>

            <div className="help-step">
              <div className="help-step-number">6</div>
              <div className="help-step-icon">🔄</div>
              <h3>Refine & Repeat</h3>
              <p>Change your budget or style and re-analyze to explore different renovation possibilities.</p>
            </div>

          </div>
        </div>

        {/* Tips */}
        <div className="tips-box">
          <h2>💡 Tips for Best Results</h2>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-icon">☀️</span>
              <div>
                <strong>Good Lighting</strong>
                <p>Take photos in daylight or with lights on for better furniture detection</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📐</span>
              <div>
                <strong>Wide Angle</strong>
                <p>Try to capture as much of the room as possible in one photo</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <div>
                <strong>Clear Focus</strong>
                <p>Make sure the photo is not blurry — steady your hand or use a surface</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-icon">💰</span>
              <div>
                <strong>Realistic Budget</strong>
                <p>Set a budget that reflects what you can actually spend for better recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h2 className="faq-title">❓ Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-arrow">
                    {openFaq === index ? '▲' : '▼'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-box">
          <h3>⚠️ Important Disclaimer</h3>
          <p>
            RenoVision is an AI-powered decision support tool designed to assist
            with renovation planning. All recommendations are advisory only and
            should not be treated as professional interior design advice.
            Always consult qualified interior designers, architects, or
            contractors before making any actual renovation decisions,
            especially for structural changes involving walls, plumbing,
            or electrical systems. Estimated costs are approximate and
            may vary based on your location and market conditions.
          </p>
        </div>

        {/* Contact */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Still need help?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Contact the RenoVision development team
          </p>
          <div className="contact-info">
            <span>📧 fa22-bscs-189@lgu.edu.pk</span>
            <span>📧 fa22-bscs-209@lgu.edu.pk</span>
            <span>🏫 Lahore Garrison University</span>
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

export default Help;