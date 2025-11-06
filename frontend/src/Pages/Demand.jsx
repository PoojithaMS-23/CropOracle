import React, { useEffect, useState } from "react";
import { getMarketDemand, finalConfirm } from "../services/api";

const Demand = ({ selectedData, onBack }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedData) return;

    const fetchDemand = async () => {
      try {
        const response = await getMarketDemand(
          selectedData.cultivation_id,
          selectedData.crops
        );
        setResult(response.data);
      } catch (error) {
        console.error("❌ Error fetching market demand:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemand();
  }, [selectedData]);

  const handleConfirm = async () => {
    try {
      setSaving(true);

      const payload = {
        farmer_id: selectedData.farmer_id,            // ✅ comes from card click page
        cultivation_id: selectedData.cultivation_id,  // ✅ required
        mandi_name: result.mandi,
        crop: result.crop,
        yield: result.your_yield,
      };

      console.log("📤 Payload sending -> ", payload);

      await finalConfirm(payload);

      alert("✅ Successfully added to mandi data!");
    } catch (err) {
      alert("❌ Failed to save. Check backend logs.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
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

      <h2>📊 Market Demand Analysis</h2>

      {loading ? (
        <p>Loading...</p>
      ) : result ? (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            width: "60%",
            margin: "auto",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Crop: {result.crop}</h3>
          <p><strong>Mandi:</strong> {result.mandi}</p>
          <p><strong>Your Yield:</strong> {result.your_yield} tons</p>
          <p><strong>Total Yield in Mandi:</strong> {result.total_yield_in_mandi} tons</p>
          <p><strong>Predicted Price:</strong> ₹ {result.predicted_price}</p>
          <p>
            <strong>Recalculated Price:</strong>{" "}
            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
              ₹ {result.recalculated_price}
            </span>
          </p>

          {result.message && (
            <p style={{ marginTop: "10px", color: "#e67e22", fontStyle: "italic" }}>
              ⚠ {result.message}
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={saving}
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              width: "100%",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {saving ? "Saving..." : "✅ Confirm & Add to Mandi"}
          </button>
        </div>
      ) : (
        <p>No demand data found.</p>
      )}
    </div>
  );
};

export default Demand;
