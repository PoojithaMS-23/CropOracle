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
        farmer_id: selectedData.farmer_id,
        cultivation_id: selectedData.cultivation_id,
        mandi_name: result.mandi,
        crop: result.crop,
        yield: result.your_yield,
      };

      console.log("📤 Payload sending -> ", payload);
      await finalConfirm(payload);
      console.log("✅ Successfully added to mandi data!");
    } catch (err) {
      console.error("❌ Failed to save. Check backend logs.", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-5 bg-cover bg-center bg-no-repeat relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605732440685-3787b1b9f194?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 🌑 Soft dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      <div className="relative z-10 w-[90%] max-w-3xl bg-gray-800/70 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] p-8 md:p-10 text-center animate-glow">
        {/* Back button */}
        <button
          onClick={onBack}
          className="px-4 py-2 mb-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg cursor-pointer hover:scale-[1.03] transition transform shadow-md"
        >
          ⬅ Back
        </button>

        <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-8 drop-shadow-md">
          📊 Market Demand Analysis
        </h2>

        {loading ? (
          <p className="text-gray-300 text-lg">Loading...</p>
        ) : result ? (
          <div className="bg-gray-900/60 p-8 rounded-2xl border border-emerald-500/20 shadow-lg text-gray-100 text-left space-y-4">
            <h3 className="text-2xl font-bold text-emerald-300 border-b border-emerald-700 pb-3 mb-3">
              Crop: {result.crop}
            </h3>

            <p className="text-lg">
              <strong className="text-gray-300">Mandi:</strong>{" "}
              {result.mandi}
            </p>
            <p className="text-lg">
              <strong className="text-gray-300">Your Yield:</strong>{" "}
              {result.your_yield} tons
            </p>
            <p className="text-lg">
              <strong className="text-gray-300">Total Yield in Mandi:</strong>{" "}
              {result.total_yield_in_mandi} tons
            </p>
            <p className="text-lg">
              <strong className="text-gray-300">Predicted Price:</strong>{" "}
              ₹ {result.predicted_price}
            </p>
            <p className="text-lg">
              <strong className="text-gray-300">Recalculated Price:</strong>{" "}
              <span className="text-emerald-400 font-extrabold text-xl">
                ₹ {result.recalculated_price}
              </span>
            </p>

            {result.message && (
              <p className="mt-4 p-3 bg-yellow-900/40 border border-yellow-600/60 rounded-lg text-yellow-200 italic">
                ⚠ {result.message}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={saving}
              className={`mt-6 p-3 w-full rounded-lg text-white font-bold text-lg shadow-md transition duration-200 ${
                saving
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02]"
              }`}
            >
              {saving ? "Saving..." : "✅ Confirm & Add to Mandi"}
            </button>
          </div>
        ) : (
          <p className="text-red-400 text-lg">No demand data found.</p>
        )}
      </div>
    </div>
  );
};

export default Demand;
