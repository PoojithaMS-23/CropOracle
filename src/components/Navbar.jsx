import React from 'react';

function Navbar({ onPredictClick, onHomeClick, onProfileClick }) {
  return (
    <nav
      style={{
        backgroundColor: '#a8d5ba',
        color: '#2b2b2b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', margin: 0 }}>CropOracle 🌾</h2>
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          gap: '20px',
          margin: 0,
          padding: 0,
          fontWeight: '500',
        }}
      >
        <li>
          <span 
            onClick={onHomeClick} 
            style={{ cursor: 'pointer', textDecoration: 'none', color: '#2b2b2b' }}
          >
            Home
          </span>
        </li>
        <li>
          <span
            onClick={onPredictClick}
            style={{ cursor: 'pointer', textDecoration: 'none', color: '#2b2b2b' }}
          >
            Predict
          </span>
        </li>
        <li>
          <a href="#about" style={{ textDecoration: 'none', color: '#2b2b2b' }}>About</a>
        </li>
        <li>
          <span
            onClick={onProfileClick}  // <-- call the handler passed from HomePage
            style={{ cursor: 'pointer', textDecoration: 'none', color: '#2b2b2b' }}
          >
            Profile
          </span>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
