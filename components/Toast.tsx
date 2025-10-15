import React, { useState, useEffect } from 'react';
import { ToastMessage } from '../types';

const SuccessIcon = () => (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ErrorIcon = () => (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);


export interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
        setIsExiting(true);
        const exitTimer = setTimeout(() => onDismiss(toast.id), 300); // Match exit animation duration
        return () => clearTimeout(exitTimer);
    }, 4000);

    return () => clearTimeout(dismissTimer);
  }, [toast.id, onDismiss]);

  const Icon = toast.type === 'error' ? ErrorIcon : SuccessIcon;

  return (
    <div className={`transform transition-all duration-300 ease-in-out ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="bg-gray-800 text-white rounded-lg shadow-lg flex items-center space-x-3 py-3 px-4">
            <Icon />
            <span>{toast.message}</span>
        </div>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};