import React from 'react';

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
      {/* Rating Stars Skeleton */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-800 rounded-md" />
        ))}
      </div>

      {/* Message Text Lines Skeleton */}
      <div className="space-y-2 flex-1 my-1">
        <div className="h-3.5 bg-gray-800 rounded-md w-full" />
        <div className="h-3.5 bg-gray-800 rounded-md w-11/12" />
        <div className="h-3.5 bg-gray-800 rounded-md w-3/4" />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10" />

      {/* Author Footer Skeleton */}
      <div className="flex items-center gap-3">
        {/* Avatar Circle */}
        <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0" />

        {/* Author Name & Company */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-3 bg-gray-800 rounded-md w-28" />
          <div className="h-2.5 bg-gray-800/60 rounded-md w-20" />
        </div>
      </div>
    </div>
  );
};

export const CardSkeletonGrid: React.FC<CardSkeletonProps> = ({
  count = 6,
  className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CardSkeletonGrid;
