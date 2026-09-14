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
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <h3 className="text-xl font-bold text-slate-100">
            {activeTab === 'login' ? 'Sign In to EduNotes' : 'Create Account'}
          </h3>
          <button
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="pt-6">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setActiveTab('register')}
              type="button"
            >
              Create Account
            </button>
          </div>

          {activeTab === 'login' ? (
            /* Sign In Form (PRN only) */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">9-Digit PRN *</label>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      loginPrn.length === 9 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {loginPrn.length}/9 digits
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. 123456789"
                  value={loginPrn}
                  onChange={(e) => handlePrnInput(e.target.value, setLoginPrn)}
                  maxLength={9}
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Enter the 9-digit Permanent Registration Number issued by college.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                <LogIn size={18} />
                <span>{loading ? 'Authenticating...' : 'Sign In with PRN'}</span>
              </button>
            </form>
          ) : (
            /* Register Form (Name, PRN, Role, Password) */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name *</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="Sanket Patil"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">9-Digit PRN *</label>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      regPrn.length === 9 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {regPrn.length}/9 digits
                  </span>
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. 123456789"
                  value={regPrn}
                  onChange={(e) => handlePrnInput(e.target.value, setRegPrn)}
                  maxLength={9}
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Your 9-digit Permanent Registration Number is your unique campus identity.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Role</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Password * (min. 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                <UserPlus size={18} />
                <span>{loading ? 'Creating Account...' : 'Register with PRN'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
