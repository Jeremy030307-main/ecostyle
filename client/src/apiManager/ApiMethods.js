export const getHeaders = async () => {

    const App_Key = "randomKey";

    // Return headers only if authToken exists
    const headers = {
        'Content-Type': 'application/json',
        'App-Key': App_Key,
    };

    return headers;
};

class ApiMethods {
    
    static apiRequest(method, url, body = null) {

        return new Promise(async (resolve, reject) => {
            const options = {
                method: method,
                headers: await getHeaders(), // Make sure getHeaders() is defined correctly
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
                        // Try to parse the error message from the response body
                        return res.json()
                            .then((errorResponse) => {
                                // If there's a 'message' property, use it in the error
                                const errorMessage = errorResponse.error || errorResponse;
                                return reject(new Error(`HTTP error! Status: ${res.status}, Message: ${errorMessage}`));
                                })
                            .catch(err => {
                                reject(new Error(`HTTP error! Status: ${res.status}.`));
                            })
                    }

                    if (res.status === 204) {
                        return resolve("Deletion Completed"); // Resolve with null for 204 responses
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

    static patch(url, data){
        return this.apiRequest('PATCH', url, data)
    }
    
};

export {ApiMethods}