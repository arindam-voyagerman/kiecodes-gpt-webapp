export const createNewThread = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('createNewThread response:', data);
        return data;
    } catch (err) {
        console.error('Error creating new thread:', err.message);
        throw err;
    }
}

export const fetchThread = async (threadId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/threads/${threadId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching thread:', err.message);
        throw err;
    }
}

export const fetchRun = async (threadId, runId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/threads/${threadId}/runs/${runId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching run:', err.message);
        throw err;
    }
}

export const postMessage = async (threadId, message) => {
    try {
        const response = await fetch(`http://localhost:8000/api/threads/${threadId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: message })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error posting message:', err.message);
        throw err;
    }
}

export const postToolResponse = async (threadId, runId, toolResponses) => {
    try {
        const response = await fetch(`http://localhost:8000/api/threads/${threadId}/runs/${runId}/tool`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toolResponses)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error posting tool response:', err.message);
        throw err;
    }
}