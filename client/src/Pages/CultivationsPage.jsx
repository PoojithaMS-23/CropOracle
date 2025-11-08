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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start py-12 px-5 bg-cover bg-center bg-no-repeat relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1616628182501-f44b43f3df72?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 🌑 Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* 🌾 Main content card */}
      <div className="relative z-10 w-[95%] max-w-6xl bg-gray-900/70 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.35)] p-8 md:p-10 animate-glow">
        {/* Back button */}
        <button
          onClick={onBack}
          className="px-5 py-2 mb-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg cursor-pointer hover:scale-[1.03] transition transform shadow-md"
        >
          ⬅ Back
        </button>

        <h2 className="text-4xl font-extrabold mb-8 text-emerald-400 text-center drop-shadow-md">
          🌾 Cultivation History
        </h2>

        {loading ? (
          <p className="text-gray-300 text-lg text-center">Loading...</p>
        ) : cultivations.length === 0 ? (
          <p className="text-lg text-gray-200 bg-gray-800/70 border border-gray-700 p-5 rounded-xl text-center">
            No cultivation history found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-emerald-600/20 shadow-inner">
            <table className="min-w-full text-sm text-left text-gray-200">
              <thead className="bg-emerald-700/80">
                <tr>
                  {[
                    "ID",
                    "Farmer ID",
                    "Location",
                    "Area",
                    "Rainfall",
                    "Temp",
                    "Humidity",
                    "Soil Type",
                    "Irrigation",
                    "Crop",
                    "Season",
                    "Mandi",
                    "Predicted Price",
                    "Recalculated Price",
                    "Yield (tons)",
                    "Created At",
                    "Updated At",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-gray-100 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-gray-800/60 divide-y divide-gray-700">
                {cultivations.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700/70 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                      {row.cultivation_id}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {row.farmer_id}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{row.location}</td>
                    <td className="px-6 py-4 text-gray-300">{row.area}</td>
                    <td className="px-6 py-4 text-gray-300">{row.rainfall}</td>
                    <td className="px-6 py-4 text-gray-300">{row.temperature}</td>
                    <td className="px-6 py-4 text-gray-300">{row.humidity}</td>
                    <td className="px-6 py-4 text-gray-300">{row.soil_type}</td>
                    <td className="px-6 py-4 text-gray-300">{row.irrigation}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {row.crops}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{row.season}</td>
                    <td className="px-6 py-4 text-gray-300">{row.mandi}</td>
                    <td className="px-6 py-4 text-gray-300">
                      ₹ {row.predicted_price}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ₹ {row.recalculated_price}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{row.yield}</td>
                    <td className="px-6 py-4 text-gray-400">{row.created_at}</td>
                    <td className="px-6 py-4 text-gray-400">{row.updated_at}</td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSeeDemand(row)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-semibold rounded-lg cursor-pointer hover:scale-[1.05] transition transform shadow-md"
                      >
                        📊 See Demand
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CultivationsPage;
