import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './components/Toast';
import { apiClient } from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SemesterFilter } from './components/SemesterFilter';
import { NotesGrid } from './components/NotesGrid';
import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';

export const App = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Load subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.get('/subjects');
        if (res?.data?.subjects) {
          setSubjects(res.data.subjects);
        }
      } catch (err) {
        console.warn('Failed to load academic subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch notes with filters
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/notes', {
        search: searchQuery.trim(),
        semester: selectedSemester,
        subject_id: selectedSubject,
        limit: 30,
      });

      if (res?.data?.notes) {
        setNotes(res.data.notes);
        setTotalNotes(res.data.total ?? res.data.notes.length);
      }
    } catch (err) {
      showToast(err.message || 'Could not retrieve notes feed.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSemester, selectedSubject, showToast]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleOpenUpload = () => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to upload notes.', 'warning');
      handleOpenAuth('login');
      return;
    }
    setIsUploadOpen(true);
  };

  const handleNoteDeleted = (deletedId) => {
    setNotes((prev) => prev.filter((n) => n.id !== deletedId));
    setTotalNotes((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="app-shell">
      {/* Ambient background glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Navigation Header */}
      <Header
        onOpenAuth={handleOpenAuth}
        onOpenUpload={handleOpenUpload}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onOpenUpload={handleOpenUpload}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalNotes={totalNotes}
      />

      {/* Semester Filter Tabs */}
      <SemesterFilter
        selectedSemester={selectedSemester}
        onSelectSemester={(sem) => {
          setSelectedSemester(sem);
          setSelectedSubject(''); // reset subject when semester changes
        }}
      />

      {/* Notes Grid Feed */}
      <NotesGrid
        notes={notes}
        loading={loading}
        subjects={subjects.filter(
          (s) => !selectedSemester || String(s.semester) === String(selectedSemester)
        )}
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        onDeleted={handleNoteDeleted}
        onOpenUpload={handleOpenUpload}
        onRequireAuth={handleOpenAuth}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjects={subjects}
        onUploaded={fetchNotes}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-content">
          <h4>EduNotes • College Academic Resource Platform</h4>
          <p className="footer-text">
            Built for college students with 9-digit PRN authentication, Supabase PostgreSQL, and Cloud Storage.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
