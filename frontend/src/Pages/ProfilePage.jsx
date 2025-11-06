import React from "react";

const ProfilePage = ({ profile, onEdit, onLogout, onHome, onViewCultivations }) => {
  if (!profile) return <p>Loading...</p>; // safety check
  


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Farmer Profile 🌾</h2>

      <div style={styles.info}>
        <p><strong>Full Name:</strong> {profile.name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Password:</strong> ********</p>
      </div>

      <div style={styles.buttons}>
        <button onClick={onEdit} style={styles.editButton}>Edit Profile</button>
        <button onClick={onHome} style={styles.homeButton}>Back to Home</button>

        {/* ✅ NEW BUTTON ADDED */}
        <button onClick={onViewCultivations} style={styles.cultivationButton}>
          See Current Cultivations
        </button>

        <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "60px auto",
    padding: "30px",
    borderRadius: "15px",
    backgroundColor: "#fffef7",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    textAlign: "left",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#4b6330",
    textAlign: "center"
  },
  info: {
    lineHeight: "1.8",
    fontSize: "1rem",
    color: "#2b2b2b",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px"
  },
  editButton: {
    padding: "12px 25px",
    background: "linear-gradient(90deg, #6a994e, #a7c957)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  homeButton: {
    padding: "12px 25px",
    background: "#f4b41a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  /* ✅ New Button Style */
  cultivationButton: {
    padding: "12px 25px",
    background: "#2a9d8f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  logoutButton: {
    padding: "12px 25px",
    background: "#f76c6c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  }
};

export default ProfilePage;
