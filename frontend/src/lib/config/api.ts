// Temporarily force production URL to test CORS
export const API_BASE_URL = 'https://wiki-backend-production.up.railway.app';

// Debug log to see which URL is being used
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);