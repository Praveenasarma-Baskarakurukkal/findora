/**
 * Sidebar Component
 * 
 * Displays the left sidebar with navigation links based on user role.
 * 
 * Supported Roles:
 * - student: Home, Post, Lost, Found, Profile, Settings, Logout
 * - security: Home, Receive, Release, History, Post, Profile, Settings, Logout
 * - admin: Home, Lost Reports, Found Reports, Receive, Release, Users, Security Requests, Admin Requests, Settings, Logout
 * 
 * Props:
 * - isOpen: Boolean to control sidebar visibility
 */

import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @returns {React.ReactElement} The sidebar component
 */
function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  
  // Get user role from localStorage (you can replace this with context)
  const userRole = localStorage.getItem('userRole') || 'student';

  /**
   * Navigation items for different user roles
   */
  const navigationLinks = {
    student: [
      { label: 'Home', path: '/home', icon: '🏠' },
      { label: 'Post Item', path: '/post', icon: '📝' },
      { label: 'Lost Items', path: '/lost', icon: '❌' },
      { label: 'Found Items', path: '/found', icon: '✅' },
      { label: 'My Profile', path: '/profile', icon: '👤' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
    ],
    security: [
      { label: 'Home', path: '/home', icon: '🏠' },
      { label: 'Receive Item', path: '/receive', icon: '📥' },
      { label: 'Release Item', path: '/release', icon: '📤' },
      { label: 'History', path: '/history', icon: '📋' },
      { label: 'Post Update', path: '/post', icon: '📝' },
      { label: 'My Profile', path: '/profile', icon: '👤' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
    ],
    admin: [
      { label: 'Home', path: '/home', icon: '🏠' },
      { label: 'Lost Reports', path: '/lost-reports', icon: '📊' },
      { label: 'Found Reports', path: '/found-reports', icon: '📈' },
      { label: 'Receive Item', path: '/receive', icon: '📥' },
      { label: 'Release Item', path: '/release', icon: '📤' },
      { label: 'Manage Users', path: '/users', icon: '👥' },
      { label: 'Security Requests', path: '/security-requests', icon: '🔒' },
      { label: 'Admin Requests', path: '/admin-requests', icon: '📌' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
    ],
  };

  // Get links based on current user role
  const currentLinks = navigationLinks[userRole] || navigationLinks.student;

  /**
   * Handle navigation and close sidebar on mobile
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Sidebar Header with Role Info */}
      <div className="sidebar-header">
        <h3 className="sidebar-title">Menu</h3>
        <span className="user-role-badge">{userRole.toUpperCase()}</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {currentLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleNavigation(link.path)}
                title={link.label}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer with Logout */}
      <div className="sidebar-footer">
        <button
          className="logout-link"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
