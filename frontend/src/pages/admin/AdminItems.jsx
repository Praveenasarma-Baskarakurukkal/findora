import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import MobileWarning from '../../components/MobileWarning';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_HOST = VITE_API_URL.replace('/api', '');

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobile);
    loadItems(0);
  }, []);

  const loadItems = async (p = 0) => {
    try {
      setLoading(true);
      const res = await adminAPI.getItems({ page: p, size: 20 });
      setItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const { itemsAPI } = await import('../../services/api');
      await itemsAPI.delete(id);
      toast.success('Item deleted');
      loadItems(page);
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { itemsAPI } = await import('../../services/api');
      await itemsAPI.updateStatus(id, status);
      toast.success('Status updated');
      loadItems(page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isMobile) return <MobileWarning userRole="admin" />;
  if (loading) return <div className="loading">Loading...</div>;

  const filtered = items.filter(i =>
    (!filter.type || i.type === filter.type) &&
    (!filter.status || i.status === filter.status)
  );

  const statusBadge = (s) => {
    const map = { active: 'badge-success', claimed: 'badge-info', closed: 'badge-secondary' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  const typeBadge = (t) => (
    <span className={`badge ${t === 'lost' ? 'badge-warning' : 'badge-info'}`}>{t}</span>
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Items</h1>
        <Link to="/admin/dashboard" className="btn-small btn-secondary">← Back to Dashboard</Link>
      </div>

      <div className="filter-bar" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Location</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>No items found</td></tr>
            )}
            {filtered.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image_url
                    ? <img src={`${API_HOST}${item.image_url}`} alt={item.item_name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                    : <span style={{ color: '#aaa' }}>—</span>}
                </td>
                <td>{item.item_name}</td>
                <td>{typeBadge(item.type)}</td>
                <td>{item.category}</td>
                <td>{statusBadge(item.status)}</td>
                <td>{item.location}</td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</td>
                <td className="action-buttons">
                  {item.status !== 'closed' && (
                    <button onClick={() => handleStatusChange(item.id, 'closed')}
                      className="btn-small btn-warning">Close</button>
                  )}
                  <button onClick={() => handleDelete(item.id)}
                    className="btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => loadItems(page - 1)}>Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => loadItems(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminItems;
