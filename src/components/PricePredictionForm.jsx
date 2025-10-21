import React, { useState } from 'react';

function PricePredictionForm({ goToResult }) {
  const [formData, setFormData] = useState({
    crop: '',
    area: '',
    dimensions: '',
    irrigation: '',
    season: '',
    mandi: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass an object instead of a string
    goToResult({
      predictedPrice: `Predicted price for ${formData.crop} (${formData.area} acres, ${formData.dimensions}, ${formData.irrigation} irrigation)`,
      mandi: formData.mandi,
      season: formData.season
    });
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Crop Price Prediction</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="text" name="crop" placeholder="Enter crop name" value={formData.crop} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="area" placeholder="Enter area in acres" value={formData.area} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="dimensions" placeholder="Enter dimensions" value={formData.dimensions} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="irrigation" placeholder="Irrigation method" value={formData.irrigation} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="season" placeholder="Season" value={formData.season} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="mandi" placeholder="Mandi" value={formData.mandi} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Predict Price</button>
        </form>
      </div>
    </div>
  );
}

// Styles (keep as is)
const pageStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #c4d7f2, #f7c9d4)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Poppins", sans-serif' };
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 18px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '350px' };
const headingStyle = { color: '#6a5acd', marginBottom: '20px', fontWeight: '600' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' };
const inputStyle = { padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' };
const buttonStyle = { padding: '12px 20px', background: 'linear-gradient(90deg, #a2c2e2, #f4a6c1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default PricePredictionForm;

