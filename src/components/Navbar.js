import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Reno<span>Vision</span>
      </Link>
      <div style={{ fontSize: '13px', color: '#888' }}>
        AI-Based Smart Interior Planner
      </div>
    </nav>
  );
}

export default Navbar;