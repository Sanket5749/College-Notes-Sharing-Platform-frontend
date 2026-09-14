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
