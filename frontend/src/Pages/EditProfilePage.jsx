import React, { useState } from "react";

const EditProfilePage = ({ profile, setProfile, onCancel, onSave }) => {
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/update_profile/${formData.farmer_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      setProfile(formData); // update parent state
      onSave(); // go back to ProfilePage
    } else {
      alert(result.message || "Update failed");
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("Unable to connect to the server");
  }
};


  return (
    <div style={{
      maxWidth: "500px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2>Edit Profile</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Farmer Name: </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Age: </label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Location: </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Contact: </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Password: </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave} style={{ marginRight: "10px" }}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditProfilePage;
