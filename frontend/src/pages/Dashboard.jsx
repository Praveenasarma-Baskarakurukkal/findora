import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { itemsAPI, claimsAPI } from '../services/api';
import PostModal from '../components/PostModal';
import FoundItemCard from '../components/FoundItemCard';
import { normalizeCategory } from '../utils/categoryUtils';
import { FOUND_ITEM_SORT, sortFoundItems } from '../utils/itemDisplayUtils';

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

        setStats({
          myItems: itemsRes.status === 'fulfilled' ? itemsRes.value.data.count : 0,
          myClaims: claimsRes.status === 'fulfilled' ? claimsRes.value.data.count : 0
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
          setFoundItems(sortedFoundItems.slice(0, 6));
        } else {
          console.error('Dashboard found items fetch failed:', foundRes.reason?.response?.data || foundRes.reason?.message);
          setFoundItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setFoundItems([]);
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
          <div>
            <h1>Welcome, {user?.full_name}!</h1>
            <p className="role-badge">Role: {user?.role}</p>
          </div>
          {(user?.role === 'student' || user?.role === 'staff') && (
            <button 
              onClick={() => setIsPostModalOpen(true)} 
              className="btn-primary btn-posts"
            >
              ➕ Posts
            </button>
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
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16A34A' }}>{stats.myItems}</div>
              <div style={{ color: '#6B7280', marginTop: '0.25rem' }}>My Posted Items</div>
              <Link to="/lost-items" style={{ fontSize: '0.85rem', color: '#16A34A', marginTop: '0.5rem', display: 'block' }}>View →</Link>
            </div>
            <div className="stat-card" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>{stats.myClaims}</div>
              <div style={{ color: '#6B7280', marginTop: '0.25rem' }}>My Claims</div>
              <Link to="/my-claims" style={{ fontSize: '0.85rem', color: '#3B82F6', marginTop: '0.5rem', display: 'block' }}>View →</Link>
            </div>
            <div className="stat-card" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>{foundItems.length}</div>
              <div style={{ color: '#6B7280', marginTop: '0.25rem' }}>Found Items Available</div>
              <Link to="/found-items" style={{ fontSize: '0.85rem', color: '#F59E0B', marginTop: '0.5rem', display: 'block' }}>Browse →</Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {(user?.role === 'student' || user?.role === 'staff') && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/report-lost" style={{ flex: 1, minWidth: '200px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#DC2626', fontWeight: '500' }}>
              🔍 Report Lost Item
            </Link>
            <Link to="/report-found" style={{ flex: 1, minWidth: '200px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#16A34A', fontWeight: '500' }}>
              📦 Report Found Item
            </Link>
            <Link to="/found-items" style={{ flex: 1, minWidth: '200px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#3B82F6', fontWeight: '500' }}>
              🗂️ Browse Found Items
            </Link>
          </div>
        )}

        {/* Security quick links */}
        {user?.role === 'security' && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/security/pending-claims" style={{ flex: 1, minWidth: '200px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#EA580C', fontWeight: '500' }}>
              📋 Pending Claims
            </Link>
          </div>
        )}

        {/* Admin quick links */}
        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/admin/dashboard" style={{ flex: 1, minWidth: '200px', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#7C3AED', fontWeight: '500' }}>
              🛡️ Admin Dashboard
            </Link>
            <Link to="/admin/users" style={{ flex: 1, minWidth: '200px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: '#16A34A', fontWeight: '500' }}>
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
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No found items yet</h3>
            <p>When someone reports a found item, it will appear here.</p>
            <Link to="/report-found" style={{ display: 'inline-block', marginTop: '1rem', color: '#16A34A', fontWeight: '500' }}>Be the first to report a found item →</Link>
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
