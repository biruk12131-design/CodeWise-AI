import React from 'react';
import { cn } from '../lib/utils';
import { Rating } from '../types';

interface BadgeProps {
  rating: Rating;
  className?: string;
}

export const RatingBadge: React.FC<BadgeProps> = ({ rating, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        rating === 'Good' && "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        rating === 'Needs Improvement' && "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        rating === 'Has Issues' && "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        className
      )}
    >
      {rating}
    </span>
  );
};
