import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';
import VoiceAssistant from './VoiceAssistant';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const synthesis = window.speechSynthesis;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const speakMessage = (text) => {
        if (!synthesis) {
            console.error('Text-to-speech not supported');
            return;
        }
        
        // Stop any ongoing speech
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
        };

        synthesis.speak(utterance);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const newMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, newMessage]);

        try {
            // Send message to backend (note: backend registers the chatbot blueprint at /api)
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: inputMessage
            }, { timeout: 10000 });

            // Add bot response to chat (handle both successful and error payloads)
            const botText = response.data?.bot_response || response.data?.message || 'Sorry, no response.';
            const botMessage = {
                type: 'bot',
                content: botText,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Try to extract a helpful message from the error response
            const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
            const errorText = serverMsg || 'Sorry, I encountered an error. Please try again.';
            const errorMessage = {
                type: 'bot',
                content: errorText,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setInputMessage('');
    };

    return (
        <div className="chatbot-container">
            <button 
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>CropOracle Assistant</h3>
                        {isSpeaking && <div className="speaking-indicator">Speaking...</div>}
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`message ${message.type}`}
                            >
                                <div className="message-content">
                                    {message.content}
                                    {message.type === 'bot' && (
                                        <button 
                                            className="speak-button" 
                                            onClick={() => speakMessage(message.content)}
                                            title="Listen to response"
                                        >
                                            🔊
                                        </button>
                                    )}
                                </div>
                                <div className="message-timestamp">{message.timestamp}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="chatbot-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">Send</button>
                        <VoiceAssistant 
                            onTranscript={(text) => {
                                setInputMessage(text);
                                // Auto-submit after voice input
                                setTimeout(() => {
                                    handleSubmit(new Event('submit'));
                                }, 500);
                            }} 
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;