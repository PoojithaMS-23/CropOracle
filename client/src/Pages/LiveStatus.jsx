import React, { useEffect, useState } from "react";
import {
  getAllMandis,
  getMandiCropData,
  getCropAllMandisData,
  getCapacity,
} from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const cropsList = [
  "Coffee", "Coconut", "Cocoa", "Cardamum", "Pepper", "Arecanut",
  "Ginger", "Tea", "Paddy", "Groundnut", "Blackgram", "Cashew", "Cotton"
];

function LiveStatus({ goToHome }) {
  const [option, setOption] = useState("");
  const [mandis, setMandis] = useState([]);
  const [selectedMandi, setSelectedMandi] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [chartData, setChartData] = useState([]);
  const [capacityData, setCapacityData] = useState({});
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    getAllMandis().then((res) => setMandis(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    getCapacity()
      .then((res) => {
        const capObj = {};
        (res.data.data || []).forEach((item) => {
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
      const data = cropsList.map((crop) => {
        const cropData = res.data.find((row) => row.crop === crop);
        const totalYield = cropData ? parseFloat(cropData.yield) : 0;
        const maxCap = capacityData[mandi]?.[crop] || 0;
        return {
          crop,
          totalYield,
          maxCap,
          fill: totalYield > maxCap ? "#ef4444" : "#10b981",
        };
      });

      setChartData(data);

      if (data.length > 0) {
        const bestRatioCrop = data.reduce((a, b) => {
          const ratioA = a.totalYield / (a.maxCap || 1);
          const ratioB = b.totalYield / (b.maxCap || 1);
          return ratioA < ratioB ? a : b;
        });
        setSuggestion(
          `✅ Best crop to supply: ${bestRatioCrop.crop} (Current Fill: ${(
            (bestRatioCrop.totalYield / bestRatioCrop.maxCap) *
            100
          ).toFixed(1)}%)`
        );
      } else setSuggestion("No data available for this mandi.");
    } catch (err) {
      console.error(err);
      setSuggestion("Error fetching data.");
    }
  };

  const handleCropChange = async (e) => {
    const crop = e.target.value;
    setSelectedCrop(crop);
    try {
      const res = await getCropAllMandisData(crop);
      const data = res.data.map((item) => {
        const mandiName = item.mandi_name;
        const maxCap = capacityData[mandiName]?.[crop] || 0;
        const totalYield = parseFloat(item.total_yield);
        return {
          mandi: mandiName,
          totalYield,
          maxCap,
          fill: totalYield > maxCap ? "#ef4444" : "#10b981",
        };
      });
      setChartData(data);

      if (data.length > 0) {
        const bestMandi = data.reduce((a, b) => {
          const ratioA = a.totalYield / (a.maxCap || 1);
          const ratioB = b.totalYield / (b.maxCap || 1);
          return ratioA < ratioB ? a : b;
        });
        setSuggestion(
          `🚛 Best mandi to supply: ${bestMandi.mandi} (Current Fill: ${(
            (bestMandi.totalYield / bestMandi.maxCap) *
            100
          ).toFixed(1)}%)`
        );
      } else setSuggestion("No data available for this crop.");
    } catch (err) {
      console.error(err);
      setSuggestion("Error fetching data.");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex justify-center items-start py-16 px-5 overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 🌑 Softer overlay for lighter theme */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

      {/* 🌿 Main Card */}
      <div className="relative z-10 w-[90%] max-w-5xl bg-gray-800/80 backdrop-blur-2xl border border-emerald-500/40 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.35)] p-8 md:p-10 text-center animate-glow">
        <h2 className="text-4xl font-extrabold text-emerald-400 mb-8 drop-shadow-md">
          📊 Live Market Status
        </h2>

        {/* Radio Options */}
        <div className="mb-8 flex flex-wrap justify-center gap-8 text-gray-300">
          {["mandi", "crop"].map((val) => (
            <label key={val} className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="option"
                value={val}
                checked={option === val}
                onChange={handleOptionChange}
                className="text-emerald-400 focus:ring-emerald-400"
              />
              <span className="text-lg font-medium capitalize">Select {val}</span>
            </label>
          ))}
        </div>

        {/* Dropdown */}
        {option && (
          <select
            value={option === "mandi" ? selectedMandi : selectedCrop}
            onChange={option === "mandi" ? handleMandiChange : handleCropChange}
            className="p-3 rounded-lg bg-gray-700/60 border border-emerald-600/40 text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-full max-w-xs mx-auto mb-10"
          >
            <option value="">
              -- Select {option.charAt(0).toUpperCase() + option.slice(1)} --
            </option>
            {(option === "mandi" ? mandis : cropsList).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="mt-8 w-full bg-gray-900/50 rounded-xl shadow-inner p-6 border border-emerald-600/30">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <XAxis dataKey={option === "mandi" ? "crop" : "mandi"} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toFixed(2)} tons`,
                    name === "totalYield" ? "Total Yield" : "Max Capacity",
                  ]}
                />
                <Bar dataKey="totalYield" fill="#10b981" name="Total Yield">
                  <LabelList
                    dataKey="totalYield"
                    position="top"
                    fill="#ddd"
                    formatter={(v) => v.toFixed(2)}
                  />
                </Bar>
                <Bar dataKey="maxCap" fill="#3b82f6" name="Max Capacity" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 p-4 bg-emerald-900/40 border border-emerald-400/40 rounded-lg text-emerald-200 font-semibold text-center shadow-md">
              {suggestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveStatus;
