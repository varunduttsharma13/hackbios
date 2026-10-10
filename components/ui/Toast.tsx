'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    custom: (msg: Omit<ToastMessage, 'id'>) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...msg, id };
    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts

    const timeout = msg.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, timeout);
  }, [removeToast]);

  const toastMethods = {
    success: (title: string, description?: string) => addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) => addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) => addToast({ type: 'info', title, description }),
    custom: addToast,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
              error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
              warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
              info: <Info className="w-4 h-4 text-teal-600 shrink-0" />,
            };

            const styles = {
              success: 'bg-white border-emerald-200 text-slate-900 shadow-lg shadow-emerald-950/5',
              error: 'bg-white border-rose-200 text-slate-900 shadow-lg shadow-rose-950/5',
              warning: 'bg-white border-amber-200 text-slate-900 shadow-lg shadow-amber-950/5',
              info: 'bg-white border-teal-200 text-slate-900 shadow-lg shadow-teal-950/5',
            };

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                role="alert"
                className={`pointer-events-auto p-3.5 rounded-2xl border ${styles[t.type]} flex items-start gap-3 relative`}
              >
                <div className="mt-0.5">{icons[t.type]}</div>
                <div className="flex-1 pr-4">
                  <strong className="text-xs font-bold block">{t.title}</strong>
                  {t.description && (
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
