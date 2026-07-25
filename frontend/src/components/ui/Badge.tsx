import React from 'react';
import type { TestimonialStatus } from '../../types';

interface BadgeProps {
  status: TestimonialStatus;
  className?: string;
}

const statusConfig: Record<
  TestimonialStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  },
};

// ─── Badge ────────────────────────────────────────────────────────────────────
// Status badge for displaying PENDING / APPROVED / REJECTED.

const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
};

export default Badge;
