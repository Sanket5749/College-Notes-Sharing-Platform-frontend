import React from 'react';
import { NoteCard } from './NoteCard';
import { BookOpen, FolderOpen, Lock, LogIn, UserPlus } from 'lucide-react';

export const NotesGrid = ({
  notes,
  loading,
  isAuthenticated,
  subjects,
  selectedSubject,
  onSelectSubject,
  onDeleted,
  onOpenUpload,
  onRequireAuth,
}) => {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Explore Study Notes
            </h2>
            {isAuthenticated ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                {notes.length} note{notes.length === 1 ? '' : 's'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                <Lock size={12} />
                Access Restricted
              </span>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <select
                className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                value={selectedSubject}
                onChange={(e) => onSelectSubject(e.target.value)}
              >
                <option value="">All Academic Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (Sem {sub.semester})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          <div className="text-center py-16 px-6 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col items-center gap-6">
            <div className="absolute -top-24 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xl shadow-indigo-500/25 animate-pulse">
              <Lock size={38} />
            </div>

            <div className="max-w-xl flex flex-col items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                College Notes Are Protected
              </h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                To maintain academic integrity and prevent unauthorized access, all study notes, lecture summaries, and PDF documents are strictly reserved for verified college students.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Please sign in with your 9-digit college PRN to view, search, and download study notes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => onRequireAuth('login')}
                >
                  <LogIn size={16} />
                  <span>Sign In with PRN</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => onRequireAuth('register')}
                >
                  <UserPlus size={16} />
                  <span>Create Student Account</span>
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-shimmer"
              ></div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center">
              <FolderOpen size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-200">No study notes found</h3>
            <p className="text-sm text-slate-400 max-w-md">
              There are no notes matching your active semester or search filter. Share your notes to help fellow students!
            </p>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer mt-2"
              onClick={onOpenUpload}
            >
              <BookOpen size={16} />
              <span>Upload First Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDeleted={onDeleted}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

