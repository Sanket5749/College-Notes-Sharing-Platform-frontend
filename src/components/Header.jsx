import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, LogIn, LogOut } from 'lucide-react';

export const Header = ({ onOpenAuth, onOpenUpload, searchQuery, onSearchChange }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-icon">
            <BookOpen size={22} />
          </div>
          <span>
            Edu<span className="text-gradient">Notes</span>
          </span>
        </div>

        {/* Live Search Bar */}
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes by subject, title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Actions & User State */}
        <div className="header-actions">
          {isAuthenticated && user ? (
            <>
              {/* User Profile & PRN Badge */}
              <div className="user-profile-badge" title={`Logged in as ${user.name}`}>
                <div className="user-avatar-circle">{getInitials(user.name)}</div>
                <div className="user-info-text">
                  <span className="user-display-name">{user.name}</span>
                  <span className="user-prn-pill">
                    {user.prn ? `PRN: ${user.prn}` : user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Upload Note Button */}
              <button className="btn btn-primary btn-sm" onClick={onOpenUpload}>
                <Upload size={16} />
                Upload Note
              </button>

              {/* Logout Button */}
              <button className="btn btn-ghost btn-sm btn-icon-only" onClick={logout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onOpenAuth('login')}
              >
                <LogIn size={16} />
                Sign In
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => onOpenAuth('register')}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
