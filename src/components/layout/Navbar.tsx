import React from 'react';
import { Sparkles, Globe, Menu, X, BrainCircuit, BookOpen } from 'lucide-react';
import { StudentProfile } from '../../types';

interface NavbarProps {
  profile: StudentProfile;
  currentLanguage: 'en' | 'ml';
  onLanguageChange: (lang: 'en' | 'ml') => void;
  onNavigate: (page: string) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentLanguage,
  onLanguageChange,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                <BrainCircuit className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                    SkillBridge <span className="text-indigo-600">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    SDG 4
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 font-medium -mt-0.5">
                  Personalized Learning for Quality Education
                </p>
              </div>
            </button>
          </div>

          {/* Center: SDG Tagline Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">SDG 4 Quality Education &bull; SDG 10 Reduced Inequalities</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ml')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLanguage === 'ml'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="മലയാളം (Malayalam)"
              >
                <span className="font-bold">മലയാളം</span>
              </button>
            </div>

            {/* Quick Diagnostic Action */}
            <button
              onClick={() => onNavigate('quiz')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>

            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => onNavigate('assistant')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>AI Tutor</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 focus:outline-none"
              title="Student Settings"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {profile.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{profile.name}</p>
                <p className="text-[10px] text-slate-500">Demo Student</p>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
