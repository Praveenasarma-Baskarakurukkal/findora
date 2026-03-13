import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimsAPI } from '../services/api';
import './MyClaims.css';
import { sampleClaims } from '../data/sampleClaims';

const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '');

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const response = await claimsAPI.getMy();
      const claimsData = response.data.claims || [];
      setClaims(claimsData.length > 0 ? claimsData : sampleClaims);
      console.log('Claims loaded:', claimsData); // Debug log
    } catch (error) {
      console.error('Error loading claims:', error);
      setClaims(sampleClaims);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-shell my-claims-page">
        <div className="page-header">
          <div className="page-title-group">
            <h1>My Claims</h1>
            <p className="page-subtitle">Track claim approvals, OTP details, and item collection status.</p>
          </div>
        </div>
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="container page-shell my-claims-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Claims</h1>
          <p className="page-subtitle">Track claim approvals, OTP details, and item collection status.</p>
        </div>
        <div className="page-actions">
          <Link to="/found-items" className="btn-secondary page-action-btn">Browse Found Items</Link>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="empty-panel claims-empty">
          <div className="empty-panel-icon">🏷️</div>
          <h3>No Claims Yet</h3>
          <p>You have not made any claims yet.</p>
          <Link to="/found-items" className="empty-panel-action">Find Items to Claim</Link>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map(claim => (
            <div key={claim.id} className="claim-card">
              {claim.image_url && (
                <img src={`${API_HOST}${claim.image_url}`} alt={claim.item_name} />
              )}
              <div className="claim-details">
                <h3>{claim.item_name || 'Unknown Item'}</h3>
                <p><strong>Category:</strong> {claim.category || 'N/A'}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${(claim.status || 'pending').toLowerCase()}`}>{claim.status ? claim.status.toUpperCase() : 'PENDING'}</span></p>
                <p><strong>Claimed on:</strong> {claim.claimed_at ? new Date(claim.claimed_at).toLocaleString() : 'N/A'}</p>
                
                {(!claim.status || claim.status === 'pending') && (
                  <div className="otp-info">
                    <p><strong>Your OTP:</strong> <code>{claim.otp || 'N/A'}</code></p>
                    <p>Please provide this OTP to the security officer to collect your item.</p>
                    <p><small>OTP expires on: {claim.otp_expiry ? new Date(claim.otp_expiry).toLocaleString() : 'N/A'}</small></p>
                  </div>
                )}

                {claim.status === 'collected' && (
                  <p className="success-msg">✓ Item collected on {claim.collected_at ? new Date(claim.collected_at).toLocaleString() : 'N/A'}</p>
                )}

                {claim.status === 'approved' && (
                  <p className="success-msg">✓ Claim approved! Please visit security office with your OTP.</p>
                )}

                {claim.status === 'rejected' && (
                  <p className="reject-msg">✗ Claim rejected. Please contact security for details.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
