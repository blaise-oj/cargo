import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaSignInAlt } from 'react-icons/fa';
import jet3 from "../../assets/jet3.png";
import '../../assets/AuthForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!formData.acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    console.log('Registration data:', formData);
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${jet3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-card small-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to access premium air cargo services</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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
                placeholder="Create password"
                required
                minLength="6"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              I agree to the{" "}
              <a href="#terms" className="inline-link">Terms and Conditions</a> and{" "}
              <a href="#privacy" className="inline-link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-divider">
          <span>Or</span>
        </div>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <a href="/login" className="auth-link">
            <FaSignInAlt className="link-icon" />
            Sign in to your account
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
