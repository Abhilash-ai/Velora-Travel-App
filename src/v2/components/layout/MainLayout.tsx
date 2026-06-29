import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, noPadding = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className={`flex-1 w-full ${noPadding ? '' : 'pt-20'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

