import React, { useState } from "react";

const MessageDisplay = ({ message, type }) => {
  if (!message) return null;

  const baseClasses = "p-3 rounded-lg text-sm mb-4 font-medium text-left";
  const colorClasses =
    type === "success"
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";

  return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
};

function SignUpPage({ goToLogin, goToHome, setProfile }) {
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    age: "",
    username: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);

    const dataToSend = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      location: formData.place,
      age: formData.age,
      phone: formData.phone,
    };

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setMessageType("success");
        setProfile({ ...dataToSend });
        setTimeout(() => goToLogin(), 1500);
      } else {
        setMessage(result.message || "Signup failed");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Unable to connect to the server. Please check your network.");
      setMessageType("error");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* ✨ Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/85 backdrop-blur-sm"></div>

      {/* 💫 SignUp Card */}
      <div className="relative z-10 w-[90%] max-w-2xl my-10 bg-gray-900/75 backdrop-blur-2xl border border-emerald-700/40 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] p-10 md:p-12 text-center">
        <h2 className="text-5xl font-extrabold mb-3 text-emerald-400 drop-shadow-lg">
          Join CropOracle 🌾
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Empower your farming with AI-powered insights.
        </p>

        <MessageDisplay message={message} type={messageType} />

        <form
          onSubmit={handleSignup}
          className="flex flex-col space-y-4 text-left max-w-lg mx-auto"
        >
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "username", placeholder: "Username" },
            { name: "place", placeholder: "Place" },
            { name: "age", placeholder: "Age", type: "number" },
            { name: "phone", placeholder: "Phone Number" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field, idx) => (
            <input
              key={idx}
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800/70 text-gray-100 placeholder-gray-400 border border-emerald-700/40 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-200"
            />
          ))}

          <button
            type="submit"
            className="mt-4 py-3 rounded-xl text-lg font-semibold text-gray-900 bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 hover:scale-[1.03] transition transform shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={goToLogin}
            className="text-emerald-300 cursor-pointer font-semibold hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
