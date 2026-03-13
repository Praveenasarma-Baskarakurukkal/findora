import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._-]{3,30}$/;
const fullNamePattern = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;
const phonePattern = /^[+]?[-()\d\s]{7,20}$/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'student',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const fullName = formData.full_name.trim();
    const username = formData.username.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const allowedRoles = ['student', 'staff', 'security', 'admin'];

    if (!fullNamePattern.test(fullName)) {
      nextErrors.full_name = 'Enter a valid full name (2-60 characters).';
    }

    if (!usernamePattern.test(username)) {
      nextErrors.username = 'Username must be 3-30 characters and can include ., _, -';
    }

    if (!emailPattern.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (phone && !phonePattern.test(phone)) {
      nextErrors.phone = 'Enter a valid phone number.';
    }

    if (!allowedRoles.includes(formData.role)) {
      nextErrors.role = 'Please select a valid role.';
    }

    if (!strongPasswordPattern.test(password)) {
      nextErrors.password = 'Use 8+ chars with upper, lower, number, and symbol.';
    }

    if (confirmPassword !== password) {
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

    const { confirmPassword, ...registrationData } = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim(),
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim()
    };
    const result = await register(registrationData);

    if (result.success) {
      navigate('/dashboard');
    } else if (result.message) {
      setErrors((prev) => ({ ...prev, general: result.message }));
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          {errors.general && <div className="form-error-banner">{errors.general}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className={errors.full_name ? 'input-error' : ''}
              placeholder="Enter full name"
            />
            {errors.full_name && <p className="field-error">{errors.full_name}</p>}
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={errors.username ? 'input-error' : ''}
              placeholder="Choose a username"
            />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Phone Number <span style={{ color: '#9CA3AF' }}>(Optional - for contact only)</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
              placeholder="Contact number (not used for OTP)"
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required className={errors.role ? 'input-error' : ''}>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="security">Security Officer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="field-error">{errors.role}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? 'input-error' : ''}
              placeholder="Min 8 chars with upper, lower, number, symbol"
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link-btn">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
