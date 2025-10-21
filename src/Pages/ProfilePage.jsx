import React from "react";

const ProfilePage = ({ profile, onEdit, onLogout }) => {
  return (
    <div style={{
      maxWidth: "500px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2>Farmer Profile</h2>
      <p><strong>Farmer Name:</strong> {profile.farmerName}</p>
      <p><strong>Age:</strong> {profile.age}</p>
      <p><strong>Location:</strong> {profile.location}</p>
      <p><strong>Contact:</strong> {profile.contact}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Password:</strong> ********</p>

      <button onClick={onEdit} style={{ marginRight: "10px" }}>Edit Profile</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
