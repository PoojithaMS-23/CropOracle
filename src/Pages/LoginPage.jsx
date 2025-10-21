import React, { useState } from 'react';

function LoginPage({ goToSignup, goToHome }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
    console.log('Login Data:', formData);

    // If login successful, navigate to HomePage
    goToHome();
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
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
        <p style={styles.text}>
          Forgot <a href="#">Password?</a>
        </p>
        <p style={styles.text}>
          Not registered? <span onClick={goToSignup} style={styles.link}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', textAlign: 'center', backgroundColor: '#f8f8f8' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #aaa' },
  button: { padding: '10px', margin: '10px 0', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  text: { margin: '5px 0', fontSize: '0.9rem' },
  link: { color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }
};

export default LoginPage;
