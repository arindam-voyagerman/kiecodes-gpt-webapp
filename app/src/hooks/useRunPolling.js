import { useEffect, useRef } from 'react';
import { fetchRun } from "../services/api";
import { runFinishedStates } from "./constants";

export const useRunPolling = (threadId, run, setRun) => {
    const pollingTimerRef = useRef(null);

    const startPolling = async () => {
        if (!threadId || !run || !run.run_id) {
            return;
        }

        console.log(`Polling thread ${threadId} run ${run.run_id}`);
        try {
            const data = await fetchRun(threadId, run.run_id);
            if (data && (data.run_id !== run.run_id || data.status !== run.status)) {
                setRun(data);
            }
        } catch (error) {
            console.error('Error during polling:', error);
            stopPolling();
            return;
        }
        pollingTimerRef.current = setTimeout(startPolling, 1000);
    };

    const stopPolling = () => {
        if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = null;
        }
    };

    useEffect(() => {
        const needsToPoll = run && threadId && !runFinishedStates.includes(run.status);

        if (needsToPoll) {
            startPolling();
        } else {
            stopPolling();
        }

        return stopPolling;
    }, [threadId, run]);
};