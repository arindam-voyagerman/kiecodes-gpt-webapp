import React from 'react';
import { HiAcademicCap, HiRefresh } from 'react-icons/hi';

export default function ChatHeader({ onNewChat }) {
    return (
        <div className="chat-header">
            <div className="school-info">
                <div className="school-logo">
                    <HiAcademicCap />
                </div>
                <div className="school-details">
                    <h1>Newtown School Assistant</h1>
                    <p>Here to help with school information</p>
                </div>
            </div>
            <button
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
                onClick={onNewChat}
                title="Start new conversation"
            >
                <HiRefresh size={20} />
            </button>
        </div>
    );
}