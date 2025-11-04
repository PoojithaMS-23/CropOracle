import React, { useState, useEffect, useRef } from 'react';
import './VoiceAssistant.css';

const VoiceAssistant = ({ onTranscript }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported');
            return;
        }

        // Initialize speech recognition
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN'; // Set to Indian English

        recognitionRef.current.onresult = (event) => {
            const current = event.resultIndex;
            const transcription = event.results[current][0].transcript;
            setTranscript(transcription);
            if (onTranscript) {
                onTranscript(transcription);
            }
            setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTranscript]);

    const startListening = () => {
        setTranscript('');
        setIsListening(true);
        recognitionRef.current.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognitionRef.current.stop();
    };

    return (
        <div className="voice-assistant">
            <button
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop listening' : 'Start voice input'}
            >
                <span className="microphone-icon">🎤</span>
                {isListening && <span className="pulse-ring"></span>}
            </button>
            {transcript && (
                <div className="transcript">
                    Heard: {transcript}
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;