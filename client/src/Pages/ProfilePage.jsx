import React from "react";

const ProfilePage = ({ profile, onEdit, onLogout, onHome, onViewCultivations }) => {
  if (!profile)
    return <p className="text-center text-gray-300 text-lg p-10">Loading farmer profile...</p>;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex justify-center items-center overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* ✨ Gradient overlay for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90 backdrop-blur-sm"></div>

      {/* 🌾 Profile Card */}
      <div className="relative z-10 max-w-3xl w-[90%] my-10 p-10 md:p-12 rounded-3xl bg-gray-900/80 backdrop-blur-2xl border border-emerald-600/40 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-left font-inter">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center mb-10 text-emerald-400 drop-shadow-lg">
          Farmer Profile 🌾
        </h2>

        {/* Profile Info */}
        <div className="text-lg text-gray-200 space-y-4 mb-8 leading-relaxed">
          <p>
            <strong className="text-emerald-300">Full Name:</strong> {profile.name}
          </p>
          <p>
            <strong className="text-emerald-300">Age:</strong> {profile.age}
          </p>
          <p>
            <strong className="text-emerald-300">Location:</strong> {profile.location}
          </p>
          <p>
            <strong className="text-emerald-300">Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong className="text-emerald-300">Username:</strong> {profile.username}
          </p>
          <p>
            <strong className="text-emerald-300">Password:</strong> ********
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-5">
          <button
            onClick={onEdit}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-400 text-gray-900 shadow-lg hover:scale-[1.03] transition transform"
          >
            ✏️ Edit Profile
          </button>

          <button
            onClick={onViewCultivations}
            className="px-6 py-3 rounded-xl font-semibold bg-emerald-800/80 text-white border border-emerald-400 shadow-md hover:bg-emerald-700 hover:scale-[1.03] transition transform"
          >
            🌱 View Cultivations
          </button>

          <button
            onClick={onHome}
            className="px-6 py-3 rounded-xl font-semibold bg-yellow-400 text-gray-900 shadow-md hover:bg-yellow-300 hover:scale-[1.03] transition transform"
          >
            🏡 Back to Home
          </button>

          <button
            onClick={onLogout}
            className="px-6 py-3 rounded-xl font-semibold bg-red-600 text-white shadow-md hover:bg-red-500 hover:scale-[1.03] transition transform"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
