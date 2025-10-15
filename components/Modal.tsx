import React, { useState, useContext, createContext, ReactNode, useCallback, useEffect } from 'react';
import { ModalConfig } from '../types';

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  const showModal = useCallback((newConfig: ModalConfig) => {
    setConfig(newConfig);
    setInputs({}); // Reset inputs for new modal
    setIsOpen(true);
    setIsAnimatingOut(false);
  }, []);

  const hideModal = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
        setIsOpen(false);
    }, 200); // Match animation duration
  }, []);
  
  const handleConfirm = () => {
    config?.onConfirm(inputs);
    hideModal();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hideModal]);


  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isOpen && config && (
        <div 
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-200 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={hideModal}
        >
          <div 
            className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-200 ${isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
                <div className="mt-4">
                    {config.renderContent ? config.renderContent(inputs, setInputs) : null}
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                <button 
                    onClick={hideModal}
                    type="button"
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                    {config.confirmText || 'OK'}
                </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};