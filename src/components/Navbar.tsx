import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  user: any;
  onNavClick: (tab: string) => void;
  onOpenPlanner: () => void;
  onOpenJourney: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavClick, onOpenPlanner, onAuthClick, onDashboardClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', id: 'discover' },
    { label: 'Packages', id: 'packages' },
    { label: 'AI Planner', id: 'ai-planner' },
    { label: 'About Us', id: 'about' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'ai-planner') {
      onOpenPlanner();
    } else {
      onNavClick(id);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 flex justify-between items-center ${scrolled ? 'h-16 bg-white shadow-md text-slate-900 py-0' : 'h-24 bg-transparent text-white py-4'}`}>
      {/* Left: Logo */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => onNavClick('discover')}
      >
        <img src="/images/logo.png?v=1" alt="Velora Travel Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-contain" />
        <span className="font-heading font-extrabold text-2xl tracking-wide uppercase hidden sm:block">
          Velora
        </span>
      </div>

      {/* Center: Links */}
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id)}
            className={`text-sm font-semibold hover:text-blue-500 transition-colors duration-300 cursor-pointer`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="hidden lg:flex items-center gap-4">
        {user ? (
          <button 
            onClick={onDashboardClick}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-6 py-2.5 rounded-full font-bold transition-colors"
          >
            My Dashboard
          </button>
        ) : (
          <>
            <button onClick={onAuthClick} className={`font-semibold hover:text-blue-500 transition-colors`}>Log In</button>
            <button onClick={onAuthClick} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors">
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu trigger */}
      <button 
        className="lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white text-slate-900 border-b border-slate-100 p-6 flex flex-col gap-6 lg:hidden shadow-lg">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left font-heading text-lg font-semibold hover:text-blue-600 py-2 border-b border-slate-100 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <button onClick={() => { setMobileMenuOpen(false); onDashboardClick(); }} className="bg-blue-50 text-blue-600 border border-blue-200 w-full py-3 rounded-xl font-bold">My Dashboard</button>
            ) : (
              <>
                <button onClick={() => { setMobileMenuOpen(false); onAuthClick(); }} className="font-semibold text-center w-full py-3">Log In</button>
                <button onClick={() => { setMobileMenuOpen(false); onAuthClick(); }} className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
