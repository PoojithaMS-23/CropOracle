import React, { useEffect, useState } from "react";
import { getAllMandis, getMandiCropData, getCropAllMandisData, getCapacity } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import Navbar from "../components/Navbar";   // ✅ Add this import
import { useNavigate } from "react-router-dom";
const cropsList = ["Coffee","Coconut","Cocoa","Cardamum","Pepper","Arecanut","Ginger","Tea","Paddy","Groundnut","Blackgram","Cashew","Cotton"];

function LiveStatus() {
  const [option, setOption] = useState("");
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [chartData, setChartData] = useState([]);
  const [capacityData, setCapacityData] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllMandis().then((res) => {
      setMandis(res.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    getCapacity()
      .then((res) => {
        const capObj = {};
        (res.data.data || []).forEach(item => {
          if (!capObj[item.mandi_name]) capObj[item.mandi_name] = {};
          capObj[item.mandi_name][item.crop] = parseFloat(item.max_capacity);
        });
        setCapacityData(capObj);
      })
      .catch((err) => console.error("❌ Error loading capacity:", err));
  }, []);

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    setSelectedCrop("");
    setSelectedMandi("");
    setChartData([]);
    setSuggestion("");
  };

  const handleMandiChange = async (e) => {
    const mandi = e.target.value;
    setSelectedMandi(mandi);

    try {
      const res = await getMandiCropData(mandi);
      const data = cropsList.map(crop => {
        const cropData = res.data.find(row => row.crop === crop);
        const totalYield = cropData ? parseFloat(cropData.yield) : 0;
        const maxCap = capacityData[mandi]?.[crop] || 0;

        return {
          crop,
          totalYield,
          maxCap,
          fill: totalYield > maxCap ? "#ff4d4d" : "#28a745"
        };
      });

      setChartData(data);

      const maxRatioCrop = data.reduce((a, b) =>
        (b.totalYield / b.maxCap) > (a.totalYield / a.maxCap) ? b : a
      );
      setSuggestion(`✅ Best crop to supply: ${maxRatioCrop.crop}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCropChange = async (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);

    try {
      const res = await getCropAllMandisData(crop);
      const data = res.data.map(item => {
        const maxCap = capacityData[item.mandi_name]?.[crop] || 0;
        const totalYield = parseFloat(item.total_yield);

        return {
          mandi: item.mandi_name,
          totalYield,
          maxCap,
          fill: totalYield > maxCap ? "#ff4d4d" : "#28a745"
        };
      });

      setChartData(data);

      const bestMandi = data.reduce((a, b) =>
        (b.totalYield / b.maxCap) > (a.totalYield / a.maxCap) ? b : a
      );
      setSuggestion(`🚛 Best mandi to supply: ${bestMandi.mandi}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* ✅ Navbar visible on this screen */}
      <Navbar onHomeClick={() => window.location.href = "/"} />
        <Navbar
        onHomeClick={() => navigate("/")}
        onPredictClick={() => navigate("/predict")}
        onLiveStatusClick={() => navigate("/livestatus")}
        onProfileClick={() => navigate("/profile")}
        onCompareClick={() => navigate("/compare")}
      />

      <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
        <h2>📊 Live Status</h2>

        <div style={{ margin: "15px 0" }}>
          <label>
            <input type="radio" name="option" value="mandi" checked={option === "mandi"} onChange={handleOptionChange} />
            Select Mandi
          </label>

          <label style={{ marginLeft: "20px" }}>
            <input type="radio" name="option" value="crop" checked={option === "crop"} onChange={handleOptionChange} />
            Select Crop
          </label>
        </div>

        {option === "mandi" && (
          <select value={selectedMandi} onChange={handleMandiChange}>
            <option value="">-- Select Mandi --</option>
            {mandis.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        {option === "crop" && (
          <select value={selectedCrop} onChange={handleCropChange}>
            <option value="">-- Select Crop --</option>
            {cropsList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        {chartData.length > 0 && (
          <div style={{ marginTop: "30px", width: "100%", height: "400px" }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey={option === "mandi" ? "crop" : "mandi"} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalYield">
                  <LabelList dataKey="totalYield" position="top" />
                </Bar>
                <Bar dataKey="maxCap" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: "15px", fontWeight: 600 }}>{suggestion}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default LiveStatus;
