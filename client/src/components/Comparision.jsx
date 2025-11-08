import React, { useState, useEffect } from "react";
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
  const [isSaving, setIsSaving] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const storedFarmer = JSON.parse(localStorage.getItem("farmer"));
  const farmer_id = storedFarmer?.farmer_id;

  useEffect(() => {
    const compareDataString = localStorage.getItem("compareData");
    if (compareDataString) {
      const data = JSON.parse(compareDataString);
      setMandis([
        {
          location: data.location || "",
          area: data.area || "",
          rainfall: data.rainfall || "",
          temperature: data.temperature || "",
          humidity: data.humidity || "",
          soilType: data.soilType || "",
          irrigation: data.irrigation || "",
          crop: data.crop || "",
          season: data.season || "",
          mandi: data.mandi || "",
        },
      ]);
      localStorage.removeItem("compareData");
    }
  }, []);

  const handleChange = (index, e) => {
    const newMandis = [...mandis];
    newMandis[index][e.target.name] = e.target.value;
    setMandis(newMandis);
  };

  const addMandi = () => {
    if (mandis[mandis.length - 1].mandi) {
      setMandis([...mandis, { mandi: "" }]);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    if (!mandis[0].mandi || !mandis[0].crop) {
      setError("Please fill out all required fields in the first row.");
      setLoading(false);
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
      mandis: mandis.map((m) => m.mandi).filter((m) => m.trim() !== ""),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/predict_price_multiple",
        commonData
      );
      setResults(response.data);
    } catch (error) {
      console.error("Prediction Error:", error.response?.data || error);
      setError("Prediction failed. Please check the server status.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (mandiResult, type = "history") => {
    const key =
      type === "history" ? mandiResult.mandi : `to-${mandiResult.mandi}`;
    setIsSaving((prev) => ({ ...prev, [key]: true }));

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const endpoint =
        type === "history"
          ? "http://127.0.0.1:5000/api/farmer_cultivation_history"
          : "http://127.0.0.1:5000/api/confirm_to";

      await axios.post(endpoint, payload);
      console.log(`✅ Confirmed for ${mandiResult.mandi} (${type})`);
    } catch (err) {
      console.error(err);
      setError(`❌ Error confirming ${mandiResult.mandi}`);
    }

    setIsSaving((prev) => ({ ...prev, [key]: false }));
  };

  const handleConfirmHistory = (res) => handleConfirm(res, "history");
  const handleConfirmTo = (res) => handleConfirm(res, "confirm_to");

  const maxPrice =
    results.length > 0 ? Math.max(...results.map((r) => r.modified_price)) : -1;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex justify-center items-start py-12 px-4 overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 🌑 Softer dark overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md"></div>

      {/* 🧊 Smaller main container */}
      <div className="relative z-10 w-[90%] max-w-3xl bg-gray-800/70 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.35)] p-8 md:p-10 text-center animate-glow">
        <h2 className="text-4xl font-extrabold text-emerald-400 mb-8 drop-shadow-md">
          🌾 Compare Crop Prices Across Mandis
        </h2>

        {error && (
          <div className="p-3 mb-4 bg-red-900/40 border border-red-500 text-red-200 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handlePredict} className="flex flex-col gap-6">
          {mandis.map((input, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-gray-900/50 border border-emerald-500/20 text-left text-gray-200 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-emerald-300 mb-4">
                {index === 0 ? "Common Input Data" : `Mandi ${index + 1}`}
              </h3>

              {index === 0 &&
                Object.keys(input)
                  .filter((k) => k !== "mandi")
                  .map((key) => (
                    <input
                      key={key}
                      type={
                        ["area", "rainfall", "temperature", "humidity"].includes(
                          key
                        )
                          ? "number"
                          : "text"
                      }
                      name={key}
                      placeholder={
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }
                      value={input[key]}
                      onChange={(e) => handleChange(index, e)}
                      required
                      className="p-3 w-full rounded-lg border border-emerald-500/20 bg-gray-800/70 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-150 mb-3"
                    />
                  ))}

              <input
                type="text"
                name="mandi"
                placeholder={
                  index === 0 ? "Mandi 1 (Required)" : "Enter Mandi Name"
                }
                value={input.mandi}
                onChange={(e) => handleChange(index, e)}
                required={index === 0}
                className="p-3 w-full rounded-lg border border-emerald-500/20 bg-gray-800/70 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-150"
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              type="button"
              onClick={addMandi}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold rounded-lg hover:scale-[1.02] transition transform shadow-md"
            >
              + Add Another Mandi
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold rounded-lg hover:scale-[1.02] transition transform shadow-md disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Prices"}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-10 text-left">
            <h3 className="text-2xl font-bold mb-4 text-emerald-300">
              Prediction Results
            </h3>

            {results.map((res) => {
              const isBest = res.modified_price === maxPrice;
              const mandiKey = res.mandi;

              return (
                <div
                  key={mandiKey}
                  className={`mb-4 p-5 rounded-xl transition-all duration-300 ${
                    isBest
                      ? "bg-emerald-900/60 border-2 border-emerald-400 shadow-lg"
                      : "bg-gray-800/70 border border-gray-700 shadow-md"
                  }`}
                >
                  <p className="text-xl font-bold text-gray-100 mb-2">
                    {res.mandi}{" "}
                    {isBest && (
                      <span className="text-emerald-400 ml-2 text-sm">
                        (Best Price)
                      </span>
                    )}
                  </p>
                  <p className="text-gray-300">
                    <strong>Predicted Yield:</strong> {res.predicted_yield} kg
                  </p>
                  <p className="text-lg text-gray-200">
                    <strong>Base Price:</strong> ₹{res.predicted_price}
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    <strong>Adjusted Price:</strong> ₹{res.modified_price}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition duration-150 shadow-md ${
                        isSaving[mandiKey]
                          ? "bg-gray-500"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                      onClick={() => handleConfirmHistory(res)}
                      disabled={
                        isSaving[mandiKey] || isSaving[`to-${mandiKey}`]
                      }
                    >
                      {isSaving[mandiKey] ? "Saving..." : "Confirm"}
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition duration-150 shadow-md ${
                        isSaving[`to-${mandiKey}`]
                          ? "bg-gray-500"
                          : "bg-teal-600 hover:bg-teal-700"
                      }`}
                      onClick={() => handleConfirmTo(res)}
                      disabled={
                        isSaving[mandiKey] || isSaving[`to-${mandiKey}`]
                      }
                    >
                      {isSaving[`to-${mandiKey}`]
                        ? "Saving To..."
                        : "Confirm To"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comparision;
