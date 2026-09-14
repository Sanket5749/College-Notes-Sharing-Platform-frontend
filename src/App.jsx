import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './components/Toast';
import { apiClient } from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BranchFilter } from './components/BranchFilter';
import { SemesterFilter } from './components/SemesterFilter';
import { NotesGrid } from './components/NotesGrid';
import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { getBranchInfo } from './constants/branches';

export const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedBranch, setSelectedBranch] = useState('');
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

  // Fetch notes with filters (strictly guarded for authenticated users)
  const fetchNotes = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setNotes([]);
      setTotalNotes(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.get('/notes', {
        search: searchQuery.trim(),
        branch: selectedBranch,
        semester: selectedSemester,
        subject_id: selectedSubject,
        limit: 30,
      });

      if (res?.data?.notes) {
        setNotes(res.data.notes);
        setTotalNotes(res.data.total ?? res.data.notes.length);
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('denied')) {
        setNotes([]);
      } else {
        showToast(err.message || 'Could not retrieve notes feed.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, searchQuery, selectedBranch, selectedSemester, selectedSubject, showToast]);

  // Debounce search and filter inputs
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      fetchNotes();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchNotes, isAuthenticated]);

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

  // Filter subjects for the NotesGrid subject dropdown
  const branchObj = selectedBranch ? getBranchInfo(selectedBranch) : null;
  const targetBranchName = branchObj ? branchObj.name : selectedBranch;
  const parsedSem = selectedSemester ? parseInt(selectedSemester, 10) : null;

  const availableSubjects = subjects.filter((s) => {
    if (parsedSem && s.semester !== parsedSem) return false;

    if (targetBranchName) {
      if (parsedSem && parsedSem <= 2) {
        return s.department === 'Common Engineering' || s.department === targetBranchName;
      }
      return (
        s.department === targetBranchName ||
        (s.department && branchObj && s.department.toLowerCase().includes(branchObj.code.toLowerCase()))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen relative bg-[#090D16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Splash Screen on Initial Page Load & Refresh (2500ms duration) */}
      {showSplash && (
        <SplashScreen duration={2500} onFinish={() => setShowSplash(false)} />
      )}

      {/* Ambient background glows */}
      <div className="fixed -top-40 -left-40 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 -right-40 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

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
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleOpenAuth}
      />

      {/* Engineering Branch Filter Tabs (9 Allowed Streams) */}
      <BranchFilter
        selectedBranch={selectedBranch}
        onSelectBranch={(branchCode) => {
          setSelectedBranch(branchCode);
          setSelectedSubject(''); // reset subject when branch changes
        }}
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleOpenAuth}
      />

      {/* Semester Filter Tabs (Semesters 1-8) */}
      <SemesterFilter
        selectedSemester={selectedSemester}
        onSelectSemester={(sem) => {
          setSelectedSemester(sem);
          setSelectedSubject(''); // reset subject when semester changes
        }}
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleOpenAuth}
      />

      {/* Notes Grid Feed */}
      <NotesGrid
        notes={notes}
        loading={authLoading || loading}
        isAuthenticated={isAuthenticated}
        subjects={availableSubjects}
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
        onUploaded={() => {
          fetchNotes();
          if (refreshUser) refreshUser();
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-10 text-center relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
          <h4 className="text-base font-semibold text-slate-200">
            EduNotes Rcpit
          </h4>
        </div>
      </footer>
    </div>
  );
};

export default App;
