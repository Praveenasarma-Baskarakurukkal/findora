/**
 * useAuth Hook
 * 
 * Custom hook for accessing authentication context
 * Makes it easier to use auth context throughout the app without prop drilling
 * 
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * @returns {object} Authentication context values
 * @throws {Error} If used outside AuthProvider
 */
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export default useAuth;
