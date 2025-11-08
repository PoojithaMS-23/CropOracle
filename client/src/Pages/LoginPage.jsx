import React, { useState } from "react";
import "../App.css";
import { loginFarmer } from "../services/api";

const MessageDisplay = ({ message, type }) => {
  if (!message) return null;
  const base =
    "p-3 rounded-lg text-sm mb-4 font-medium text-left transition-all duration-300";
  const color =
    type === "success"
      ? "bg-emerald-900/40 text-green-300 border border-green-600"
      : "bg-red-900/40 text-red-300 border border-red-600";
  return <div className={`${base} ${color}`}>{message}</div>;
};

function LoginPage({ goToSignup, goToHome, setProfile }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);

    const mockProfile = {
      farmer_id: 9999,
      name: "Mock Farmer",
      username: formData.username,
      location: "Fictional Farm",
      age: 42,
      phone: "555-0101",
      password: "mockpassword",
    };

    try {
      const response = await loginFarmer(formData.username, formData.password);
      const result = response.data;

      if (response.status === 200) {
        localStorage.setItem("farmer", JSON.stringify(result.farmer));
        setProfile(result.farmer);
        setMessage("Login successful!");
        setMessageType("success");
        setTimeout(() => goToHome(), 700);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (
        formData.username.toLowerCase() === "test" &&
        formData.password.toLowerCase() === "test"
      ) {
        localStorage.setItem("farmer", JSON.stringify(mockProfile));
        setProfile(mockProfile);
        setMessage("⚠️ Mock mode active — using test credentials.");
        setMessageType("error");
        setTimeout(() => goToHome(), 1000);
        return;
      }

      const errMsg =
        error.response?.data?.message ||
        "Login failed. Unable to connect to backend.";
      setMessage(errMsg);
      setMessageType("error");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Wider glass login card */}
      <div className="relative z-10 w-[90%] max-w-4xl bg-gray-900/80 backdrop-blur-2xl border border-emerald-800/70 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] p-16 text-white flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
          CropOracle 🌾
        </h1>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl">
          Welcome back, <span className="text-emerald-300">Farmer</span>! <br />
          Empowering agriculture with Explainable AI.
        </p>

        <div className="w-full max-w-2xl">
          <MessageDisplay message={message} type={messageType} />

          <form onSubmit={handleLogin} className="flex flex-col gap-6 text-left">
            <div>
              <label
                htmlFor="username"
                className="text-sm font-semibold text-emerald-300 mb-1 block"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none placeholder-gray-400 text-lg"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-emerald-300 mb-1 block"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-5 rounded-xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none placeholder-gray-400 text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-500 hover:scale-[1.03] text-gray-900 transition-transform shadow-lg"
            >
              {messageType === "success" ? "Redirecting..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-gray-300 text-sm text-center">
            New to CropOracle?{" "}
            <span
              onClick={goToSignup}
              className="text-emerald-300 hover:text-lime-300 cursor-pointer font-semibold hover:underline transition-all"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-6 text-emerald-400 text-sm font-medium tracking-wider opacity-90 z-10">
        🌿 CropOracle — Where AI Meets Agriculture
      </p>
    </div>
  );
}

export default LoginPage;
