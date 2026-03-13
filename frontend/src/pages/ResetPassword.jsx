import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const email = formData.email.trim();

    if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      nextErrors.otp = 'OTP must contain exactly 6 digits.';
    }

    if (!strongPasswordPattern.test(formData.newPassword)) {
      nextErrors.newPassword = 'Use 8+ chars with upper, lower, number, and symbol.';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email: formData.email.trim(),
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      toast.success(response.data.message || 'Password reset successful');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      setErrors((prev) => ({ ...prev, general: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Enter the OTP sent to your email and create a new password.
        </p>

        <form onSubmit={handleSubmit}>
          {errors.general && <div className="form-error-banner">{errors.general}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              required
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                });
                setErrors((prev) => ({ ...prev, otp: '', general: '' }));
              }}
              maxLength={6}
              required
              className={`otp-input ${errors.otp ? 'input-error' : ''}`}
            />
            {errors.otp && <p className="field-error">{errors.otp}</p>}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'input-error' : ''}
              required
            />
            {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              required
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link-btn">Back to Login</Link>
          <Link to="/forgot-password" className="auth-link-btn">Resend OTP</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
