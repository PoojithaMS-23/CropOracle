import React, { useState } from "react";
// Removed unused React Router imports: BrowserRouter, Routes, Route, Navigate
import Navbar from "./components/Navbar";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import HomePage from "./Pages/HomePage";
import PricePredictionForm from "./components/PricePredictionForm";
import ResultDisplay from "./components/ResultDisplay";
import Footer from "./components/Footer";
import ProfilePage from "./Pages/ProfilePage";
import EditProfilePage from "./Pages/EditProfilePage";
import LiveStatus from "./Pages/LiveStatus";
import CultivationsPage from "./Pages/CultivationsPage";
import Demand from "./Pages/Demand";
import Comparision from "./components/Comparision";
import "./App.css";

function App() {
  const [page, setPage] = useState("login"); 
  const [predictionData, setPredictionData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedCultivation, setSelectedCultivation] = useState(null); 
  const [compareData, setCompareData] = useState(null);

  // --- Navigation Handlers (Preserved as requested) ---
  const goToSignup = () => setPage("signup");
  const goToLogin = () => setPage("login");
  const goToHome = () => setPage("home");
  const goToPredict = () => setPage("predict");
  const goToProfile = () => setPage("profile");
  const goToEdit = () => setPage("edit");
  const goToLive = () => setPage("live");

  const goToCompare = (data = null) => {
    if (data) localStorage.setItem("compareData", JSON.stringify(data));
    setPage("compare");
  };

  const goToCompareFromNavbar = () => {
    setCompareData(null); 
    setPage("compare");
  };

  const handleViewCultivations = () => setPage("cultivations");

  const showResult = (data) => {
    setPredictionData(data);
    setPage("result");
  };

  const handleSeeDemand = (cultivationRow) => {
    setSelectedCultivation(cultivationRow);
    setPage("demandResult"); 
  };
  
  // Determine if Navbar should be shown (i.e., user is logged in and not on login/signup)
  const showNavbar = profile && page !== 'login' && page !== 'signup';

  return (
    <div className="App min-h-screen flex flex-col">
      {/* 🚜 AGRI ANIMATED BACKGROUND */}
      <div className="agri-bg"></div>
      <div className="data-dots"></div>

      {showNavbar && (
        <Navbar
          onHomeClick={goToHome}
          onPredictClick={goToPredict}
          onLiveStatusClick={goToLive}
          onProfileClick={goToProfile}
          onCompareClick={goToCompareFromNavbar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-grow content">
        {/* LOGIN PAGE */}
        {page === "login" && (
          <LoginPage
            goToSignup={goToSignup}
            setProfile={setProfile}
            goToHome={goToHome}
          />
        )}

        {/* SIGNUP PAGE */}
        {page === "signup" && (
          <SignUpPage
            goToLogin={goToLogin}
            setProfile={setProfile}
            goToHome={goToHome}
          />
        )}

        {/* HOME PAGE */}
        {page === "home" && (
          <HomePage
            profile={profile}
            setProfile={setProfile}
            goToPredict={goToPredict}
            goToProfile={goToProfile}
            goToLive={goToLive}
            goToCompare={() => {
              setCompareData(null); // optional default
              setPage("compare");
            }}
          />
        )}

        {/* PRICE PREDICTION PAGE */}
        {page === "predict" && <PricePredictionForm goToResult={showResult} />}

        {/* RESULT PAGE */}
        {page === "result" && predictionData && (
          <div className="text-center p-10 min-h-[80vh]">
            <ResultDisplay
              result={predictionData}
              goBack={goToPredict}
              goToCompare={goToCompare}
            />

            <button
              onClick={goToPredict}
              className="mt-6 px-6 py-3 border-none rounded-lg bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold cursor-pointer transition duration-300 hover:scale-[1.03] shadow-lg"
            >
              Predict Another
            </button>
          </div>
        )}
        
        {/* PROFILE PAGE */}
        {page === "profile" && profile && (
          <ProfilePage
            profile={profile}
            onEdit={goToEdit}
            onLogout={() => {
              setProfile(null);
              setPage("login");
            }}
            onHome={goToHome}
            onViewCultivations={handleViewCultivations}
          />
        )}

        {/* CULTIVATIONS PAGE */}
        {page === "cultivations" && (
          <CultivationsPage
            farmerId={profile?.farmer_id}
            onBack={goToProfile}
            onSeeDemand={handleSeeDemand}
          />
        )}

        {/* EDIT PROFILE */}
        {page === "edit" && profile && (
          <EditProfilePage
            profile={profile}
            setProfile={setProfile}
            onCancel={goToProfile}
            onSave={goToProfile}
          />
        )}

        {/* LIVE STATUS PAGE */}
        {page === "live" && <LiveStatus goToHome={goToHome} />}
        {page === "compare" && <Comparision />}

        {/* ✅ DEMAND PAGE - shown when See Current Demand button clicked */}
        {page === "demandResult" && (
          <Demand
            selectedData={selectedCultivation}
            onBack={() => setPage("cultivations")}
          />
        )}
      </div>
      
      {/* Footer is outside the main cntent wrapper now */}
      <Footer />
    </div>
  );
}

export default App;