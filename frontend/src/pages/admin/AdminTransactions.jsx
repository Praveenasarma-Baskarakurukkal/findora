import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import MobileWarning from '../../components/MobileWarning';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobile);
    loadTransactions(0);
  }, []);

  const loadTransactions = async (p = 0) => {
    try {
      setLoading(true);
      const res = await adminAPI.getTransactions({ page: p, size: 20 });
      setTransactions(res.data.transactions || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(p);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) return <MobileWarning userRole="admin" />;
  if (loading) return <div className="loading">Loading...</div>;

  const typeBadge = (t) => (
    <span className={`badge ${t === 'receive' ? 'badge-info' : 'badge-success'}`}>{t}</span>
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Security Transactions</h1>
        <Link to="/admin/dashboard" className="btn-small btn-secondary">← Back to Dashboard</Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Item ID</th>
              <th>Claim ID</th>
              <th>Officer ID</th>
              <th>Received From</th>
              <th>Released To</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>No transactions recorded yet</td></tr>
            )}
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{typeBadge(tx.transaction_type)}</td>
                <td>{tx.item_id}</td>
                <td>{tx.claim_id || '—'}</td>
                <td>{tx.security_officer_id}</td>
                <td>{tx.received_from || '—'}</td>
                <td>{tx.released_to || '—'}</td>
                <td style={{ maxWidth: 160 }}>{tx.notes || '—'}</td>
                <td>{tx.transaction_date ? new Date(tx.transaction_date).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => loadTransactions(page - 1)}>Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => loadTransactions(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
