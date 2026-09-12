import React, { useState, useRef } from 'react';
import { useToast } from './Toast';
import { apiClient } from '../services/api';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export const UploadModal = ({ isOpen, onClose, subjects, onUploaded }) => {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('1');
  const [subjectId, setSubjectId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const filteredSubjects = subjects.filter((s) => !semester || String(s.semester) === String(semester));

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      showToast('Please upload a PDF document (.pdf).', 'error');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast('File size must not exceed 10MB.', 'error');
      return;
    }

    setFile(selectedFile);
    if (!title) {
      // Pre-fill title from clean filename
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast('Please select a PDF file to upload.', 'warning');
      return;
    }

    if (!title.trim() || !semester || !subjectId) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('semester', semester);
      formData.append('subject_id', subjectId);

      await apiClient.upload('/notes/upload', formData);
      showToast('Study note uploaded and published successfully!', 'success');

      // Reset
      setFile(null);
      setTitle('');
      setDescription('');
      setSubjectId('');
      onClose();
      if (onUploaded) onUploaded();
    } catch (err) {
      showToast(err.message || 'Failed to upload note.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Share Study Notes</h3>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Drag and Drop Zone */}
          <div className="form-group">
            <label className="form-label">Upload PDF Document *</label>
            <div
              className={`dropzone ${isDragOver ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer?.files?.[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="dropzone-icon">
                <UploadCloud size={24} />
              </div>
              <span className="dropzone-text">
                {file ? 'Replace selected PDF' : 'Click to browse or drag & drop PDF'}
              </span>
              <span className="dropzone-subtext">Max file size: 10 MB (Strictly PDF)</span>
            </div>

            {/* File Preview Box */}
            {file && (
              <div className="file-preview-box">
                <div className="file-preview-info">
                  <FileText size={20} color="#F87171" />
                  <div>
                    <div className="file-preview-name">{file.name}</div>
                    <div className="file-preview-size">{formatBytes(file.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-icon-only"
                  onClick={() => setFile(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Note Title */}
          <div className="form-group">
            <label className="form-label">Note Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Unit 3 Trees & Graphs Comprehensive Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Semester & Subject Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Semester *</label>
              <select
                className="form-input"
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setSubjectId('');
                }}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select
                className="form-input"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Select subject...</option>
                {filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Brief summary of syllabus chapters, professor notes, or important topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={uploading}
          >
            <CheckCircle2 size={18} />
            {uploading ? 'Uploading to Supabase Storage...' : 'Publish Note'}
          </button>
        </form>
      </div>
    </div>
  );
};
