import React from 'react';
import { RiskLevel } from '../../types/bridge';
import { ShieldCheck, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = 'md'
}) => {
  const configs = {
    Low: {
      bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    Moderate: {
      bg: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
      icon: AlertTriangle,
      label: 'Moderate'
    },
    High: {
      bg: 'bg-orange-950/60 text-orange-300 border-orange-800/80',
      icon: AlertCircle,
      label: 'High Risk'
    },
    Critical: {
      bg: 'bg-rose-950/70 text-rose-300 border-rose-700',
      icon: ShieldAlert,
      label: 'Critical Risk'
    }
  };

  const config = configs[level] || configs.Moderate;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="font-mono ml-1 opacity-90">({score.toFixed(1)})</span>
      )}
    </span>
  );
};
