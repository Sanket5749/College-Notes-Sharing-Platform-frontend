import React from 'react';
import { ALLOWED_BRANCHES } from '../constants/branches';
import { Layers } from 'lucide-react';

export const BranchFilter = ({
  selectedBranch,
  onSelectBranch,
  isAuthenticated,
  onRequireAuth,
}) => {
  const handleClick = (branchCode) => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('login');
      return;
    }
    onSelectBranch(branchCode);
  };

  return (
    <section className="pt-2 pb-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Engineering Branch (9 Supported)</span>
        </div>
        {selectedBranch && (
          <button
            onClick={() => handleClick('')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition cursor-pointer"
          >
            Clear branch filter
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start">
        {/* All Branches Option */}
        <button
          className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 ${
            !selectedBranch
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/25 border border-transparent'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
          }`}
          onClick={() => handleClick('')}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>All Branches</span>
        </button>

        {/* 9 Allowed Branches */}
        {ALLOWED_BRANCHES.map((b) => {
          const isActive = selectedBranch === b.code || selectedBranch === b.name;
          return (
            <button
              key={b.id}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/30 border-indigo-400 ring-2 ring-indigo-400/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
              onClick={() => handleClick(b.code)}
              title={b.description}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {b.code}
              </span>
              <span>{b.shortName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
