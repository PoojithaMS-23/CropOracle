import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Comparision() {
    const navigate = useNavigate();
  
  // Navbar handlers
  const handleHomeClick = () => navigate("/home");
  const handlePredictClick = () => document.getElementById("predictForm")?.scrollIntoView({ behavior: "smooth" });
  const handleProfileClick = () => navigate("/profile");
  const handleLiveStatusClick = () => navigate("/live-status");
  const handleCompareClick = () => navigate("/compare"); // current page
  const [mandis, setMandis] = useState([
    {
      location: "",
      area: "",
      rainfall: "",
      temperature: "",
      humidity: "",
      soilType: "",
      irrigation: "",
      crop: "",
      season: "",
      mandi: "",
    },
  ]);

  const [results, setResults] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (index, e) => {
    const newMandis = [...mandis];
    newMandis[index][e.target.name] = e.target.value;
    setMandis(newMandis);
  };

  const addMandi = () => {
    setMandis([...mandis, { mandi: "" }]); // only mandi field for new rows
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!mandis[0].mandi) {
      alert("First mandi must be entered");
      return;
    }

    const commonData = {
      location: mandis[0].location,
      area: parseFloat(mandis[0].area),
      rainfall: parseFloat(mandis[0].rainfall),
      temperature: parseFloat(mandis[0].temperature),
      humidity: parseFloat(mandis[0].humidity),
      soilType: mandis[0].soilType,
      irrigation: mandis[0].irrigation,
      crop: mandis[0].crop,
      season: mandis[0].season,
      timestamp: new Date().toISOString(),
      mandis: mandis.map((m) => m.mandi),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/predict_price_multiple",
        commonData
      );
      setResults(response.data);
    } catch (error) {
      console.error("Prediction Error:", error.response?.data || error);
      alert("Prediction failed. Check backend logs.");
    }
  };

  const farmer_id = JSON.parse(localStorage.getItem("farmer"))?.farmer_id;

  const handleConfirm = async (mandiResult) => {
    setIsSaving(true);
    try {
      const payload = {
        farmer_id,
        location: mandis[0].location,
        area: mandis[0].area,
        rainfall: mandis[0].rainfall,
        temperature: mandis[0].temperature,
        humidity: mandis[0].humidity,
        soil_type: mandis[0].soilType,
        irrigation: mandis[0].irrigation,
        crops: mandis[0].crop,
        season: mandis[0].season,
        mandi: mandiResult.mandi,
        predicted_price: mandiResult.predicted_price,
        modified_price: mandiResult.modified_price,
        predicted_yield: mandiResult.predicted_yield,
      };
      await axios.post(
        "http://127.0.0.1:5000/api/farmer_cultivation_history",
        payload
      );
      alert(`✅ Confirmed for ${mandiResult.mandi}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error confirming mandi");
    }
    setIsSaving(false);
  };

  const handleConfirmTo = async (mandiResult) => {
    setIsSaving(true);
    try {
      const payload = {
        farmer_id,
        location: mandis[0].location,
        area: mandis[0].area,
        rainfall: mandis[0].rainfall,
        temperature: mandis[0].temperature,
        humidity: mandis[0].humidity,
        soil_type: mandis[0].soilType,
        irrigation: mandis[0].irrigation,
        crops: mandis[0].crop,
        season: mandis[0].season,
        mandi: mandiResult.mandi,
        predicted_price: mandiResult.predicted_price,
        recalculated_price: mandiResult.modified_price,
        yield: mandiResult.predicted_yield,
      };
      await axios.post("http://127.0.0.1:5000/api/confirm_to", payload);
      alert(`✅ Confirm To saved for ${mandiResult.mandi}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error in Confirm To");
    }
    setIsSaving(false);
  };

  return (
    <div style={pageStyle}>
      {/* Navbar fixed on top */}
       <Navbar
        onHomeClick={handleHomeClick}
        onPredictClick={handlePredictClick}
        onProfileClick={handleProfileClick}
        onLiveStatusClick={handleLiveStatusClick}
        onCompareClick={handleCompareClick}
      />


      {/* Center container */}
      <div style={centerContainerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>🌱 Compare Crop Prices Across Mandis</h2>
          <form onSubmit={handlePredict} style={formStyle}>
            {mandis.map((input, index) => (
              <div key={index} style={{ marginBottom: "12px" }}>
                {index === 0 ? (
                  <>
                    {Object.keys(input).map((key) => (
                      <input
                        key={key}
                        type="text"
                        name={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={input[key]}
                        onChange={(e) => handleChange(index, e)}
                        required
                        style={inputStyle}
                      />
                    ))}
                  </>
                ) : (
                  <input
                    type="text"
                    name="mandi"
                    placeholder="Enter Mandi Name"
                    value={input.mandi}
                    onChange={(e) => handleChange(index, e)}
                    required
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addMandi}
              style={{ ...buttonStyle, backgroundColor: "#1565c0" }}
            >
              + Add Another Mandi
            </button>

            <button type="submit" style={{ ...buttonStyle, marginTop: "12px" }}>
              Predict Prices
            </button>
          </form>

          {results.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>Prediction Results:</h3>
              {(() => {
                const maxPrice = Math.max(...results.map((r) => r.modified_price));
                return results.map((res, i) => {
                  const isBest = res.modified_price === maxPrice;
                  return (
                    <div
                      key={i}
                      style={{
                        marginBottom: "15px",
                        padding: "10px",
                        border: isBest ? "2px solid #ff9800" : "1px solid #c8e6c9",
                        borderRadius: "8px",
                        backgroundColor: isBest ? "#fff8e1" : "#ffffff",
                        position: "relative",
                      }}
                    >
                      <p>
                        <strong>Mandi:</strong> {res.mandi}
                      </p>
                      <p>
                        <strong>Predicted Price:</strong> ₹{res.predicted_price}
                      </p>
                      <p>
                        <strong>Modified Price:</strong> ₹{res.modified_price}
                      </p>
                      <p>
                        <strong>Predicted Yield:</strong> {res.predicted_yield} kg
                      </p>

                      {isBest && (
                        <div style={{ color: "#ff9800", fontWeight: "600", marginTop: "5px" }}>
                          💡 Good to supply here!
                        </div>
                      )}

                      <button
                        style={{ ...buttonStyle, backgroundColor: "#2e7d32", marginTop: "8px" }}
                        onClick={() => handleConfirm(res)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Confirm"}
                      </button>

                      <button
                        style={{ ...buttonStyle, backgroundColor: "#1565c0", marginTop: "8px" }}
                        onClick={() => handleConfirmTo(res)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Confirm To"}
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Styling ---- */
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column", // Navbar top, content below
  backgroundColor: "#e6f4ea",
  fontFamily: '"Poppins", sans-serif',
};

const centerContainerStyle = {
  flex: 1, // occupy remaining space
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px 35px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
  width: "450px",
  textAlign: "center",
  maxHeight: "90vh",
  overflowY: "auto",
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
  transition: "background 0.3s ease",
};

export default Comparision;
