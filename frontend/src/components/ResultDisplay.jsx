import React, { useState } from "react";
import axios from "axios";

function Comparision() {
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
  const [isSaving, setIsSaving] = useState({}); // track saving per mandi

  const storedFarmer = JSON.parse(localStorage.getItem("farmer"));
  const farmer_id = storedFarmer?.farmer_id;

  const handleChange = (index, e) => {
    const newMandis = [...mandis];
    newMandis[index][e.target.name] = e.target.value;
    setMandis(newMandis);
  };

  const addMandi = () => {
    setMandis([...mandis, { mandi: "" }]);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
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

  // ✅ Save Confirm for a specific mandi
  const handleConfirm = async (res) => {
    setIsSaving((prev) => ({ ...prev, [res.mandi]: true }));
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
        mandi: res.mandi,
        predicted_price: res.predicted_price,
        modified_price: res.modified_price,
        predicted_yield: res.predicted_yield,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/farmer_cultivation_history",
        payload
      );

      alert(`✅ Data saved for mandi: ${res.mandi}`);
    } catch (error) {
      console.error(error);
      alert(`❌ Failed to save for mandi: ${res.mandi}`);
    } finally {
      setIsSaving((prev) => ({ ...prev, [res.mandi]: false }));
    }
  };

  // ✅ Save Confirm To for a specific mandi
  const handleConfirmTo = async (res) => {
    setIsSaving((prev) => ({ ...prev, [`to-${res.mandi}`]: true }));
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
        mandi: res.mandi,
        predicted_price: res.predicted_price,
        recalculated_price: res.modified_price,
        yield: res.predicted_yield,
        created_at: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/confirm_to",
        payload
      );

      alert(`✅ Confirm To saved for mandi: ${res.mandi}`);
    } catch (error) {
      console.error(error);
      alert(`❌ Failed Confirm To for mandi: ${res.mandi}`);
    } finally {
      setIsSaving((prev) => ({ ...prev, [`to-${res.mandi}`]: false }));
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>🌱 Compare Crop Prices Across Mandis</h2>
        <form onSubmit={handlePredict} style={formStyle}>
          {mandis.map((input, index) => (
            <div key={index} style={{ marginBottom: "12px" }}>
              {index === 0
                ? Object.keys(input).map((key) => (
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
                  ))
                : (
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
            {results.map((res) => (
              <div
                key={res.mandi}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  border: "1px solid #c8e6c9",
                  borderRadius: "8px",
                }}
              >
                <p><strong>Mandi:</strong> {res.mandi}</p>
                <p><strong>Predicted Price:</strong> ₹{res.predicted_price}</p>
                <p><strong>Modified Price:</strong> ₹{res.modified_price}</p>
                <p><strong>Predicted Yield:</strong> {res.predicted_yield} kg</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
                    onClick={() => handleConfirm(res)}
                    disabled={isSaving[res.mandi]}
                  >
                    {isSaving[res.mandi] ? "Saving..." : "Confirm"}
                  </button>
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#1565c0" }}
                    onClick={() => handleConfirmTo(res)}
                    disabled={isSaving[`to-${res.mandi}`]}
                  >
                    {isSaving[`to-${res.mandi}`] ? "Saving..." : "Confirm To"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Styling ---- */
const pageStyle = { minHeight: "100vh", backgroundColor: "#e6f4ea", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: '"Poppins", sans-serif' };
const cardStyle = { backgroundColor: "#ffffff", padding: "40px 35px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)", width: "500px", textAlign: "center" };
const headingStyle = { color: "#2e7d32", marginBottom: "25px", fontWeight: "600", fontSize: "22px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = { padding: "12px", width: "100%", borderRadius: "10px", border: "1px solid #c8e6c9", fontSize: "15px", outline: "none", backgroundColor: "#f1f8f2" };
const buttonStyle = { padding: "10px", backgroundColor: "#43a047", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "background 0.3s ease" };

export default Comparision;
