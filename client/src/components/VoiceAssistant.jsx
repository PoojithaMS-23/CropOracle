import React, { useState, useEffect, useRef } from "react";

const VoiceAssistant = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // ✅ Check browser support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-IN";

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const transcription = event.results[current][0].transcript;
      setTranscript(transcription);
      if (onTranscript) onTranscript(transcription);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("🎙️ Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [onTranscript]);

  const startListening = () => {
    setTranscript("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* 🎤 Microphone Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        title={isListening ? "Stop listening" : "Start voice input"}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold 
          transition-all duration-300 shadow-lg 
          ${
            isListening
              ? "bg-red-600 hover:bg-red-700 animate-pulse ring-4 ring-red-400/60 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          }`}
      >
        🎤
      </button>

      {/* Transcript Display */}
      {transcript && (
        <div className="mt-2 px-4 py-2 bg-gray-800/80 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium shadow-md backdrop-blur-sm max-w-xs truncate">
          <span className="text-gray-400 mr-1">Heard:</span>
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
