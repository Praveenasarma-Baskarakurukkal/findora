/**
 * MainLayout Component
 * 
 * This is a reusable layout component that wraps pages with:
 * - Navbar at the top
 * - Sidebar on the left
 * - Content area for page content
 * 
 * Usage: Wrap page components with MainLayout to get consistent layout across the app
 */

import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

/**
 * MainLayout Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered
 * @returns {React.ReactElement} The layout structure with navbar, sidebar, and content area
 */
function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="main-layout">
      {/* Top Navigation Bar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="layout-container">
        {/* Left Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content Area */}
        <main className={`content-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
