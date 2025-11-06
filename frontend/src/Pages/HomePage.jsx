import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PricePredictionForm from '../components/PricePredictionForm';
import Footer from '../components/Footer';
import ProfilePage from './ProfilePage';
import EditProfilePage from './EditProfilePage';
import Chatbot from '../components/Chatbot';  
// console.log({
//   Navbar,
//   PricePredictionForm,
//   Footer,
//   ProfilePage,
//   EditProfilePage,
//   Chatbot,
// });


function HomePage({ profile, setProfile, goToPredict, goToProfile, goToLive, goToCompare }) {
  const [showPredictForm, setShowPredictForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); 

  const handleShowWelcome = () => {
    setShowPredictForm(false);
    setShowEdit(false);
  };

  const handleEditProfile = () => {
    setShowEdit(true);
  };

  return (
    <div>
      <Navbar 
        onPredictClick={() => { setShowPredictForm(true); setShowEdit(false); }} 
        onHomeClick={handleShowWelcome} 
        onProfileClick={goToProfile}   // ✅ already correct
        onLiveStatusClick={goToLive} 
        onCompareClick={() => goToCompare()} 
     // ✅ added this line
      />

      {!showPredictForm && !showEdit && !profile && (
        <section style={{ padding: '200px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>
            Welcome To CropOracle 🌾
          </h1>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>
            An Explainable ML Web Application for Market Price Prediction
          </p>
        </section>
      )}

      {showPredictForm && !showEdit && (
        <section id="predict" style={{ padding: '50px', textAlign: 'center' }}>
          <PricePredictionForm goToResult={goToPredict} />
        </section>
      )}

      {profile && !showEdit && (
        <ProfilePage 
          profile={profile} 
          onEdit={handleEditProfile} 
          onLogout={() => setProfile(null)} 
        />
      )}

      {showEdit && profile && (
        <EditProfilePage 
          profile={profile} 
          setProfile={setProfile} 
          onCancel={() => setShowEdit(false)} 
          onSave={() => setShowEdit(false)} 
        />
      )}

      {/* <Footer /> */}
            {/* Chatbot Floating Icon */}
      <button
        onClick={() => setChatOpen(true)}
        style={chatIconStyle}
      >
        💬
      </button>
      

      {/* Show chatbot window only when icon clicked */}
      {chatOpen && <Chatbot closeChat={() => setChatOpen(false)} />}

    </div>
  );
}
const chatIconStyle = {
  position: "fixed",
  bottom: "25px",
  right: "25px",
  backgroundColor: "#2e7d32",
  color: "white",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  fontSize: "30px",
  border: "none",
  cursor: "pointer",
  zIndex: 1000,
};


export default HomePage;
