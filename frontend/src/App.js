import React, { useState } from 'react';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import HomePage from './Pages/HomePage';
import PricePredictionForm from './components/PricePredictionForm';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';
import ProfilePage from './Pages/ProfilePage';
import EditProfilePage from './Pages/EditProfilePage';
import LiveStatus from './Pages/LiveStatus';
import Chatbot from './components/Chatbot';

function App() {
  const [page, setPage] = useState('login'); // login, signup, home, predict, result, profile, edit, live
  const [predictionData, setPredictionData] = useState(null);
  const [profile, setProfile] = useState(null); // logged-in farmer

  // Page navigation functions
  const goToSignup = () => setPage('signup');
  const goToLogin = () => setPage('login');
  const goToHome = () => setPage('home');
  const goToPredict = () => setPage('predict');
  const goToProfile = () => setPage('profile');
  const goToEdit = () => setPage('edit');
  const goToLive = () => setPage('live'); // ✅ new page for Live Status

  // Called by PricePredictionForm on submit
  const showResult = (data) => {
    setPredictionData(data);
    setPage('result');
  };

  return (
    <div className="App">
      <div className="content">
        {/* LOGIN PAGE */}
        {page === 'login' && (
          <LoginPage
            goToSignup={goToSignup}
            setProfile={setProfile}   // store logged-in farmer
            goToHome={goToHome}
          />
        )}

        {/* SIGNUP PAGE */}
        {page === 'signup' && (
          <SignUpPage
            goToLogin={goToLogin}
            setProfile={setProfile}   // store newly signed-up farmer
            goToHome={goToHome}
          />
        )}

        {/* HOME PAGE */}
        {page === 'home' && (
          <HomePage
            goToPredict={goToPredict}
            goToProfile={goToProfile} // navigate to profile from navbar
            goToLive={goToLive}       // ✅ navigate to Live Status page
          />
        )}

        {/* PREDICTION FORM */}
        {page === 'predict' && (
          <PricePredictionForm goToResult={showResult} />
        )}

        {/* RESULT DISPLAY */}
        {page === 'result' && predictionData && (
          <div style={{ textAlign: 'center', padding: '40px', minHeight: '80vh' }}>
            <ResultDisplay
              result={`Predicted Price: ${predictionData.predictedPrice || '₹52,000'}\nMandi: ${predictionData.mandi}\nSeason: ${predictionData.season}`}
              onBack={goToPredict}
            />
            <button
              onClick={goToPredict}
              style={{
                marginTop: '25px',
                padding: '12px 25px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #a2c2e2, #f4a6c1)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Predict Another
            </button>
          </div>
        )}

        {/* PROFILE PAGE */}
        {page === 'profile' && profile && (
          <ProfilePage
            profile={profile}
            onEdit={goToEdit}  // edit profile
            onLogout={() => {
              setProfile(null);
              setPage('login'); // logout
            }}
            onHome={goToHome} // navigate to home page
          />
        )}

        {/* EDIT PROFILE PAGE */}
        {page === 'edit' && profile && (
          <EditProfilePage
            profile={profile}
            setProfile={setProfile} // update profile after edit
            onCancel={goToProfile}
            onSave={goToProfile}
          />
        )}

        {/* ✅ LIVE STATUS PAGE */}
        {page === 'live' && (
          <LiveStatus goToHome={goToHome} />
        )}
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
