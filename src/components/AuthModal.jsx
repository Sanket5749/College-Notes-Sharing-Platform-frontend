import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { X, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state (PRN and Password)
  const [loginPrn, setLoginPrn] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Name, PRN, Role, Password)
  const [regName, setRegName] = useState('');
  const [regPrn, setRegPrn] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');

  if (!isOpen) return null;

  const handlePrnInput = (val, setter) => {
    // Only accept numeric digits up to 9
    const clean = val.replace(/\D/g, '').slice(0, 9);
    setter(clean);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPrn.trim() || !loginPassword) {
      showToast('Please enter your 9-digit PRN and password.', 'warning');
      return;
    }

    if (loginPrn.length !== 9) {
      showToast('PRN must consist of exactly 9 digits.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(loginPrn, loginPassword);
      showToast('Welcome back! You have successfully signed in.', 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your PRN and password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPrn.trim() || !regPassword) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (regPrn.length !== 9) {
      showToast('Please provide an exact 9-digit college PRN.', 'warning');
      return;
    }

    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: regName,
        prn: regPrn,
        password: regPassword,
        role: regRole,
      });
      showToast('Account registered successfully! Welcome to EduNotes.', 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {activeTab === 'login' ? 'Sign In to EduNotes' : 'Create Account'}
          </h3>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Switcher */}
          <div className="modal-tabs">
            <button
              className={`modal-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`modal-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
              type="button"
            >
              Create Account
            </button>
          </div>

          {activeTab === 'login' ? (
            /* Sign In Form (PRN only) */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span>9-Digit PRN *</span>
                  <span
                    className="form-hint prn-counter"
                    style={{
                      color:
                        loginPrn.length === 9
                          ? 'var(--status-success)'
                          : 'var(--accent-cyan)',
                    }}
                  >
                    {loginPrn.length}/9 digits
                  </span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 123456789"
                  value={loginPrn}
                  onChange={(e) => handlePrnInput(e.target.value, setLoginPrn)}
                  maxLength={9}
                  required
                />
                <span className="form-hint">
                  Enter the 9-digit Permanent Registration Number issued by college.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="form-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={loading}
              >
                <LogIn size={18} />
                {loading ? 'Authenticating...' : 'Sign In with PRN'}
              </button>
            </form>
          ) : (
            /* Register Form (Name, PRN, Role, Password) */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Sanket Patil"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>9-Digit PRN *</span>
                  <span
                    className="form-hint prn-counter"
                    style={{
                      color:
                        regPrn.length === 9
                          ? 'var(--status-success)'
                          : 'var(--accent-cyan)',
                    }}
                  >
                    {regPrn.length}/9 digits
                  </span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 123456789"
                  value={regPrn}
                  onChange={(e) => handlePrnInput(e.target.value, setRegPrn)}
                  maxLength={9}
                  required
                />
                <span className="form-hint">
                  Your 9-digit Permanent Registration Number is your unique campus identity.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password * (min. 6 characters)</label>
                <div className="form-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={loading}
              >
                <UserPlus size={18} />
                {loading ? 'Creating Account...' : 'Register with PRN'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
