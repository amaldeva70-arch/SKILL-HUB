import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Compass,
  Sparkles,
  BarChart3,
  Settings,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { Recommendation } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  primaryRecommendation: Recommendation | null;
  onSelectTopicForQuiz?: (topicId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  primaryRecommendation,
  onSelectTopicForQuiz,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'quiz',
      label: 'Diagnostic Quiz',
      icon: CheckSquare,
      badge: '4 Topics',
    },
    {
      id: 'learning',
      label: 'Learning Path',
      icon: Compass,
      badge: 'Adaptive',
    },
    {
      id: 'assistant',
      label: 'AI Tutor',
      icon: Sparkles,
      badge: 'EN + ML',
    },
    {
      id: 'progress',
      label: 'Progress & Trends',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings & Privacy',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Navigation list */}
      <div className="p-4 flex-1 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Learning Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive
                      ? 'bg-indigo-700/80 text-indigo-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Priority Focus Alert Card */}
        {primaryRecommendation && primaryRecommendation.classification === 'Needs focused revision' && (
          <div className="pt-4">
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Urgent Gap Detected</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                <strong className="text-white">{primaryRecommendation.topicName}</strong> has{' '}
                <span className="text-rose-300 font-bold">
                  {primaryRecommendation.accuracy}% accuracy
                </span>
                .
              </p>
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => {
                    if (onSelectTopicForQuiz) {
                      onSelectTopicForQuiz(primaryRecommendation.topicId);
                    }
                    onNavigate('quiz');
                  }}
                  className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold rounded-lg text-center transition-colors shadow-xs"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => onNavigate('learning')}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg transition-colors border border-slate-700"
                >
                  Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SDG Hackathon Project Attribution Card at Bottom */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">SDG Hackathon Edition</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Bridging educational inequalities with automated diagnostics and bilingual AI tutoring.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-slate-400 font-mono">SDG 4 &bull; SDG 10</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
