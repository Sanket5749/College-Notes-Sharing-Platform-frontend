/**
 * ==============================================================================
 * College Notes Sharing Platform - API Service Wrapper
 * ==============================================================================
 */

// Resolve and normalize the API Base URL
const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  if (envUrl && typeof envUrl === 'string') {
    let clean = envUrl.trim().replace(/\/+$/, '');
    // Ensure /api suffix is present so routes (/notes, /auth, etc.) map correctly
    if (!clean.endsWith('/api') && !clean.includes('/api/')) {
      clean = `${clean}/api`;
    }
    return clean;
  }

  // Fallback in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }

  // Fallback in production mode (Render Backend)
  return 'https://college-notes-sharing-platform-backend-6wdi.onrender.com/api';
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = {
  getToken() {
    return localStorage.getItem('auth_token');
  },

  async request(endpoint, options = {}) {
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Prevent duplicate /api/api/ if endpoint was called with /api prefix
    if (cleanEndpoint.startsWith('/api/') && API_BASE_URL.endsWith('/api')) {
      cleanEndpoint = cleanEndpoint.substring(4);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;
    const token = this.getToken();

    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`${endpoint}${queryString}`, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', body: formData });
  },
};
