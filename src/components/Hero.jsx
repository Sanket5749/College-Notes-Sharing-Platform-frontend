import React from 'react';
import { Search, Sparkles, Upload } from 'lucide-react';

export const Hero = ({ onOpenUpload, searchQuery, onSearchChange, totalNotes }) => {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Animated Badge */}
        <div className="hero-tag">
          <span className="hero-tag-pulse"></span>
          <Sparkles size={14} />
          <span>College Notes Exchange Platform</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          Share, Discover & Ace <br />
          <span className="text-gradient">Every Semester Exam</span>
        </h1>

        <p className="hero-subtitle">
          Access high-yield peer notes, syllabus lecture summaries, and study resources verified by your college peers. Authenticate seamlessly with your college-issued 9-digit PRN.
        </p>

        {/* Hero Search Box */}
        <div className="hero-search-wrap">
          <Search size={20} className="hero-search-icon" />
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search by topic, subject name, or module keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Quick Stats Counter */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value text-gradient">{totalNotes || '100+'}</span>
            <span className="stat-label">Notes Published</span>
          </div>

          <div className="stat-item">
            <span className="stat-value text-gradient-cyan">8 Semesters</span>
            <span className="stat-label">Full Coverage</span>
          </div>

          <div className="stat-item">
            <span className="stat-value" style={{ color: '#10B981' }}>100%</span>
            <span className="stat-label">Verified PDF Files</span>
          </div>

          <div className="stat-item" style={{ marginLeft: '1rem' }}>
            <button className="btn btn-primary" onClick={onOpenUpload}>
              <Upload size={18} />
              Share Your Notes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
