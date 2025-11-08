import React, { useState } from "react";

const EditProfilePage = ({ profile, setProfile, onCancel, onSave }) => {
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update_profile/${formData.farmer_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Profile updated: ${result.message}`);
        setProfile(formData);
        onSave();
      } else {
        console.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative overflow-y-auto py-10 px-5"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1605732440685-3787b1b9f194?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 🌑 Overlay for depth */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* 🌾 Edit Profile Card */}
      <div className="relative z-10 w-[90%] max-w-2xl bg-gray-900/70 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.35)] p-10 md:p-12 text-gray-100 animate-glow">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-emerald-400 drop-shadow-md">
          ✏️ Edit Profile
        </h2>

        <form className="space-y-5">
          {[
            { label: "Farmer Name", name: "name", type: "text" },
            { label: "Age", name: "age", type: "number" },
            { label: "Location", name: "location", type: "text" },
            { label: "Contact", name: "phone", type: "text" },
            { label: "Username", name: "username", type: "text" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="mb-1 font-medium text-emerald-300">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="p-3 rounded-lg border border-emerald-500/30 bg-gray-800/60 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          ))}
        </form>

        {/* Buttons */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gradient-to-r from-gray-300 to-gray-400 hover:scale-[1.03] transition transform shadow-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 hover:scale-[1.03] transition transform shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
