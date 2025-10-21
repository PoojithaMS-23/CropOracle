/** @jsxImportSource react */
import React from 'react'; // ✅ Ensure React import is present

function ResultDisplay({ result, onBack }) {
  return (
    <div style={resultPageStyle}>
      <div style={resultCardStyle}>
        <h2 style={titleStyle}>Predicted Result</h2>
        <p style={resultTextStyle}>{result}</p>
        <button onClick={onBack} style={backButtonStyle}>Back</button>
      </div>
    </div>
  );
}

const resultPageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #d0e6f7, #f7c9d4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '"Poppins", sans-serif'
};

const resultCardStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '15px',
  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  width: '400px'
};

const titleStyle = {
  color: '#6a5acd',
  marginBottom: '20px'
};

const resultTextStyle = {
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '20px'
};

const backButtonStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(90deg, #a2c2e2, #f4a6c1)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default ResultDisplay;
