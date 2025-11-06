import React, { useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import "./Chatbot.css"; // ✅ External CSS

const Chatbot = ({ closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to chatbot server." },
      ]);
    }
    setLoading(false);
  };

  // ✅ Receives transcript from VoiceAssistant
  const handleVoiceTranscript = (text) => {
    setInput(text);
    sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>🌾 CropOracle Chatbot</span>
        <button onClick={closeChat} className="close-btn">✖</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p>⏳ Bot typing...</p>}
      </div>

      <div className="chat-input-box">
        <input
          className="chat-input"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* ✅ Voice input button */}
        <VoiceAssistant onTranscript={handleVoiceTranscript} />

        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
