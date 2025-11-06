import React, { useState } from 'react';
import '../App.css';

function LoginPage({ goToSignup, goToHome, setProfile }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      // ✅ Store farmer details (including farmer_id) in localStorage
      localStorage.setItem("farmer", JSON.stringify(result.farmer));

      setProfile(result.farmer); // keep existing functionality
      goToHome();                // redirect to home
    } else {
      alert(result.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to connect to the server");
  }
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>CropOracle 🌾</h2>
        <p style={styles.subHeading}>Farmer Login</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.text}>
          New to CropOracle?{' '}
          <span onClick={goToSignup} style={styles.link}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: 'calc(100vh - 70px)', // leave space for navbar if present
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #d4e9d7, #f4f1bb)',
    padding: '20px'
  },
  container: {
    maxWidth: '400px',
    width: '100%',
    padding: '40px',
    borderRadius: '15px',
    backgroundColor: '#fffef7',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  heading: {
    marginBottom: '10px',
    fontSize: '2rem',
    color: '#2b2b2b'
  },
  subHeading: {
    marginBottom: '30px',
    color: '#4b6330',
    fontWeight: '500'
  },
  form: { display: 'flex', flexDirection: 'column' },
  input: {
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #a8d5ba',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  button: {
    padding: '12px',
    margin: '20px 0 10px',
    background: 'linear-gradient(90deg, #6a994e, #a7c957)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  text: {
    margin: '5px 0',
    fontSize: '0.95rem',
    color: '#4b6330'
  },
  link: {
    color: '#6a994e',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default LoginPage;
