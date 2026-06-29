import React, { createContext, useContext, useState, useEffect } from 'react';

type ModalType = 'auth' | 'aiPlanner' | 'settings' | null;
type ThemeType = 'light' | 'dark' | 'system';

interface UIContextType {
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('velora-theme');
    return (saved as ThemeType) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('velora-theme', theme);
  }, [theme]);

  return (
    <UIContext.Provider value={{
      activeModal,
      openModal: (modal) => setActiveModal(modal),
      closeModal: () => setActiveModal(null),
      isSidebarOpen,
      toggleSidebar: () => setIsSidebarOpen(prev => !prev),
      theme,
      setTheme
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
