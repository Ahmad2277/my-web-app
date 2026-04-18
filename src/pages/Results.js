import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Results.css';

function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [originalImage, setOriginalImage] =
    useState(null);
  const [activeTab, setActiveTab] =
    useState('recommendations');

  useEffect(() => {
    const saved = localStorage.getItem(
      'renovisionResults'
    );
    const img = localStorage.getItem(
      'renovisionImage'
    );
    if (!saved) {
      navigate('/upload');
      return;
    }
    setResults(JSON.parse(saved));
    setOriginalImage(img);
  }, [navigate]);

  if (!results) return null;

  const {
    cv_analysis,
    xai_results,
    generated_design
  } = results;

  // Filter out prompt-based recommendation
  // from suggestions list
  const normalRecommendations =
    xai_results.recommendations.filter(
      rec => !rec.is_prompt_based
    );

  return (
    <div className="results-page">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/home"
          className="navbar-brand">
          Reno<span>Vision</span>
        </Link>
        <Link to="/upload"
          className="btn btn-secondary"
          style={{
            fontSize: '0.9rem',
            padding: '0.5rem 1rem'
          }}>
          Analyze Another Room
        </Link>
      </nav>

      <div className="page-container">

        {/* Header */}
        <div className="results-header">
          <h1>Your Renovation Plan</h1>
          <p style={{
            textTransform: 'capitalize'
          }}>
            AI analysis complete for your{' '}
            {cv_analysis.room_type}
          </p>
        </div>

        {/* User Prompt Display */}
        {results.user_prompt &&
         results.user_prompt.trim() && (
          <div style={{
            background:
              'rgba(212,175,55,0.05)',
            border:
              '1px solid rgba(212,175,55,0.3)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            borderLeft:
              '3px solid var(--gold)'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--gold)',
              fontWeight: '700',
              marginBottom: '0.4rem',
              letterSpacing: '0.5px'
            }}>
              ✍️ YOUR CUSTOM REQUEST
            </p>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--white-soft)',
              lineHeight: '1.6',
              fontStyle: 'italic',
              margin: 0
            }}>
              "{results.user_prompt}"
            </p>
          </div>
        )}

        {/* Room Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🏠</div>
            <div className="info-label">
              Room Type
            </div>
            <div className="info-value"
              style={{
                textTransform: 'capitalize'
              }}>
              {cv_analysis.room_type}
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🛋️</div>
            <div className="info-label">
              Items Detected
            </div>
            <div className="info-value">
              {cv_analysis.furniture_count} items
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <div className="info-label">
              Room Status
            </div>
            <div className="info-value"
              style={{
                textTransform: 'capitalize'
              }}>
              {cv_analysis.room_density}
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">💡</div>
            <div className="info-label">
              Suggestions
            </div>
            <div className="info-value">
              {normalRecommendations.length} found
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="summary-box">
          <h3>📋 AI Summary</h3>
          <p>{xai_results.summary.summary}</p>
          <div className="summary-stats">
            <span>
              Total Estimated Cost:
              <strong>
                {' '}Rs.{' '}
                {xai_results.summary
                  .total_estimated_cost
                  .toLocaleString()}
              </strong>
            </span>
            <span>
              Budget Status:
              <strong style={{
                color: xai_results.summary
                  .budget_sufficient
                  ? '#D4AF37' : '#f87171'
              }}>
                {xai_results.summary
                  .budget_sufficient
                  ? ' ✅ Sufficient'
                  : ' ⚠️ May Exceed'}
              </strong>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${
              activeTab === 'recommendations'
                ? 'active' : ''
            }`}
            onClick={() =>
              setActiveTab('recommendations')}
          >
            💡 Recommendations (
            {normalRecommendations.length})
          </button>
          <button
            className={`tab-btn ${
              activeTab === 'design'
                ? 'active' : ''
            }`}
            onClick={() =>
              setActiveTab('design')}
          >
            🎨 Design Preview
          </button>
          <button
            className={`tab-btn ${
              activeTab === 'analysis'
                ? 'active' : ''
            }`}
            onClick={() =>
              setActiveTab('analysis')}
          >
            👁️ CV Analysis
          </button>
        </div>

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="tab-content">
            {normalRecommendations.length === 0
              ? (
              <div className="card" style={{
                textAlign: 'center',
                padding: '3rem'
              }}>
                <div style={{
                  fontSize: '3rem'
                }}>
                  🎉
                </div>
                <h3 style={{
                  color: 'var(--white-soft)',
                  marginTop: '1rem'
                }}>
                  Your room looks great!
                </h3>
                <p style={{
                  color: 'var(--gray-light)',
                  marginTop: '0.5rem'
                }}>
                  No major renovations needed
                  within your budget.
                </p>
              </div>
            ) : (
              <div
                className="recommendations-list">
                {normalRecommendations.map(
                  (rec, index) => (
                  <div
                    key={rec.id || index}
                    className="rec-card"
                  >
                    <div className="rec-header">
                      <div
                        className="rec-number">
                        {index + 1}
                      </div>
                      <div className="rec-title">
                        {rec.recommendation}
                      </div>
                      <span className={`badge badge-${rec.priority.toLowerCase()}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="rec-reason">
                      <strong>Why:</strong>{' '}
                      {rec.reason}
                    </div>
                    <div className="rec-footer">
                      <span
                        className="rec-cost">
                        💰 Est. Cost: Rs.{' '}
                        {rec.estimated_cost
                          .toLocaleString()}
                      </span>
                      <span
                        className="rec-remaining">
                        Remaining: Rs.{' '}
                        {rec.budget_remaining_after
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Design Preview Tab */}
        {activeTab === 'design' && (
          <div className="tab-content">
            <div className="design-grid">
              <div className="card">
                <h3 className="design-label">
                  📷 Original Room
                </h3>
                {originalImage && (
                  <img
                    src={originalImage}
                    alt="Original room"
                    className="design-image"
                  />
                )}
              </div>
              <div className="card">
                <h3 className="design-label">
                  🎨 AI Renovated Design
                </h3>
                {generated_design.success ? (
                  <>
                    <img
                      src={`data:image/png;base64,${generated_design.image_base64}`}
                      alt="AI Generated Design"
                      className="design-image"
                      loading="lazy"
                    />
                    {results.user_prompt &&
                     results.user_prompt.trim() && (
                      <p style={{
                        marginTop: '0.75rem',
                        fontSize: '0.8rem',
                        color: 'var(--gold)',
                        fontStyle: 'italic'
                      }}>
                        ✍️ Generated based on
                        your custom request
                      </p>
                    )}
                  </>
                ) : (
                  <div
                    className="design-error">
                    <div style={{
                      fontSize: '2rem'
                    }}>
                      ⚠️
                    </div>
                    <p>
                      Image generation
                      unavailable
                    </p>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--gray-light)'
                    }}>
                      {generated_design.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CV Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="tab-content">
            <div className="analysis-grid">

              <div className="card">
                <h3 className="section-title">
                  🛋️ Detected Furniture
                </h3>
                {cv_analysis.detected_furniture
                  .length === 0 ? (
                  <p style={{
                    color: 'var(--gray-light)'
                  }}>
                    No furniture detected
                  </p>
                ) : (
                  <div
                    className="furniture-list">
                    {cv_analysis
                      .detected_furniture
                      .map((item, i) => (
                      <div
                        key={i}
                        className="furniture-item"
                      >
                        <span
                          className="furniture-name"
                          style={{
                            textTransform:
                              'capitalize'
                          }}>
                          {item.item}
                        </span>
                        <div
                          className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{
                              width:
                                `${item.confidence}%`
                            }}
                          />
                        </div>
                        <span
                          className="confidence-value">
                          {item.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="section-title">
                  🎨 Dominant Colors
                </h3>
                <div
                  className="colors-display">
                  {cv_analysis.dominant_colors
                    .map((color, i) => (
                    <div
                      key={i}
                      className="color-item"
                    >
                      <div
                        className="color-swatch"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <span
                        className="color-hex">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Room Dimensions */}
                {cv_analysis.dimensions && (
                  <div style={{
                    marginTop: '1.5rem'
                  }}>
                    <h3 className="section-title">
                      📐 Room Analysis
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{
                          color:
                            'var(--gray-light)'
                        }}>
                          Room Size
                        </span>
                        <strong style={{
                          color:
                            'var(--white-soft)',
                          textTransform:
                            'capitalize'
                        }}>
                          {cv_analysis
                            .dimensions
                            .estimated_size}
                        </strong>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{
                          color:
                            'var(--gray-light)'
                        }}>
                          Layout Type
                        </span>
                        <strong style={{
                          color:
                            'var(--white-soft)',
                          textTransform:
                            'capitalize'
                        }}>
                          {cv_analysis
                            .dimensions
                            .room_width_type}
                        </strong>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{
                          color:
                            'var(--gray-light)'
                        }}>
                          Structural Lines
                        </span>
                        <strong style={{
                          color: 'var(--gold)'
                        }}>
                          {cv_analysis
                            .dimensions
                            .structural_lines_detected}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background:
            'rgba(212,175,55,0.05)',
          border:
            '1px solid rgba(212,175,55,0.2)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginTop: '2rem'
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--gray-light)',
            lineHeight: '1.6',
            margin: 0
          }}>
            ⚠️{' '}
            <strong style={{
              color: 'var(--gold)'
            }}>
              Advisory Notice:
            </strong>{' '}
            All renovation recommendations
            are for planning purposes only.
            Always consult a qualified
            interior designer or contractor
            before making actual renovation
            decisions. Estimated costs are
            approximate.
          </p>
        </div>

        {/* Action Buttons — Print Removed */}
        <div className="action-buttons">
          <Link
            to="/upload"
            className="btn btn-primary">
            Analyze Another Room
          </Link>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          borderTop:
            '1px solid rgba(212,175,55,0.1)',
          fontSize: '0.85rem',
          color: 'var(--gray-light)'
        }}>
          RenoVision — Final Year Project |
          Lahore Garrison University |
          BSCS 2024
          <br />
          <span style={{
            color: 'var(--gold)'
          }}>
            Made by Ahmad Raza & Tabeel John
          </span>
        </div>

      </div>
    </div>
  );
}

export default Results;