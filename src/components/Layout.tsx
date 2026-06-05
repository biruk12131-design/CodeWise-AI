import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, History, CodeSquare, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { useHotkeys } from '../hooks/useHotkeys';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useAppContext();

  // Initialize global shortcuts (no callback means it only registers navigation)
  useHotkeys();

  const navItems = [
    { name: 'Review', path: '/', icon: Home, shortcut: '1' },
    { name: 'History', path: '/history', icon: History, shortcut: '2' },
    { name: 'Snippets', path: '/snippets', icon: CodeSquare, shortcut: '3' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, shortcut: '4' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 z-50 rounded-md font-medium">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-[#0F172A]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1" title="Go to Review (Alt+1)">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 shrink-0">
                <rect width="40" height="40" rx="10" fill="url(#cwise)" />
                <path d="M12 14H28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 20H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 26H25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="30" cy="28" r="6" fill="#34D399" stroke="white" strokeWidth="2" />
                <path d="M28 28L30 30L33 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="cwise" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1E293B" />
                    <stop offset="1" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-bold text-xl tracking-tight hidden sm:block">CodeWise AI</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    title={`Shortcut: Alt+${item.shortcut}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                      isActive 
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:dark:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
