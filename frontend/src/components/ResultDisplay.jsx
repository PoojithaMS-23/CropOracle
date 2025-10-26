import React from "react";

function ResultDisplay({ result, goBack }) {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>🌱 Predicted Price</h2>
        <p style={textStyle}><strong>Predicted Price:</strong> {result.predictedPrice}</p>
        <p style={textStyle}><strong>Modified Price:</strong> {result.modifiedPrice}</p>
        <p style={textStyle}><strong>Crop:</strong> {result.crop}</p>
        <p style={textStyle}><strong>Mandi:</strong> {result.mandi}</p>
        <p style={textStyle}><strong>Season:</strong> {result.season}</p>
        <button style={buttonStyle} onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
}

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
  marginBottom: "20px",
  fontWeight: "600",
  fontSize: "22px",
};

const textStyle = {
  fontSize: "16px",
  margin: "6px 0",
  color: "#333",
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
  marginTop: "15px",
  transition: "background 0.3s ease",
};

export default ResultDisplay;
