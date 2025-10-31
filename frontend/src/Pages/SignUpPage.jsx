import React, { useState } from 'react';

function SignUpPage({ goToLogin, goToHome, setProfile }) { // <-- add setProfile here
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    age: '',
    username: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      location: formData.place,
      age: formData.age,
      phone: formData.phone
    };

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json(); // only call once

      if (response.ok) {
        alert(result.message);
        // Store the new farmer in App state
        setProfile({ ...dataToSend });
        goToLogin(); 
      } else {
        alert(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to the server");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={styles.input} />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
        <input type="text" name="place" placeholder="Place" value={formData.place} onChange={handleChange} required style={styles.input} />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={styles.input} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={styles.input} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />

        <button type="submit" style={styles.button}>Sign Up</button>
        <p style={styles.text}>
          Already have an account? <span onClick={goToLogin} style={styles.link}>Login</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: '#f8f8f8'
  },
  form: { display: 'flex', flexDirection: 'column' },
  input: { padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #aaa' },
  button: { padding: '10px', margin: '10px 0', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  text: { margin: '5px 0', fontSize: '0.9rem' },
  link: { color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }
};

export default SignUpPage;
