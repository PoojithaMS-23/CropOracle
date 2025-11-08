import React from "react";

function Footer() {
  return (
    <footer
      className="bg-gradient-to-r from-emerald-900/90 via-gray-900/90 to-emerald-800/90
                 text-gray-300 text-center py-5 text-sm border-t border-emerald-600/40 
                 backdrop-blur-md shadow-[0_-4px_20px_rgba(16,185,129,0.15)]"
    >
      <p className="m-0">
        © 2025 <span className="text-emerald-400 font-semibold">CropOracle</span> | 
        Developed by <span className="text-lime-300 font-medium">Team C16</span>, NIE Mysuru 🌾
      </p>
    </footer>
  );
}

export default Footer;
