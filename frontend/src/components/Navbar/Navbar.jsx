/**
 * Navbar Component
 * 
 * Displays the top navigation bar with:
 * - Logo / App name (left side)
 * - Search bar (center)
 * - Notification icon
 * - User profile icon
 * - Logout button (right side)
 * 
 * Props:
 * - onToggleSidebar: Function to toggle sidebar visibility
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component
 * @param {Object} props - Component props
 * @param {Function} props.onToggleSidebar - Callback function to toggle sidebar
 * @returns {React.ReactElement} The navbar component
 */
function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data or call logout API
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <nav className="navbar">
      {/* Left Section - Logo and Menu Toggle */}
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar} title="Toggle Sidebar">
          ☰
        </button>
        <div className="navbar-logo">
          <span className="logo-text">🔍 Findora</span>
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="navbar-center">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search items..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>

      {/* Right Section - Notifications, Profile, Logout */}
      <div className="navbar-right">
        {/* Notification Icon */}
        <div className="navbar-item notification-container">
          <button
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            🔔
            <span className="notification-badge">3</span>
          </button>

          {/* Notification Dropdown (Optional) */}
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-item">New item found</div>
              <div className="notification-item">Item claimed</div>
              <div className="notification-item">Message received</div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="navbar-item profile-container">
          <button
            className="profile-icon"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Profile"
          >
            👤
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="profile-dropdown">
              <a href="/profile" className="dropdown-item">My Profile</a>
              <a href="/settings" className="dropdown-item">Settings</a>
              <hr className="dropdown-divider" />
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
