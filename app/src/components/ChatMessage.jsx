import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message, role, timestamp }) {
    const isUser = role === 'user';
    const messageClass = isUser ? 'user-message' : 'assistant-message';
    
    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`${messageClass} message-enter`}>
            <div className="message-content">
                {isUser ? (
                    <div>{message}</div>
                ) : (
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </Markdown>
                )}
            </div>
            {timestamp && (
                <div className="message-time">
                    {formatTime(timestamp)}
                </div>
            )}
        </div>
    );
}