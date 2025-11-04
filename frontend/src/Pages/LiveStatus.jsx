import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function LiveStatus({ goToHome, goToProfile, goToPredict }) {
  const [view, setView] = useState(null);
  const [mandis, setMandis] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [data, setData] = useState([]);

  // Fetch all mandis
  useEffect(() => {
    fetch("http://localhost:5000/api/mandis")
      .then((res) => res.json())
      .then((data) => setMandis(data))
      .catch((err) => console.error("Error fetching mandis:", err));
  }, []);

  // Fetch all crops
  useEffect(() => {
    fetch("http://localhost:5000/api/crops")
      .then((res) => res.json())
      .then((data) => setCrops(data))
      .catch((err) => console.error("Error fetching crops:", err));
  }, []);

  // Fetch yield data for selected mandi
  useEffect(() => {
    if (selectedMandi) {
      fetch(`http://localhost:5000/api/mandi_crop_yield/${selectedMandi}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error("Error fetching mandi yield:", err));
    }
  }, [selectedMandi]);

  // Fetch yield data for selected crop
  useEffect(() => {
    if (selectedCrop) {
      fetch(`http://localhost:5000/api/crop_mandi_yield/${selectedCrop}`)
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error("Error fetching crop yield:", err));
    }
  }, [selectedCrop]);

  return (
    <>
      {/* ✅ Navbar OUTSIDE container so it becomes full width */}
      <Navbar
        onHomeClick={goToHome}
        onPredictClick={goToPredict}
        onProfileClick={goToProfile}
      />

      <div style={containerStyle}>
        {!view ? (
          <div style={cardStyle}>
            <h2>📊 Know the Demand, Plan Smart!</h2>
            <p style={{ marginBottom: "20px" }}>
              Choose a mode to see live crop statistics and mandi trends.
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              <button style={buttonStyle} onClick={() => setView("mandi")}>
                Mandi
              </button>
              <button style={buttonStyle} onClick={() => setView("crop")}>
                Crop
              </button>
            </div>
          </div>
        ) : view === "mandi" ? (
          <div style={cardStyle}>
            <h2>🏪 Mandi-wise Crop Yield</h2>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              style={dropdownStyle}
            >
              <option value="">Select a Mandi</option>
              {mandis.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {data.length > 0 && (
              <div style={{ marginTop: "30px", width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_yield"
                      name="Total Yield"
                      fill="#4CAF50"
                      radius={[10, 10, 0, 0]}
                    >
                      <LabelList dataKey="total_yield" position="top" />
                    </Bar>
                    <Bar
                      dataKey="max_capacity"
                      name="Max Capacity"
                      fill="#ccc"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ marginTop: "15px", fontStyle: "italic" }}>
                  Crops that reached capacity appear in gray.
                </p>
              </div>
            )}
          </div>
        ) : view === "crop" ? (
          <div style={cardStyle}>
            <h2>🌾 Crop-wise Mandi Yield</h2>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={dropdownStyle}
            >
              <option value="">Select a Crop</option>
              {crops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {data.length > 0 && (
              <div style={{ marginTop: "30px", width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mandi_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_yield"
                      name="Total Yield"
                      fill="#4CAF50"
                      radius={[10, 10, 0, 0]}
                    >
                      <LabelList dataKey="total_yield" position="top" />
                    </Bar>
                    <Bar
                      dataKey="max_capacity"
                      name="Max Capacity"
                      fill="#f44336"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ marginTop: "15px", fontStyle: "italic" }}>
                  Mandis exceeding capacity are shown in red.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}

// --- Styles ---
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f0f7f4",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: '"Poppins", sans-serif',
  flexDirection: "column",
  padding: "40px",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  width: "600px",
};

const buttonStyle = {
  backgroundColor: "#2e7d32",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const dropdownStyle = {
  marginTop: "15px",
  padding: "10px",
  width: "60%",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

export default LiveStatus;
