import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────
// All API calls go through this instance — never import raw axios elsewhere.
// This ensures all requests share the same base URL, timeout, and interceptors.

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true,   // Required to send/receive HttpOnly JWT cookies
  timeout: 15000,          // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handles global error scenarios:
//   - 401: Session expired → redirect to admin login
//   - Other errors: passed through to the calling hook/component

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // If the session expired and we're on an admin page, redirect to login
      if (
        error.response?.status === 401 &&
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/admin/login')
      ) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
