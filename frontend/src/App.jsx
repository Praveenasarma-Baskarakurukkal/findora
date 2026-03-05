/**
 * Main App Component
 * 
 * This is the root component of the application.
 * It sets up:
 * - React Router for client-side routing
 * - Route configuration with protected routes
 * - Layout wrapper (MainLayout) for authenticated pages
 * - AuthProvider for global authentication state
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Import pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Home from './pages/Home/Home';
import Student from './pages/Student/Student';
import Security from './pages/Security/Security';
import Admin from './pages/Admin/Admin';

// Import styles
import './App.css';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * If user is not authenticated, redirects to login
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child component to render
 * @returns {React.ReactElement} Protected route
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * App Component
 * Configures all routes and layout structure
 * 
 * Route Structure:
 * - /login - Login page (no layout)
 * - /signup - Signup page (no layout)
 * - /home - Home page (with MainLayout)
 * - /student - Student dashboard (with MainLayout)
 * - /security - Security dashboard (with MainLayout)
 * - /admin - Admin dashboard (with MainLayout)
 * 
 * TODOs for future implementation:
 * - Add Profile page
 * - Add Settings page
 * - Add Lost page
 * - Add Found page
 * - Add Post page
 * - Add error pages (404, 500)
 * - Add loader/skeleton screens
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes - With MainLayout */}
          {/* Home Page */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Student />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Security Staff Dashboard */}
          <Route
            path="/security"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Security />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Admin />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route - Redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all - 404 (TODO: Create NotFound page) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
