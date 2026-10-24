import React from 'react';
import { MasteryLevel } from '../../types';
import { AlertCircle, Clock, CheckCircle2, HelpCircle } from 'lucide-react';

interface MasteryBadgeProps {
  level: MasteryLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  let colorClasses = '';
  let icon = null;

  switch (level) {
    case 'Needs focused revision':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      icon = <AlertCircle className="w-3.5 h-3.5 text-rose-600" />;
      break;
    case 'Developing':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      icon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
      break;
    case 'Strong':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      break;
    case 'Not assessed':
    default:
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/10';
      icon = <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && icon}
      <span>{level}</span>
    </span>
  );
};
