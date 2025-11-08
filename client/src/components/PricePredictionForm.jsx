import React, { useState } from "react";
import { predictPrice } from "../services/api";

function PricePredictionForm({ goToResult }) {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      area: parseFloat(formData.area),
      rainfall: parseFloat(formData.rainfall),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await predictPrice(payload);
      const data = response.data;

      const resultData = {
        predictedPrice: `₹${data.predicted_price}`,
        modifiedPrice: `₹${data.modified_price}`,
        predictedYield: `${data.predicted_yield} kg`,
        mandi: formData.mandi,
        season: formData.season,
        crop: formData.crop,
        fullForm: payload,
      };

      goToResult(resultData);
    } catch (error) {
      console.error("Prediction Error:", error.response?.data || error);
      console.error("Prediction failed. Check backend logs.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605732440685-3787b1b9f194?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* ✨ Dark overlay for cinematic contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85 backdrop-blur-sm"></div>

      {/* 🌱 Form Card — glowing emerald container */}
      <div className="relative z-10 w-[90%] max-w-2xl my-10 bg-gray-900/80 backdrop-blur-2xl border border-emerald-600/40 rounded-3xl p-10 md:p-12 text-center animate-glow">
        <h2 className="text-4xl font-extrabold text-emerald-400 mb-8 drop-shadow-lg">
          🌱 Crop Price Prediction
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type={
                ["area", "rainfall", "temperature", "humidity"].includes(key)
                  ? "number"
                  : "text"
              }
              name={key}
              placeholder={
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")
              }
              value={formData[key]}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800/60 text-gray-100 placeholder-gray-400 border border-emerald-600/30 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200"
            />
          ))}

          <button
            type="submit"
            className="mt-4 py-3 rounded-xl text-lg font-semibold text-gray-900 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 hover:scale-[1.03] transition transform shadow-lg"
          >
            Predict Price
          </button>
        </form>
      </div>
    </div>
  );
}

export default PricePredictionForm;
