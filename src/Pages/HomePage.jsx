import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PricePredictionForm from '../components/PricePredictionForm';
import Footer from '../components/Footer';
import ProfilePage from './ProfilePage';
import EditProfilePage from './EditProfilePage'; // will create next

function HomePage() {
  const [showPredictForm, setShowPredictForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [profile, setProfile] = useState({
    farmerName: "John Doe",
    age: 35,
    location: "Mandi A",
    contact: "9876543210",
    username: "johndoe",
    password: "password123"
  });

  const handleShowWelcome = () => {
    setShowPredictForm(false);
    setShowProfile(false);
    setShowEdit(false);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setShowPredictForm(false);
    setShowEdit(false);
  };

  const handleEditProfile = () => {
    setShowEdit(true);
    setShowProfile(false);
  };

  return (
    <div>
      <Navbar 
        onPredictClick={() => { setShowPredictForm(true); setShowProfile(false); }} 
        onHomeClick={handleShowWelcome} 
        onProfileClick={handleShowProfile} 
      />

      {!showPredictForm && !showProfile && !showEdit && (
        <section style={{ padding: '200px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>
            Welcome To CropOracle 🌾
          </h1>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>
            An Explainable ML Web Application for Market Price Prediction
          </p>
        </section>
      )}

      {showPredictForm && !showProfile && !showEdit && (
        <section id="predict" style={{ padding: '50px', textAlign: 'center' }}>
          <PricePredictionForm />
        </section>
      )}

      {showProfile && !showEdit && (
        <ProfilePage 
          profile={profile} 
          onEdit={handleEditProfile} 
          onLogout={handleShowWelcome} 
        />
      )}

      {showEdit && (
        <EditProfilePage 
          profile={profile} 
          setProfile={setProfile} 
          onCancel={handleShowProfile} 
          onSave={handleShowProfile} 
        />
      )}

      <Footer />
    </div>
  );
}

export default HomePage;
