export const API_URL = import.meta.env.VITE_BACKEND_URL
  .trim() // Removes spaces before and after
  .replace(/\/+$/, ''); // Removes trailing slashes

console.log(`API_URL: '${API_URL}'`); // Debugging: Check for extra spaces

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL.trim().replace(/\/+$/, '');
