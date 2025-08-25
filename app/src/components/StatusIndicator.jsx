import React from 'react';
import { HiCog } from 'react-icons/hi';

export default function StatusIndicator({ status }) {
    return (
        <div className="status-indicator">
            <HiCog className="status-icon" size={16} />
            <span>{status}</span>
        </div>
    );
}