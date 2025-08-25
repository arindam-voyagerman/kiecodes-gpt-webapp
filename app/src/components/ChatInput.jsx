import React, { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';

export default function ChatInput({ disabled, onSend, placeholder = "Type your message..." }) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-container">
            <div className="chat-input-wrapper">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="chat-input"
                    disabled={disabled}
                    rows={1}
                />
            </div>
            <button
                type="submit"
                disabled={disabled || !message.trim()}
                className="send-button"
                title="Send message"
            >
                <HiPaperAirplane />
            </button>
        </form>
    );
}