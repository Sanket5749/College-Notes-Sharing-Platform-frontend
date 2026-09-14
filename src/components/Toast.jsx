import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Attention',
      info: 'Information',
    };

    const newToast = {
      id,
      message,
      type,
      title: title || defaultTitles[type] || 'Notice',
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-emerald-400" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-400" />;
      default:
        return <Info size={18} className="text-cyan-400" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-slate-900/95';
      case 'error':
        return 'border-red-500/30 bg-slate-900/95';
      case 'warning':
        return 'border-amber-500/30 bg-slate-900/95';
      default:
        return 'border-cyan-500/30 bg-slate-900/95';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${getTypeStyles(
              t.type
            )}`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(t.type)}</div>
            <div className="flex-1 text-left">
              <div className="text-xs font-bold text-slate-100">{t.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
