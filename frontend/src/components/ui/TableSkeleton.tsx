import React from 'react';

interface TableSkeletonProps {
  rows?: number;
}

export const TableSkeletonRow: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-white/5">
      {/* Customer Avatar & Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <div className="h-3 bg-gray-800 rounded-md w-28" />
            <div className="h-2.5 bg-gray-800/60 rounded-md w-20" />
          </div>
        </div>
      </td>

      {/* Rating */}
      <td className="px-6 py-4 hidden md:table-cell">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-800 rounded-sm" />
          ))}
        </div>
      </td>

      {/* Message preview */}
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="h-3 bg-gray-800/80 rounded-md w-48" />
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4">
        <div className="w-20 h-6 bg-gray-800 rounded-full" />
      </td>

      {/* Submitted Date */}
      <td className="px-6 py-4 hidden xl:table-cell">
        <div className="h-3 bg-gray-800/60 rounded-md w-24" />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-7 bg-gray-800 rounded-lg" />
          <div className="w-16 h-7 bg-gray-800 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableSkeletonRow key={i} />
      ))}
    </>
  );
};

export default TableSkeleton;
