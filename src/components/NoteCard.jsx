import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { apiClient } from '../services/api';
import { FileText, Download, Calendar, ArrowDownToLine, Trash2 } from 'lucide-react';

export const NoteCard = ({ note, onDeleted, onRequireAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(note.downloads || 0);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const uploaderName = note.uploader?.name || 'Student';
  const uploaderPrn = note.uploader?.prn ? `PRN: ${note.uploader.prn}` : 'Student';
  const initials = uploaderName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isOwner = user && (user.id === note.uploaded_by || user.role === 'admin');

  const handleDownload = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in or register to download notes.', 'warning');
      onRequireAuth('login');
      return;
    }

    setDownloading(true);
    try {
      const res = await apiClient.get(`/notes/${note.id}/download`);
      const downloadUrl = res?.data?.download_url;

      if (downloadUrl) {
        // Trigger browser download via clean anchor
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        setDownloadCount((prev) => prev + 1);
        showToast('PDF download has started!', 'success');
      } else {
        throw new Error('Download URL could not be generated.');
      }
    } catch (err) {
      showToast(err.message || 'Download failed.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this note?')) {
      return;
    }

    try {
      await apiClient.delete(`/notes/${note.id}`);
      showToast('Note deleted successfully.', 'success');
      if (onDeleted) onDeleted(note.id);
    } catch (err) {
      showToast(err.message || 'Failed to delete note.', 'error');
    }
  };

  return (
    <div className="note-card">
      <div className="note-card-top">
        <div className="badge-row">
          <span className="sem-badge" data-sem={note.semester}>
            Sem {note.semester}
          </span>
          <span className="subject-badge" title={note.subject?.name || 'General'}>
            {note.subject?.name || 'General'}
          </span>
        </div>
        <span className="pdf-format-chip">
          <FileText size={12} />
          PDF
        </span>
      </div>

      <div className="note-card-body">
        <h3 className="note-title" title={note.title}>
          {note.title}
        </h3>
        <p className="note-desc">{note.description || 'No additional description provided.'}</p>

        <div className="note-meta-row">
          <span className="note-meta-item">
            <Calendar size={13} />
            {formatDate(note.created_at)}
          </span>
          <span className="note-meta-item">
            <ArrowDownToLine size={13} />
            {downloadCount} downloads
          </span>
          <span className="note-meta-item">{formatBytes(note.file_size)}</span>
        </div>
      </div>

      <div className="note-card-bottom">
        <div className="uploader-chip" title={`${uploaderName} (${uploaderPrn})`}>
          <div className="uploader-avatar">{initials}</div>
          <div className="uploader-meta">
            <span className="uploader-name">{uploaderName}</span>
            <span className="uploader-prn">{uploaderPrn}</span>
          </div>
        </div>

        <div className="card-actions">
          {isOwner && (
            <button
              className="btn btn-ghost btn-sm btn-icon-only btn-danger"
              onClick={handleDelete}
              title="Delete Note"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={14} />
            {downloading ? 'Preparing...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};
