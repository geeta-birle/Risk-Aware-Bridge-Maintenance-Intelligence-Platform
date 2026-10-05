import React from 'react';
import { ConditionCategory } from '../../types/bridge';

interface ConditionBadgeProps {
  category: ConditionCategory;
  rating?: number; // 0 to 9 NBI scale
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({
  category,
  rating
}) => {
  const styles = {
    Good: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80',
    Fair: 'bg-sky-950/50 text-sky-300 border-sky-800/80',
    Poor: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    Critical: 'bg-rose-950/70 text-rose-300 border-rose-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[category] || styles.Fair}`}>
      {rating !== undefined && (
        <span className="font-mono font-bold mr-1.5">{rating}/9</span>
      )}
      <span>{category}</span>
    </span>
  );
};
