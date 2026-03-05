/**
 * Home Page
 * 
 * Dashboard/Home page for authenticated users
 * This page uses MainLayout to display navbar and sidebar
 */

function Home() {
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userRole = localStorage.getItem('userRole') || 'student';

  return (
    <div className="home-container">
      <h1>Welcome to Findora! 👋</h1>
      <p className="home-subtitle">Lost and Found Management System</p>

      <div className="welcome-card">
        <h2>Hello, {userEmail}</h2>
        <p>You are logged in as a <strong>{userRole.toUpperCase()}</strong></p>
        <p>Use the sidebar to navigate through different features of the application.</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Report Lost Items</h3>
          <p>Report items you've lost</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Found Items</h3>
          <p>Browse found items in the database</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Track Claims</h3>
          <p>Monitor your claims and requests</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>My Profile</h3>
          <p>Manage your profile information</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
