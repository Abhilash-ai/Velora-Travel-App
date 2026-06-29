import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { DashboardView } from './views/DashboardView';

import { UIProvider, useUI } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { TravelProvider } from './context/TravelContext';
import { CursorProvider } from '../context/CursorContext';
import { CustomCursor } from '../components/CustomCursor';
import { AIPlanner } from '../views/AIPlanner';
import { AuthModal } from './components/ui/AuthModal';
import { SettingsModal } from './components/ui/SettingsModal';

const GlobalModals: React.FC = () => {
  const { activeModal, closeModal } = useUI();

  return (
    <>
      {activeModal === 'aiPlanner' && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <AIPlanner onClose={closeModal} prefilledDestination="" />
        </div>
      )}
      {activeModal === 'auth' && (
        <AuthModal />
      )}
      <AnimatePresence>
        {activeModal === 'settings' && <SettingsModal />}
      </AnimatePresence>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <CursorProvider>
      <UIProvider>
        <AuthProvider>
          <TravelProvider>
            <BrowserRouter>
              <div className="v2-app-container flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-300">
                <CustomCursor />
                <GlobalModals />
                <Routes>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/explore" element={<ExploreView />} />
                  <Route path="/dashboard" element={<DashboardView />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </BrowserRouter>
          </TravelProvider>
        </AuthProvider>
      </UIProvider>
    </CursorProvider>
  );
};



