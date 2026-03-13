import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import MobileWarning from '../../components/MobileWarning';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobile);
    loadReports(0);
  }, []);

  const loadReports = async (p = 0) => {
    try {
      setLoading(true);
      const res = await adminAPI.getReports({ page: p, size: 20 });
      setReports(res.data.reports || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (id, status, adminNotes = '') => {
    try {
      await adminAPI.handleReport(id, { status, admin_notes: adminNotes });
      toast.success('Report updated');
      loadReports(page);
    } catch {
      toast.error('Failed to update report');
    }
  };

  if (isMobile) return <MobileWarning userRole="admin" />;
  if (loading) return <div className="loading">Loading...</div>;

  const statusBadge = (s) => {
    const map = { pending: 'badge-warning', reviewed: 'badge-info', resolved: 'badge-success' };
    return <span className={`badge ${map[s] || 'badge-secondary'}`}>{s}</span>;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Content Reports</h1>
        <Link to="/admin/dashboard" className="btn-small btn-secondary">← Back to Dashboard</Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item ID</th>
              <th>Reporter</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Reported At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No reports found</td></tr>
            )}
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.item_id}</td>
                <td>{r.reporter_id}</td>
                <td style={{ maxWidth: 200 }}>{r.reason}</td>
                <td>{statusBadge(r.status)}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</td>
                <td className="action-buttons">
                  {r.status === 'pending' && (
                    <button onClick={() => handleUpdateReport(r.id, 'reviewed')}
                      className="btn-small btn-info">Mark Reviewed</button>
                  )}
                  {r.status !== 'resolved' && (
                    <button onClick={() => handleUpdateReport(r.id, 'resolved')}
                      className="btn-small btn-success">Resolve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => loadReports(page - 1)}>Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => loadReports(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
