/**
 * AuthContext
 * 
 * Global authentication context for managing user authentication state
 * This context can be used throughout the app to access user info and auth status
 * 
 * Future improvements:
 * - Add token validation
 * - Add refresh token mechanism
 * - Add logout functionality
 * - Add role-based access control
 */

import { createContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the application and provides authentication state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} The provider component
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  /**
   * Check if user is already logged in on app load
   */
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUser({
        email,
        role,
      });
    }

    setLoading(false);
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (student, security, admin)
   * @returns {Promise} Login result
   */
  const login = async (email, password, role) => {
    // TODO: Replace with actual API call
    // const response = await api.post('/auth/login', { email, password, role });
    // const { token, user } = response.data;

    const token = 'mock-token-' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);

    setIsAuthenticated(true);
    setUserRole(role);
    setUser({ email, role });

    return { success: true };
  };

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  /**
   * Context value object
   */
  const value = {
    user,
    isAuthenticated,
    loading,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
