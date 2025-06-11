import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function AuthPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = isRegistering
        ? await register(formData)
        : await login({ email: formData.email, password: formData.password });

      onAuthSuccess(response);       // Update parent state
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/what.png" alt="Notick Logo" className="auth-logo" />
          <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="auth-subtitle">
            {isRegistering 
              ? 'Join us and start your journey' 
              : 'Sign in to continue your journey'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
            />
          </div>
          
          {error && <p className="auth-error">{error}</p>}
          
          <button type="submit" className="auth-button">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="auth-switch"
            >
              {isRegistering ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
