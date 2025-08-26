import { useState, useEffect } from 'react';
import { createNewThread, fetchThread } from "../services/api";
import { runFinishedStates } from "./constants";

export const useThread = (run, setRun) => {
    const [threadId, setThreadId] = useState(undefined);
    const [thread, setThread] = useState(undefined);
    const [actionMessages, setActionMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [optimisticMessages, setOptimisticMessages] = useState([]);

    // This hook is responsible for creating a new thread if one doesn't exist
    useEffect(() => {
        if (threadId === undefined) {
            console.log("Creating new thread");
            createNewThread()
                .then((data) => {
                    if (data && data.thread_id) {
                        setRun(data);
                        setThreadId(data.thread_id);
                        console.log(`Created new thread ${data.thread_id}`);
                    } else {
                        console.error('Invalid response from createNewThread:', data);
                        // Set a fallback state to prevent infinite retries
                        setThreadId(null);
                    }
                })
                .catch((error) => {
                    console.error('Failed to create new thread:', error);
                    // Set a fallback state to prevent infinite retries
                    setThreadId(null);
                });
        }
    }, [threadId, setRun]);

    // This hook is responsible for fetching the thread when the run is finished
    useEffect(() => {
        if (!run || !runFinishedStates.includes(run.status)) {
            return;
        }

        console.log(`Retrieving thread ${run.thread_id}`);
        fetchThread(run.thread_id)
            .then((threadData) => {
                if (threadData) {
                    setThread(threadData);
                    // Clear optimistic messages when we get the updated thread
                    setTimeout(() => {
                        setOptimisticMessages([]);
                    }, 100);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch thread:', error);
            });
    }, [run]);

    // This hook is responsible for transforming the thread into a list of messages
    useEffect(() => {
        if (!thread) {
            return;
        }
        console.log(`Transforming thread into messages`);

        let newMessages = [...thread.messages, ...actionMessages]
            .sort((a, b) => a.created_at - b.created_at)
            .filter((message) => message.hidden !== true);
        setMessages(newMessages);
        
        // Auto-scroll to bottom when new messages arrive
        setTimeout(() => {
            const container = document.getElementById('messages-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 100);
    }, [thread, actionMessages]);

    const addOptimisticMessage = (message) => {
        setOptimisticMessages(prev => [...prev, message]);
        
        // Auto-scroll to bottom when adding optimistic message
        setTimeout(() => {
            const container = document.getElementById('messages-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 50);
    };

    const clearOptimisticMessages = () => {
        setOptimisticMessages([]);
    };

    const clearThread = () => {
        setThreadId(undefined);
        setThread(undefined);
        setRun(undefined);
        setMessages([]);
        setActionMessages([]);
        setOptimisticMessages([]);
    };

    const createThreadIfNeeded = async () => {
        if (threadId === undefined || threadId === null) {
            try {
                const newThreadData = await createNewThread();
                if (newThreadData && newThreadData.thread_id) {
                    setRun(newThreadData);
                    setThreadId(newThreadData.thread_id);
                    return newThreadData.thread_id;
                }
            } catch (error) {
                console.error('Failed to create new thread:', error);
                setThreadId(null);
            }
        }
        return threadId;
    };

    return {
        threadId,
        messages,
        actionMessages,
        setActionMessages,
        clearThread,
        addOptimisticMessage,
        clearOptimisticMessages,
        optimisticMessages,
        createThreadIfNeeded
    };
};