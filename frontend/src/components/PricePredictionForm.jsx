import React, { useState } from "react";
import ResultDisplay from "./ResultDisplay";

function PricePredictionForm() {
  const [formData, setFormData] = useState({
    location: "",
    area: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    soilType: "",
    irrigation: "",
    crops: "",
    season: "",
    mandi: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload for backend
    const payload = {
      crop: formData.crops,
      mandi: formData.mandi,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/predict_price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Set result to display in ResultDisplay.jsx
      setResult({
        predictedPrice: `₹${data.predicted_price.toFixed(2)}`,
        modifiedPrice: `₹${data.modified_price.toFixed(2)}`,
        mandi: formData.mandi,
        season: formData.season,
        crop: formData.crops,
      });
    } catch (error) {
      console.error("Error fetching price:", error);
      alert("Failed to get predicted price. Please try again.");
    }
  };

  const goBack = () => setResult(null);

  if (result) return <ResultDisplay result={result} goBack={goBack} />;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>🌱 Crop Price Prediction</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="area" placeholder="Area (in acres)" value={formData.area} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="rainfall" placeholder="Rainfall (mm)" value={formData.rainfall} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="temperature" placeholder="Temperature (°C)" value={formData.temperature} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="humidity" placeholder="Humidity (%)" value={formData.humidity} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="soilType" placeholder="Soil Type" value={formData.soilType} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="irrigation" placeholder="Irrigation Method" value={formData.irrigation} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="crops" placeholder="Crops" value={formData.crops} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="season" placeholder="Season" value={formData.season} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="mandi" placeholder="Mandi" value={formData.mandi} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Predict Price</button>
        </form>
      </div>
    </div>
  );
}

// --- Green Theme Styles ---
const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#e6f4ea",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: '"Poppins", sans-serif',
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px 35px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
  width: "400px",
  textAlign: "center",
};

const headingStyle = {
  color: "#2e7d32",
  marginBottom: "25px",
  fontWeight: "600",
  fontSize: "22px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle = {
  padding: "12px",
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #c8e6c9",
  fontSize: "15px",
  outline: "none",
  backgroundColor: "#f1f8f2",
};

const buttonStyle = {
  padding: "12px",
  backgroundColor: "#43a047",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  marginTop: "8px",
  transition: "background 0.3s ease",
};

export default PricePredictionForm;
