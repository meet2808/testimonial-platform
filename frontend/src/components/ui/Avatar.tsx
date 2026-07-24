import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
// Displays a profile image if available, otherwise a colored circle with
// the customer's initials. Color is deterministically derived from the name
// so it stays consistent across renders.

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  className = '',
}) => {
  const sizeClass = sizeClasses[size];
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${name}'s profile photo`}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white/10 flex-shrink-0 ${className}`}
        onError={(e) => {
          // If image fails to load, hide it so the fallback renders
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-label={`${name}'s avatar`}
      role="img"
    >
      {initials}
    </div>
  );
};

export default Avatar;
