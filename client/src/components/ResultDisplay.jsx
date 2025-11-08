import React from "react";

function ResultDisplay({ result, goBack, goToCompare }) {
  if (!result)
    return (
      <div className="text-center p-10 text-red-500">
        No prediction data available.
      </div>
    );

  const handleCompareClick = () => {
    goToCompare(result.fullForm);
  };

  const { predictedPrice, modifiedPrice, predictedYield, mandi, crop, season } =
    result;

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* ✨ Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* 🌿 Main Card */}
      <div className="relative z-10 max-w-3xl w-[90%] mx-auto p-10 rounded-2xl bg-gray-900/80 backdrop-blur-2xl border border-emerald-600/40 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-400 drop-shadow-lg">
          🎉 Prediction Successful!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Input Details */}
          <div className="p-6 rounded-xl bg-gray-800/70 border border-emerald-500/30 shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-emerald-300 border-b border-emerald-600/30 pb-2">
              🌱 Input Context
            </h3>
            <p>
              <strong>Crop:</strong>{" "}
              <span className="text-emerald-200 font-medium">{crop}</span>
            </p>
            <p>
              <strong>Mandi:</strong>{" "}
              <span className="text-emerald-200 font-medium">{mandi}</span>
            </p>
            <p>
              <strong>Season:</strong>{" "}
              <span className="text-emerald-200 font-medium">{season}</span>
            </p>
          </div>

          {/* Output Results */}
          <div className="p-6 rounded-xl bg-gray-800/70 border border-green-500/30 shadow-inner">
            <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-600/30 pb-2">
              📈 Output Results
            </h3>
            <p>
              <strong>Predicted Yield:</strong>{" "}
              <span className="font-semibold text-green-200">
                {predictedYield}
              </span>
            </p>
            <p>
              <strong>Base Price:</strong>{" "}
              <span className="font-semibold text-gray-200">
                {predictedPrice}
              </span>
            </p>
            <p>
              <strong>Adjusted Price:</strong>{" "}
              <span className="text-4xl font-extrabold text-emerald-400 block mt-2 animate-pulse">
                {modifiedPrice}
              </span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={goBack}
            className="px-6 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-500 font-semibold shadow-md hover:bg-gray-700 transition-all duration-300 flex-1 min-w-[200px]"
          >
            ⬅ New Prediction
          </button>

          <button
            onClick={handleCompareClick}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 font-bold shadow-lg hover:scale-[1.03] transition-transform duration-300 flex-1 min-w-[200px]"
          >
            📊 Compare with Other Mandis
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
