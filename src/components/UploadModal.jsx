import React, { useState, useRef } from 'react';
import { useToast } from './Toast';
import { apiClient } from '../services/api';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { ALLOWED_BRANCHES, SEMESTERS, getBranchInfo } from '../constants/branches';

export const UploadModal = ({ isOpen, onClose, subjects, onUploaded }) => {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(ALLOWED_BRANCHES[0].name);
  const [semester, setSemester] = useState('1');
  const [subjectId, setSubjectId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const branchObj = getBranchInfo(selectedBranch) || ALLOWED_BRANCHES[0];
  const targetBranchName = branchObj.name;
  const parsedSemester = parseInt(semester, 10);

  const filteredSubjects = subjects.filter((s) => {
    // 1. Check semester
    if (semester && String(s.semester) !== String(semester)) return false;

    // 2. For Semesters 1 and 2, include Common Engineering + Branch subjects
    if (parsedSemester <= 2) {
      return (
        s.department === 'Common Engineering' ||
        s.department === targetBranchName ||
        (s.department && s.department.toLowerCase().includes(branchObj.code.toLowerCase()))
      );
    }

    // 3. Semesters 3-8: strictly branch subjects
    return (
      s.department === targetBranchName ||
      (s.department && s.department.toLowerCase().includes(branchObj.code.toLowerCase()))
    );
  });

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
      showToast('Please complete all required fields (Title, Branch, Semester, Subject).', 'warning');
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
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        <form className="pt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Drag and Drop Zone */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Upload PDF Document *
            </label>
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/60 hover:bg-slate-950/80'
              }`}
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
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <UploadCloud size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-200">
                {file ? 'Replace selected PDF' : 'Click to browse or drag & drop PDF'}
              </span>
              <span className="text-xs text-slate-500">Max file size: 10 MB (Strictly PDF)</span>
            </div>

            {/* File Preview Box */}
            {file && (
              <div className="flex items-center justify-between gap-3 p-3 mt-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={20} className="text-red-400 shrink-0" />
                  <div className="overflow-hidden text-left">
                    <div className="text-xs font-semibold text-slate-200 truncate">{file.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{formatBytes(file.size)}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
                  onClick={() => setFile(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Note Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Note Title *</label>
            <input
              type="text"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Unit 3 Trees & Graphs Comprehensive Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Branch Selector (9 Engineering Streams) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Engineering Branch (9 Branches Supported) *
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSubjectId('');
              }}
              required
            >
              {ALLOWED_BRANCHES.map((b) => (
                <option key={b.id} value={b.name}>
                  [{b.code}] {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester & Subject Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Semester (1-8) *</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setSubjectId('');
                }}
                required
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Subject *</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Select subject...</option>
                {filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.department === 'Common Engineering' ? '(FE Common)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-y"
              placeholder="Brief summary of syllabus chapters, professor notes, or important topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            disabled={uploading}
          >
            <CheckCircle2 size={18} />
            <span>{uploading ? 'Uploading to Supabase Storage...' : 'Publish Note'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
