const getHeaders = () => {

    const App_Key = "randomKey";
    const authToken = localStorage.getItem('authToken') || null;

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
        'App-Key': App_Key,
    };
};

class ApiMethods {
    
    static apiRequest(method, url, body = null) {

        return new Promise((resolve, reject) => {
            const options = {
                method: method,
                headers: getHeaders(), // Make sure getHeaders() is defined correctly
                credentials: 'include',
            };
    
            // Add the body only for methods that allow it (like POST or PUT)
            if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(body);
            }
    
            fetch(url, options)
                .then(res => {
                    // Check if the response is ok (status in the range 200-299)
                    if (!res.ok) {
                        return reject(new Error(`HTTP error! status: ${res.status}`));
                    }
    
                    // Try to parse JSON; handle cases where response might not be JSON
                    return res.json().catch(err => {
                        // If parsing fails, reject the promise
                        reject(new Error('Failed to parse response as JSON'));
                    });
                })
                .then(resolve) // Resolve with the parsed JSON data
                .catch(reject); // Reject the promise on any fetch error
        });
    }

    static get(url){
        return this.apiRequest('GET', url);
    }

    static post(url, data){
        return this.apiRequest('POST', url, data);
    }

    static put(url, data){
        return this.apiRequest('PUT', url, data);
    }
    
    static delete(url){
        return this.apiRequest('DELETE', url);
    }
};

export {ApiMethods}


