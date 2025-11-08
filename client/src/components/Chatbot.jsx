import React, { useState, useEffect, useRef } from "react";
import VoiceAssistant from "./VoiceAssistant";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // ✅ Minimize state
  const chatBodyRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to chatbot server." },
      ]);
    }
    setLoading(false);
  };

  // ✅ Handle voice transcript input
  const handleVoiceTranscript = (text) => {
    setInput(text);
    if (text.trim()) sendMessage();
  };

  // ✅ If minimized, show floating mic icon
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        title="Open CropOracle Chatbot"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-3xl shadow-[0_0_30px_rgba(16,185,129,0.5)] 
        hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse z-50"
      >
        🤖
      </button>
    );
  }

  return (
    <div
      className="w-[350px] h-[460px] fixed bottom-24 right-5 rounded-2xl 
      bg-gray-900/80 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.4)] 
      flex flex-col overflow-hidden text-gray-100 z-50 animate-glow font-sans"
    >
      {/* 🌿 Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-3 rounded-t-2xl flex justify-between items-center font-semibold shadow-lg">
        <span className="text-lg flex items-center gap-2">
          🌾 CropOracle AI
        </span>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="bg-transparent border-none text-white text-xl cursor-pointer hover:text-yellow-300 transition"
        >
          ▽
        </button>
      </div>

      {/* 💬 Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-emerald-500/40 scrollbar-track-transparent"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] break-words shadow-md transition-all duration-200 ${
              msg.sender === "user"
                ? "bg-emerald-600/80 text-white self-end"
                : "bg-gray-800/70 text-gray-100 border border-emerald-400/20 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <p className="text-emerald-300 italic text-sm self-start animate-pulse">
            ⏳ Bot typing...
          </p>
        )}
      </div>

      {/* ✍️ Input Area */}
      <div className="flex p-3 border-t border-emerald-600/30 items-center gap-2 bg-gray-800/70">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-900/60 border border-emerald-600/40 text-gray-100 
          placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
          value={input}
          placeholder="Ask me anything..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        {/* 🎤 Voice Input */}
        <VoiceAssistant onTranscript={handleVoiceTranscript} />

        <button
          onClick={sendMessage}
          className="p-2 px-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-400 to-lime-400 text-gray-900 
          hover:scale-[1.05] transition transform shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
