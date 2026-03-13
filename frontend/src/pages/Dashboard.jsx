import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import PostModal from '../components/PostModal';
import FoundItemCard from '../components/FoundItemCard';
import { normalizeCategory } from '../utils/categoryUtils';
import { FOUND_ITEM_SORT, sortFoundItems } from '../utils/itemDisplayUtils';
import { sampleFoundItems } from '../data/sampleFoundItems';
import { sampleLostItems } from '../data/sampleLostItems';

const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '');

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ myItems: 0, myClaims: 0 });
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (user.role === 'student' || user.role === 'staff') {
        const [itemsRes, claimsRes, foundRes] = await Promise.allSettled([
          itemsAPI.getMy(),
          claimsAPI.getMy(),
          // Dashboard keeps a latest preview, while Found Items page shows complete list.
          itemsAPI.getAll({ type: 'found', status: 'active' })
        ]);

        const myItemsCount = itemsRes.status === 'fulfilled' ? (itemsRes.value.data.count || 0) : 0;
        const myClaimsCount = claimsRes.status === 'fulfilled' ? (claimsRes.value.data.count || 0) : 0;
        setStats({
          myItems: myItemsCount > 0 ? myItemsCount : sampleLostItems.length,
          myClaims: myClaimsCount
        });

        if (foundRes.status === 'fulfilled') {
          console.log('Dashboard found items fetched:', foundRes.value.data.items || []);
          const apiItems = (foundRes.value.data.items || []).map((item) => ({
            ...item,
            name: item.name || item.item_name,
            date_found: item.date_found || item.date || item.created_at,
            image: item.image || (item.image_url ? `${API_HOST}${item.image_url}` : 'https://via.placeholder.com/300x200?text=Item+Image'),
            category: normalizeCategory(item.category, item.name || item.item_name),
            posted_by: item.posted_by || {
              id: item.user_id,
              full_name: item.full_name || item.username || 'Unknown User'
            }
          }));
          const sortedFoundItems = sortFoundItems(apiItems, FOUND_ITEM_SORT.LATEST);
          setFoundItems(sortedFoundItems.length > 0 ? sortedFoundItems.slice(0, 6) : sampleFoundItems.slice(0, 6));
        } else {
          console.error('Dashboard found items fetch failed:', foundRes.reason?.response?.data || foundRes.reason?.message);
          setFoundItems(sampleFoundItems.slice(0, 6));
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setFoundItems(sampleFoundItems.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-top">
          <div className="dashboard-title-block">
            <h1>Welcome, {user?.full_name}!</h1>
            <p className="role-badge">Role: {user?.role}</p>
          </div>
          {(user?.role === 'student' || user?.role === 'staff') && (
            <div className="dashboard-top-actions">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="btn-primary btn-posts"
              >
                + Create Post
              </button>
            </div>
          )}
        </div>

        {!user?.is_verified && (
          <div className="alert alert-warning">
            Your email is not verified. <Link to="/verify-email">Verify now</Link>
          </div>
        )}

        {(user?.role === 'security' || user?.role === 'admin') && !user?.is_approved && (
          <div className="alert alert-info">
            Your account is pending admin approval.
          </div>
        )}

        {/* Stats Cards */}
        {(user?.role === 'student' || user?.role === 'staff') && (
          <div className="stats-grid stats-grid-dashboard">
            <div className="stat-card stat-card-dashboard">
              <div className="stat-value stat-value-green">{stats.myItems}</div>
              <div className="stat-label">My Posted Items</div>
              <Link to="/lost-items" className="stat-link stat-link-green">View →</Link>
            </div>
            <div className="stat-card stat-card-dashboard">
              <div className="stat-value stat-value-blue">{stats.myClaims}</div>
              <div className="stat-label">My Claims</div>
              <Link to="/my-claims" className="stat-link stat-link-blue">View →</Link>
            </div>
            <div className="stat-card stat-card-dashboard">
              <div className="stat-value stat-value-amber">{foundItems.length}</div>
              <div className="stat-label">Found Items Available</div>
              <Link to="/found-items" className="stat-link stat-link-amber">Browse →</Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {(user?.role === 'student' || user?.role === 'staff') && (
          <div className="quick-links-grid">
            <Link to="/report-lost" className="quick-link quick-link-danger">
              🔍 Report Lost Item
            </Link>
            <Link to="/report-found" className="quick-link quick-link-success">
              📦 Report Found Item
            </Link>
            <Link to="/found-items" className="quick-link quick-link-info">
              🗂️ Browse Found Items
            </Link>
          </div>
        )}

        {/* Security quick links */}
        {user?.role === 'security' && (
          <div className="quick-links-grid">
            <Link to="/security/pending-claims" className="quick-link quick-link-amber">
              📋 Pending Claims
            </Link>
          </div>
        )}

        {/* Admin quick links */}
        {user?.role === 'admin' && (
          <div className="quick-links-grid">
            <Link to="/admin/dashboard" className="quick-link quick-link-violet">
              🛡️ Admin Dashboard
            </Link>
            <Link to="/admin/users" className="quick-link quick-link-success">
              👥 Manage Users
            </Link>
          </div>
        )}

        {/* Found Items Feed Section */}
        {(user?.role === 'student' || user?.role === 'staff') && foundItems.length > 0 && (
          <div className="found-items-section">
            <div className="section-header">
              <h2>Recently Found Items</h2>
              <Link to="/found-items" className="link-more">View All →</Link>
            </div>
            <div className="found-items-grid">
              {foundItems.map((item) => (
                <FoundItemCard
                  key={item.id}
                  item={item}
                  onClaim={() => {
                    claimsAPI.create(item.id).then(() => {
                      navigate('/my-claims');
                    }).catch((err) => {
                      console.error('Claim error:', err);
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {(user?.role === 'student' || user?.role === 'staff') && foundItems.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-state-icon">📭</div>
            <h3>No found items yet</h3>
            <p>When someone reports a found item, it will appear here.</p>
            <Link to="/report-found" className="empty-state-link">Be the first to report a found item →</Link>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
