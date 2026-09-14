import React from 'react';
import { Search, Sparkles, Upload } from 'lucide-react';

export const Hero = ({
  onOpenUpload,
  searchQuery,
  onSearchChange,
  totalNotes,
  isAuthenticated,
  onRequireAuth,
}) => {
  return (
    <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
      <div>
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <Sparkles size={14} />
          <span>College Notes Exchange Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15] mb-5">
          Share, Discover & Ace <br />
          <span className="text-gradient">Every Semester Exam</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Access high-yield peer notes, syllabus lecture summaries, and study resources verified by your college peers. Authenticate seamlessly with your college-issued 9-digit PRN.
        </p>

        {/* Hero Search Box */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 shadow-xl shadow-black/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-sm sm:text-base transition-all"
            placeholder={
              isAuthenticated
                ? 'Search by topic, subject name, or module keyword...'
                : 'Sign in with your 9-digit PRN to search notes...'
            }
            value={searchQuery}
            onChange={(e) => {
              if (!isAuthenticated && onRequireAuth) {
                onRequireAuth('login');
                return;
              }
              onSearchChange(e.target.value);
            }}
            onClick={() => {
              if (!isAuthenticated && onRequireAuth) {
                onRequireAuth('login');
              }
            }}
          />
        </div>

        {/* Quick Stats Counter */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-slate-800/60">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-gradient">
              {isAuthenticated ? (totalNotes || '0') : 'Protected'}
            </span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">
              {isAuthenticated ? 'Notes Available' : 'Student Access Only'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-gradient-cyan">8 Semesters</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Full Coverage</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400">100%</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Verified PDF Files</span>
          </div>

          <div className="sm:ml-4">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
              onClick={onOpenUpload}
            >
              <Upload size={16} />
              <span>Share Your Notes</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
