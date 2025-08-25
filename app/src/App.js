import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import WelcomeMessage from "./components/WelcomeMessage";
import StatusIndicator from "./components/StatusIndicator";
import { useThread } from './hooks/useThread';
import { useRunPolling } from './hooks/useRunPolling';
import { useRunRequiredActionsProcessing } from './hooks/useRunRequiredActionsProcessing';
import { useRunStatus } from './hooks/useRunStatus';
import { postMessage } from "./services/api";

function App() {
    const [run, setRun] = useState(undefined);
    const messagesEndRef = useRef(null);
    const { threadId, messages, setActionMessages, clearThread } = useThread(run, setRun);
    
    useRunPolling(threadId, run, setRun);
    useRunRequiredActionsProcessing(run, setRun, setActionMessages);
    const { status, processing } = useRunStatus(run);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, processing]);

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;
        
        try {
            const runData = await postMessage(threadId, message);
            setRun(runData);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleQuickAction = (action) => {
        handleSendMessage(action);
    };

    const visibleMessages = messages
        .filter((message) => message.hidden !== true)
        .map((message, index) => (
            <ChatMessage
                key={message.id || index}
                message={message.content}
                role={message.role}
                timestamp={message.created_at}
            />
        ));

    const showWelcome = visibleMessages.length === 0 && !processing;

    return (
        <div className="App">
            <ChatHeader onNewChat={clearThread} />
            
            <div className="messages-container">
                {showWelcome && (
                    <WelcomeMessage onQuickAction={handleQuickAction} />
                )}
                
                {visibleMessages}
                
                {processing && <TypingIndicator />}
                
                {status && (
                    <StatusIndicator status={status} />
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <ChatInput
                onSend={handleSendMessage}
                disabled={processing}
                placeholder="Ask me about Newtown School..."
            />
        </div>
    );
}

export default App;