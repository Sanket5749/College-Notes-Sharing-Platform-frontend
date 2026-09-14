import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { apiClient } from '../services/api';
import { FileText, Download, Calendar, ArrowDownToLine, Trash2, BadgeCheck } from 'lucide-react';
import { getBranchBadgeDetails } from '../constants/branches';

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

  const uploader = note.uploader || note.users || {};
  const uploaderName = uploader.name || 'Student';
  const uploaderPrn = uploader.prn ? `PRN: ${uploader.prn}` : 'Student';
  const isVerified = Boolean(uploader.is_verified || (uploader.notes_count && uploader.notes_count >= 10));
  const initials = uploaderName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isOwner = user && (user.id === note.uploaded_by || user.role === 'admin');

  const subjectObj = note.subjects || note.subject || {};
  const departmentName = subjectObj.department || '';
  const branchBadge = getBranchBadgeDetails(departmentName);

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

  const getSemColor = (sem) => {
    switch (Number(sem)) {
      case 1: return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 2: return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 3: return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 4: return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 5: return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 6: return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 7: return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 8: return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/70 border border-slate-800/90 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 overflow-hidden flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSemColor(
                note.semester
              )}`}
            >
              Sem {note.semester}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${branchBadge.badgeClass}`}
              title={departmentName || branchBadge.shortName}
            >
              {branchBadge.code}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 truncate max-w-[130px]"
              title={subjectObj.name || 'General'}
            >
              {subjectObj.name || 'General'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 shrink-0">
            <FileText size={12} />
            PDF
          </span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3
            className="text-base sm:text-lg font-bold text-slate-100 line-clamp-2 mb-2 hover:text-indigo-300 transition-colors"
            title={note.title}
          >
            {note.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {note.description || 'No additional description provided.'}
          </p>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-4 text-xs text-slate-400 py-3 border-t border-slate-800/60 mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-500" />
            {formatDate(note.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ArrowDownToLine size={13} className="text-slate-500" />
            {downloadCount} downloads
          </span>
          <span className="ml-auto text-slate-500 font-mono">{formatBytes(note.file_size)}</span>
        </div>
      </div>

      {/* Card Bottom */}
      <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-800/80">
        <div
          className="flex items-center gap-2.5 overflow-hidden"
          title={
            isVerified
              ? `${uploaderName} • Verified Contributor (${uploader.notes_count || '10+'} notes contributed)`
              : `${uploaderName} (${uploaderPrn})`
          }
        >
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
              {initials}
            </div>
            {isVerified && (
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center text-cyan-400"
                title="Verified Contributor (10+ Notes)"
              >
                <BadgeCheck size={12} className="fill-cyan-400 text-slate-950" />
              </span>
            )}
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                {uploaderName}
              </span>
              {isVerified && (
                <span title={`Verified Contributor: ${uploader.notes_count || '10+'} notes shared`}>
                  <BadgeCheck size={13} className="text-cyan-400 shrink-0 fill-cyan-400/20" />
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold truncate leading-tight">
              {uploaderPrn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOwner && (
            <button
              className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              onClick={handleDelete}
              title="Delete Note"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={14} />
            <span>{downloading ? 'Preparing...' : 'Download'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
