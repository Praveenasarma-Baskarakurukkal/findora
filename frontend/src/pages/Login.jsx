import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._-]{3,30}$/;

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    const identifier = formData.identifier.trim();
    const password = formData.password;

    if (!identifier) {
      nextErrors.identifier = 'Email or username is required.';
    } else if (identifier.includes('@') && !emailPattern.test(identifier)) {
      nextErrors.identifier = 'Enter a valid email address.';
    } else if (!identifier.includes('@') && !usernamePattern.test(identifier)) {
      nextErrors.identifier = 'Username must be 3-30 characters and can include ., _, -';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
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

    const result = await login(formData.identifier.trim(), formData.password);

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
        <h2>Login to Findora</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <div className="form-error-banner">{errors.general}</div>}

          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className={errors.identifier ? 'input-error' : ''}
              placeholder="Enter email or username"
            />
            {errors.identifier && <p className="field-error">{errors.identifier}</p>}
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
              placeholder="Enter password"
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link-btn">Forgot Password?</Link>
          <Link to="/signup" className="auth-link-btn">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
