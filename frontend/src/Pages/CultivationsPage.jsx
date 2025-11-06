// CultivationsPage.jsx
import React, { useState, useEffect } from "react";
import { getCurrentCultivations } from "../services/api";

const CultivationsPage = ({ onBack, farmerId, onSeeDemand }) => {
  const [cultivations, setCultivations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCultivations = async () => {
      try {
        const response = await getCurrentCultivations(farmerId);
        setCultivations(response.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch cultivations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCultivations();
  }, [farmerId]);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          padding: "8px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginBottom: "15px",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <h2 style={{ marginBottom: "15px" }}>🌾 Cultivation History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : cultivations.length === 0 ? (
        <p>No cultivation history found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                <th>Cultivation ID</th>
                <th>Farmer ID</th>
                <th>Location</th>
                <th>Area</th>
                <th>Rainfall</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Soil Type</th>
                <th>Irrigation</th>
                <th>Crop</th>
                <th>Season</th>
                <th>Mandi</th>
                <th>Predicted Price</th>
                <th>Recalculated Price</th>
                <th>Yield (tons)</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cultivations.map((row, index) => (
                <tr
                  key={index}
                  style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}
                >
                  <td>{row.cultivation_id}</td>
                  <td>{row.farmer_id}</td>
                  <td>{row.location}</td>
                  <td>{row.area}</td>
                  <td>{row.rainfall}</td>
                  <td>{row.temperature}</td>
                  <td>{row.humidity}</td>
                  <td>{row.soil_type}</td>
                  <td>{row.irrigation}</td>
                  <td>{row.crops}</td>
                  <td>{row.season}</td>
                  <td>{row.mandi}</td>
                  <td>{row.predicted_price}</td>
                  <td>{row.recalculated_price}</td>
                  <td>{row.yield}</td>
                  <td>{row.created_at}</td>
                  <td>{row.updated_at}</td>

                  <td>
                    <button
                      onClick={() => onSeeDemand(row)} // ✅ Passing the entire record
                      style={{
                        padding: "7px 12px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      📊 See Current Demand
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CultivationsPage;
