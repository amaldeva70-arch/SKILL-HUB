import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Settings,
  User,
  Globe,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Award,
  AlertTriangle,
  Check,
  BookOpen,
} from 'lucide-react';

interface SettingsPageProps {
  profile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  onResetData: (mode: 'seed' | 'clear') => void;
  currentLanguage: 'en' | 'ml';
  onLanguageChange: (lang: 'en' | 'ml') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  onProfileUpdated,
  onResetData,
  currentLanguage,
  onLanguageChange,
}) => {
  const [name, setName] = useState<string>(profile.name);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<'seed' | 'clear' | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      name: name.trim() || 'Student',
      preferredLanguage: currentLanguage,
    };
    StorageService.saveProfile(updated);
    onProfileUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmReset = () => {
    if (showConfirmModal) {
      onResetData(showConfirmModal);
      setShowConfirmModal(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Preferences &amp; Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Settings &amp; Platform Controls
        </h1>
        <p className="text-xs text-slate-500">
          Manage your student profile, preferred language, demo dataset, and review SDG compliance.
        </p>
      </div>

      {/* 1. Profile Information */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Profile</h3>
            <p className="text-xs text-slate-500">Customize how your name appears on reports</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Student Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Ananya Sharma"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              Save Profile
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. Language Preference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Preferred Learning Language</h3>
            <p className="text-xs text-slate-500">
              Select primary language for AI tutoring, quizzes, and summaries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currentLanguage === 'en'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">English (Global)</span>
              {currentLanguage === 'en' && <Check className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Clear, simple English suitable for beginner and undergraduate computer science students.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange('ml')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currentLanguage === 'ml'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 font-sans">മലയാളം (Malayalam)</span>
              {currentLanguage === 'ml' && <Check className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              കമ്പ്യൂട്ടർ സയൻസ് തത്വങ്ങൾ മാതൃഭാഷയിൽ ലളിതമായി മനസ്സിലാക്കാൻ സഹായിക്കുന്നു (SDG 10).
            </p>
          </button>
        </div>
      </div>

      {/* 3. Demo Dataset & Reset Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Demo Data Controls</h3>
            <p className="text-xs text-slate-500">
              Reset the assessment engine state for presentation or testing
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-800">About Illustrative Hackathon Demo Data:</p>
          <p className="leading-relaxed">
            By default, the platform seeds four sample diagnostic attempts to illustrate how the recommendation
            engine prioritizes lower scores:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <span className="p-1.5 bg-white rounded border border-slate-200 text-slate-700">Python: 80%</span>
            <span className="p-1.5 bg-rose-50 rounded border border-rose-200 text-rose-700 font-bold">Data Structures: 40%</span>
            <span className="p-1.5 bg-amber-50 rounded border border-amber-200 text-amber-700">Algorithms: 60%</span>
            <span className="p-1.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-700">DBMS: 100%</span>
          </div>
          <p className="text-slate-500 pt-1">
            When you complete a new quiz as a student, live scores are added to this history, dynamically updating recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowConfirmModal('seed')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Illustrative Sample Data</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal('clear')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear All Progress (Fresh Start)</span>
          </button>
        </div>
      </div>

      {/* 4. Privacy & SDG 4 / 10 Framework */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Award className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            Educational Integrity &amp; Data Privacy Framework
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <strong className="text-indigo-300 block">Client-Sandboxed Persistence:</strong>
            <p>
              Student quiz responses, timestamps, and lesson completions are stored locally inside your browser's
              sandboxed storage. No private data is transmitted to external telemetry servers.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <strong className="text-teal-300 block">SDG 4 &amp; 10 Alignment:</strong>
            <p>
              By offering diagnostic-driven learning paths and bilingual Malayalam tutoring, SkillBridge AI reduces
              educational inequalities and delivers tailored quality education to every learner.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Reset Action</h3>
                <p className="text-xs text-slate-500">
                  {showConfirmModal === 'seed'
                    ? 'Restore default illustrative data'
                    : 'Clear all student quiz attempts'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {showConfirmModal === 'seed'
                ? 'This will restore the sample demonstration quiz attempts (Python 80%, Data Structures 40%, Algorithms 60%, DBMS 100%) and reset lesson completion status.'
                : 'This will completely erase all recorded quiz attempts and reset lessons. Topic mastery will revert to "Not assessed".'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
