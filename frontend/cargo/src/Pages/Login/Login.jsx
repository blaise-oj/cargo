import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import jet3 from "../../assets/jet3.png";   // ✅ Import your hero image
import '../../assets/AuthForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Handle login logic here
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${jet3})`,  // ✅ Add hero image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-card small-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot-password" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-divider">
          <span>Or</span>
        </div>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <a href="/register" className="auth-link">
            <FaUserPlus className="link-icon" />
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
