/**
 * Constants
 * 
 * Centralized constants used throughout the application
 * This includes API endpoints, error messages, user roles, etc.
 */

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  SECURITY: 'security',
  ADMIN: 'admin',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  
  // Lost Items
  LOST_ITEMS: '/lost-items',
  LOST_ITEM_DETAIL: (id) => `/lost-items/${id}`,
  
  // Found Items
  FOUND_ITEMS: '/found-items',
  FOUND_ITEM_DETAIL: (id) => `/found-items/${id}`,
  
  // Claims
  CLAIMS: '/claims',
  CLAIM_DETAIL: (id) => `/claims/${id}`,
  
  // User Profile
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
  
  // Admin
  USERS: '/admin/users',
  REPORTS: '/admin/reports',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  ITEM_POSTED: 'Item posted successfully!',
  ITEM_CLAIMED: 'Item claimed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Item Categories
export const ITEM_CATEGORIES = {
  ELECTRONICS: 'Electronics',
  DOCUMENTS: 'Documents',
  CLOTHING: 'Clothing',
  ACCESSORIES: 'Accessories',
  BOOKS: 'Books',
  OTHER: 'Other',
};

// Item Status
export const ITEM_STATUS = {
  LOST: 'lost',
  FOUND: 'found',
  CLAIMED: 'claimed',
  RETURNED: 'returned',
  PENDING: 'pending',
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_ROLE: 'userRole',
  USER_EMAIL: 'userEmail',
  USER_DATA: 'userData',
};

// Navigation Routes
export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/home',
  STUDENT: '/student',
  SECURITY: '/security',
  ADMIN: '/admin',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOST_ITEMS: '/lost',
  FOUND_ITEMS: '/found',
  POST_ITEM: '/post',
};

// Pagination
export const PAGINATION = {
  PAGE_SIZE: 10,
  SMALL_SIZE: 5,
  LARGE_SIZE: 20,
};

// API Request Timeout (ms)
export const API_TIMEOUT = 10000;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'MMMM DD, YYYY HH:mm:ss',
  TIME_ONLY: 'HH:mm:ss',
};
