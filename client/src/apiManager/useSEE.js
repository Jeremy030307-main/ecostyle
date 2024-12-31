import { useState, useEffect } from 'react';
import { getHeaders } from './ApiMethods';

/**
 * A custom React hook for consuming Server-Sent Events (SSE).
 *
 * @param {string} url - The URL of the SSE endpoint.
 * @returns {any} The latest data received from the SSE connection.
 */
const useSEE = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("Running ")
    if (!url) return; // If no URL is provided, skip connection

    let eventSource;

    const initializeSSE = async () => {
      try {
        const options = {
          headers: await getHeaders(), // Make sure getHeaders() is defined correctly
          credentials: 'include',
      };
        eventSource = new EventSource(url, { options }); // Create EventSource instance

        // Handle incoming messages
        eventSource.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          setData(eventData);
        };

        // Handle errors (optional)
        eventSource.onerror = (error) => {
          console.error('SSE Error:', error);
        };
      } catch (error) {
        console.error('Failed to initialize SSE:', error);
      }
    };

    initializeSSE();

    return () => {
      if (eventSource) {
        eventSource.close(); // Clean up the EventSource connection on unmount
      }
    };
  }, [url]);

  return data;
};

export default useSEE;