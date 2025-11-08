import React, { useState } from "react";
import PricePredictionForm from "../components/PricePredictionForm";
import Chatbot from "../components/Chatbot";

function HomePage({ goToPredict, goToLive, goToCompare, profile }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* ✅ Dark overlay for depth */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* ✅ Main welcome content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center text-gray-100">
        <div className="max-w-5xl bg-gray-900/70 backdrop-blur-2xl border border-emerald-700/50 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] p-12 md:p-16 fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
            Welcome to CropOracle 🌾
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Hello{" "}
            <span className="text-emerald-300 font-semibold">
              {profile?.name || "Farmer"}
            </span>
            ! <br />
            Discover smarter decisions for your cultivation with AI-powered insights.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={goToPredict}
              className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-500 text-gray-900 shadow-md hover:scale-[1.05] transition"
            >
              🌱 Predict Crop Prices
            </button>
            <button
              onClick={goToLive}
              className="px-8 py-4 rounded-xl text-lg font-semibold bg-gray-800/70 border border-emerald-600 hover:bg-emerald-700 hover:text-white transition"
            >
              📈 View Live Status
            </button>
            <button
              onClick={goToCompare}
              className="px-8 py-4 rounded-xl text-lg font-semibold bg-gray-800/70 border border-emerald-600 hover:bg-emerald-700 hover:text-white transition"
            >
              🔍 Compare Markets
            </button>
          </div>
        </div>
      </main>

      {/* ✅ Chatbot Floating Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white rounded-full w-16 h-16 text-3xl shadow-lg hover:bg-emerald-500 transition transform hover:scale-110 z-50"
      >
        💬
      </button>

      {chatOpen && <Chatbot closeChat={() => setChatOpen(false)} />}

      
    </div>
  );
}

export default HomePage;
