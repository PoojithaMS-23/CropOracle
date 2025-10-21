import React, { useState } from 'react';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import HomePage from './Pages/HomePage';
import PricePredictionForm from './components/PricePredictionForm';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';

function App() {
  const [page, setPage] = useState('login'); // login, signup, home, predict, result
  const [predictionData, setPredictionData] = useState(null);

  // Page navigation functions
  const goToSignup = () => setPage('signup');
  const goToLogin = () => setPage('login');
  const goToHome = () => setPage('home');
  const goToPredict = () => setPage('predict');

  // Called by PricePredictionForm on submit
  const showResult = (data) => {
    setPredictionData(data);
    setPage('result');
  };

  return (
    <div className="App">
      <div className="content">
        {page === 'login' && <LoginPage goToSignup={goToSignup} goToHome={goToHome} />}
        {page === 'signup' && <SignUpPage goToLogin={goToLogin} goToHome={goToHome} />}
        {page === 'home' && <HomePage goToPredict={goToPredict} />}

        {page === 'predict' && <PricePredictionForm goToResult={showResult} />}

        {page === 'result' && predictionData && (
          <div style={{ textAlign: 'center', padding: '40px', minHeight: '80vh' }}>
            <ResultDisplay
              result={`Predicted Price: ${predictionData.predictedPrice || '₹52,000'}\nMandi: ${predictionData.mandi}\nSeason: ${predictionData.season}`}
              onBack={goToPredict} // navigate back to prediction form
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
                cursor: 'pointer'
              }}
            >
              Predict Another
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
