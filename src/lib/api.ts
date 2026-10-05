/**
 * Centralized API configuration for KODEXIS
 * Handles local development, custom hostnames, and Render production deployments seamlessly.
 */

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';

export const API_BASE_URL: string = (() => {
  if (!rawApiUrl || rawApiUrl.trim() === '') {
    return 'http://localhost:8080';
  }
  const clean = rawApiUrl.trim().replace(/\/+$/, '');
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  return `https://${clean}`;
})();

export const LEARNING_API_BASE = `${API_BASE_URL}/api/learning`;
export const PROGRESS_API_BASE = `${API_BASE_URL}/api/progress`;
export const INTERVIEW_API_BASE = `${API_BASE_URL}/api/interviews`;
export const AUTH_API_BASE = `${API_BASE_URL}/api/auth`;

export default API_BASE_URL;
