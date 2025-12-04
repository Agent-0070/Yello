// Default backend port is 5000 in the backend config. Use 5000 as the
// default so the frontend talks to the running backend unless overridden
// via VITE_API_BASE_URL in the environment.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;