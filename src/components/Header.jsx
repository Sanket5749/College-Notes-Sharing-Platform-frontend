import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Upload, LogIn, LogOut, BadgeCheck } from 'lucide-react';

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

  const isUserVerified = Boolean(user?.is_verified || (user?.notes_count && user.notes_count >= 10));

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 font-bold text-lg text-slate-100 hover:opacity-90 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <BookOpen size={20} />
          </div>
          <span className="tracking-tight text-xl font-extrabold">
            Edu<span className="text-gradient">Notes</span>
          </span>
        </div>

        {/* Live Search Bar */}
        <div className="relative hidden md:flex items-center flex-1 max-w-md mx-4">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            placeholder="Search notes by subject, title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Actions & User State */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* User Profile & PRN Badge */}
              <div
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800"
                title={
                  isUserVerified
                    ? `Verified Contributor (${user.notes_count || '10+'} notes shared)`
                    : `Logged in as ${user.name}`
                }
              >
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950">
                    {getInitials(user.name)}
                  </div>
                  {isUserVerified && (
                    <span
                      className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center text-cyan-400"
                      title="Verified Contributor (10+ notes)"
                    >
                      <BadgeCheck size={12} className="fill-cyan-400 text-slate-950" />
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-200 max-w-[110px] truncate">
                      {user.name}
                    </span>
                    {isUserVerified && (
                      <span title="Verified Contributor: Uploaded 10+ study notes">
                        <BadgeCheck size={13} className="text-cyan-400 shrink-0 fill-cyan-400/20" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold leading-tight">
                    {user.prn ? `PRN: ${user.prn}` : user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Upload Note Button */}
              <button
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                onClick={onOpenUpload}
              >
                <Upload size={15} />
                <span>Upload Note</span>
              </button>

              {/* Logout Button */}
              <button
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all cursor-pointer"
                onClick={logout}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
                onClick={() => onOpenAuth('login')}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                onClick={() => onOpenAuth('register')}
              >
                <span>Create Account</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
