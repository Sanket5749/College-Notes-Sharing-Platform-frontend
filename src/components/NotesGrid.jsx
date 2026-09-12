import React from 'react';
import { NoteCard } from './NoteCard';
import { BookOpen, FolderOpen } from 'lucide-react';

export const NotesGrid = ({
  notes,
  loading,
  subjects,
  selectedSubject,
  onSelectSubject,
  onDeleted,
  onOpenUpload,
  onRequireAuth,
}) => {
  return (
    <section className="notes-section">
      <div className="container">
        {/* Toolbar */}
        <div className="section-toolbar">
          <div className="toolbar-title-wrap">
            <h2>Explore Study Notes</h2>
            <span className="notes-count-badge">
              {notes.length} note{notes.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="toolbar-filters">
            <select
              className="filter-select"
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
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="notes-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderOpen size={36} />
            </div>
            <h3>No study notes found</h3>
            <p>
              There are no notes matching your active semester or search filter. Share your notes to help fellow students!
            </p>
            <button className="btn btn-primary btn-sm" onClick={onOpenUpload}>
              <BookOpen size={16} />
              Upload First Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
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
