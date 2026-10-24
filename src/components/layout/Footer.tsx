import React from 'react';
import { Heart, Globe, BookOpen, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left attribution */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-200">
            SkillBridge AI — Every learner is different. Their learning journey should be too.
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400">
            Student-built SDG 4 &amp; SDG 10 Quality Education Initiative
          </span>
        </div>

        {/* Center/Right SDG Goals & Privacy Notice */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 text-slate-300">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            <span>SDG 4: Quality Education</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 text-slate-300">
            <Globe className="w-3 h-3 text-teal-400" />
            <span>SDG 10: Reduced Inequalities</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Client-Safe Sandbox Storage</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
