import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, GraduationCap } from 'lucide-react';

/**
 * SplashScreen Component for EduNotes RCPIT
 * Displays an animated brand logo and progress indicator on page load/refresh.
 * Duration: 2500ms total (smooth fade-out starts at ~2100ms).
 */
export const SplashScreen = ({ duration = 2500, onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing campus portal...');

  useEffect(() => {
    // Start filling progress bar smoothly
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 50);

    // Dynamic status text transitions
    const t1 = setTimeout(() => {
      setStatusMessage('Syncing syllabus & department notes...');
    }, 800);

    const t2 = setTimeout(() => {
      setStatusMessage('Welcome to EduNotes RCPIT!');
    }, 1700);

    // Begin fade-out slightly before total duration
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, Math.max(0, duration - 400));

    // Finish and unmount at exact duration
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A12] select-none transition-all duration-400 ease-in-out ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-sm sm:max-w-md text-center">
        {/* Animated Glowing Logo Container */}
        <div className="relative mb-6">
          {/* Subtle spinning accent ring */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-md opacity-75 animate-pulse"></div>
          
          {/* Outer Ring Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60 blur-sm"></div>

          {/* Main Logo Card */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-indigo-500/40 backdrop-blur-xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center group overflow-hidden">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-transparent to-purple-600/20 opacity-80"></div>

            {/* Center Vector Emblem */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="relative">
                <GraduationCap
                  size={38}
                  className="text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-bounce"
                  style={{ animationDuration: '2s' }}
                />
                <Sparkles
                  size={16}
                  className="absolute -top-1 -right-2 text-pink-400 animate-spin"
                  style={{ animationDuration: '4s' }}
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-purple-300">
                <BookOpen size={18} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </div>
            </div>

            {/* Corner highlight shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent"></div>
          </div>
        </div>

        {/* Brand Title */}
        <div className="flex flex-col items-center gap-1.5 mb-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-1">
            Edu<span className="text-gradient">Notes</span>
          </h1>

          {/* RCPIT College Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>RCPIT Shirpur</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-400 font-medium mb-8">
          College Academic Resource & Notes Platform
        </p>

        {/* Progress Bar Container */}
        <div className="w-48 sm:w-56 flex flex-col items-center gap-2.5">
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all ease-out"
              style={{
                width: `${progress}%`,
                transitionDuration: `${Math.max(0, duration - 350)}ms`,
              }}
            />
          </div>

          {/* Dynamic Status Text */}
          <span className="text-[11px] text-slate-400 tracking-wide font-medium transition-all duration-300">
            {statusMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
