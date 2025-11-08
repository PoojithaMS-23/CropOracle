import React from "react";

function Navbar({
  onHomeClick,
  onPredictClick,
  onLiveStatusClick,
  onProfileClick,
  onCompareClick,
}) {
  const navLinks = [
    { name: "Home", onClick: onHomeClick },
    { name: "Predict", onClick: onPredictClick },
    { name: "Live Status", onClick: onLiveStatusClick },
    { name: "Profile", onClick: onProfileClick },
    { name: "Compare Mandis", onClick: onCompareClick },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/60 backdrop-blur-xl border-b border-emerald-600/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🌾 Brand */}
        <h2
          onClick={onHomeClick}
          className="text-2xl md:text-3xl font-extrabold text-emerald-400 cursor-pointer tracking-wide drop-shadow-md hover:scale-105 transition-transform duration-200"
        >
          CropOracle 🌾
        </h2>

        {/* 🧭 Navigation Links */}
        <ul className="flex flex-wrap gap-6 text-gray-200 font-medium text-lg">
          {navLinks.map((link) => (
            <li key={link.name}>
              <span
                onClick={link.onClick}
                className="relative cursor-pointer px-1 transition-all duration-200 hover:text-emerald-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 💫 Emerald Glow Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
    </nav>
  );
}

export default Navbar;
