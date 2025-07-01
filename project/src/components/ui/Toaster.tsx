import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

export const addToast = (toast: Omit<Toast, 'id'>) => {
  const newToast = { ...toast, id: Date.now().toString() };
  toasts.push(newToast);
  listeners.forEach(listener => listener([...toasts]));
  
  setTimeout(() => {
    removeToast(newToast.id);
  }, 5000);
};

export const removeToast = (id: string) => {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(listener => listener([...toasts]));
  }
};

export const Toaster: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-800 border-green-200';
      case 'error': return 'bg-red-50 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => {
        const Icon = getIcon(toast.type);
        return (
          <div
            key={toast.id}
            className={`
              flex items-center p-4 rounded-lg border shadow-lg min-w-80 animate-in slide-in-from-right
              ${getStyles(toast.type)}
            `}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};