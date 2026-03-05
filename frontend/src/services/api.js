/**
 * API Service
 * 
 * Centralized API client for making HTTP requests to the backend
 * This module handles:
 * - Base URL configuration
 * - Default headers
 * - Request/response interceptors
 * - Error handling
 * 
 * Usage:
 * import api from '@/services/api';
 * 
 * const response = await api.get('/endpoint');
 * const response = await api.post('/endpoint', data);
 * const response = await api.put('/endpoint', data);
 * const response = await api.delete('/endpoint');
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Create an API client with common methods
 */
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authorization header
   * @returns {object} Headers object
   */
  getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Additional config options
   * @returns {Promise} Response data
   */
  async get(endpoint, config = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        ...config,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional config options
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        ...config,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} config - Additional config options
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        ...config,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} config - Additional config options
   * @returns {Promise} Response data
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        ...config,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch response object
   * @returns {Promise} Parsed response data
   * @throws {Error} If response is not ok
   */
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or unauthorized
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }

      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return response;
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @throws {Error} The error
   */
  handleError(error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Create and export API instance
const api = new APIClient(API_BASE_URL);

export default api;
