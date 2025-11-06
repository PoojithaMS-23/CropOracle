import React, { useState } from "react";
import ResultDisplay from "./ResultDisplay";
import { predictPrice } from "../services/api";
import Navbar from "./Navbar";

function PricePredictionForm() {
  const [formData, setFormData] = useState({
    location: "",
    area: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    soilType: "",
    irrigation: "",
    crop: "",   // ✅ changed from crops → crop
    season: "",
    mandi: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      area: parseFloat(formData.area),
      rainfall: parseFloat(formData.rainfall),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      timestamp: new Date().toISOString(), // ✅ backend needs this timestamp
    };

    try {
      const response = await predictPrice(payload);
      const data = response.data;

      setResult({
        predictedPrice: `₹${data.predicted_price}`,
        modifiedPrice: `₹${data.modified_price}`,
        predictedYield: `${data.predicted_yield} kg`,
        mandi: formData.mandi,
        season: formData.season,
        crop: formData.crop,
        fullForm: formData,
      });
    } catch (error) {
      console.error("Prediction Error:", error.response?.data || error);
      alert("Prediction failed. Check backend logs.");
    }
  };

  const goBack = () => setResult(null);

  if (result) return <ResultDisplay result={result} goBack={goBack} />;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>🌱 Crop Price Prediction</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          ))}

          <button type="submit" style={buttonStyle}>Predict Price</button>
        </form>
      </div>
    </div>
  );
}

export default PricePredictionForm;

/* ---- Styling ---- */
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
