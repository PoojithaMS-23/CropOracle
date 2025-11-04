import React, { useState } from "react";

function ResultDisplay({ result, goBack }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirmTo = async () => {
  setIsSaving(true);

  try {
    const payload = {
      farmer_id: 1,  // TODO: Replace with logged in farmer ID
      location: result.fullForm.location,
      area: result.fullForm.area,
      rainfall: result.fullForm.rainfall,
      temperature: result.fullForm.temperature,
      humidity: result.fullForm.humidity,
      soil_type: result.fullForm.soilType,
      irrigation: result.fullForm.irrigation,
      crops: result.crop,
      season: result.season,
      mandi: result.mandi,
      predicted_price: result.predictedPrice.replace("₹", ""),
      recalculated_price: result.modifiedPrice.replace("₹", ""),
      yield: result.predictedYield.replace(" kg", ""),
      created_at: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:5000/api/confirm_to", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Saved to cultivation history & mandi wise data!");
    } else {
      alert(`❌ Failed: ${data.error}`);
    }
  } catch (error) {
    alert("Error while saving! Check backend logs.");
  } finally {
    setIsSaving(false);
  }
};


  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const payload = {
        farmer_id: 1, // 🔹 TODO: Replace with actual logged-in farmer_id later
        location: result.fullForm.location,
        area: result.fullForm.area,
        rainfall: result.fullForm.rainfall,
        temperature: result.fullForm.temperature,
        humidity: result.fullForm.humidity,
        soil_type: result.fullForm.soilType,
        irrigation: result.fullForm.irrigation,
        crops: result.crop,
        season: result.season,
        mandi: result.mandi,
        predicted_price: result.predictedPrice.replace("₹", ""),
        modified_price: result.modifiedPrice.replace("₹", ""), // ✅ new field
        predicted_yield: result.predictedYield.replace(" kg", ""),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:5000/api/farmer_cultivation_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Data saved successfully!");
      } else {
        alert(`❌ Failed to save: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to confirm cultivation details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>🌾 Predicted Results</h2>
        <p style={textStyle}><strong>Predicted Price:</strong> {result.predictedPrice}</p>
        <p style={textStyle}><strong>Recalculated Price:</strong> {result.modifiedPrice}</p> {/* ✅ added */}
        <p style={textStyle}><strong>Predicted Yield:</strong> {result.predictedYield}</p>
        <p style={textStyle}><strong>Crop:</strong> {result.crop}</p>
        <p style={textStyle}><strong>Mandi:</strong> {result.mandi}</p>
        <p style={textStyle}><strong>Season:</strong> {result.season}</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          <button style={buttonStyle} onClick={goBack}>Go Back</button>
          <button
            style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
            onClick={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Confirm"}
          </button>
        </div>
        <button
  style={{ ...buttonStyle, backgroundColor: "#1565c0" }}
  onClick={handleConfirmTo}
>
  Confirm To
</button>

      </div>
    </div>
  );
}

// --- Styling (unchanged) ---
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
  transition: "background 0.3s ease",
};

export default ResultDisplay;
