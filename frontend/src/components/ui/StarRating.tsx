import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: false;
}

interface InteractiveStarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive: true;
  onChange: (rating: number) => void;
}

type Props = StarRatingProps | InteractiveStarRatingProps;

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// ─── StarRating Component ─────────────────────────────────────────────────────
// Supports half-star ratings (e.g. 0.5, 1.5, 2.5, 3.5, 4.5, 5.0).
// In interactive mode:
//   - Hovering over the left half of a star sets rating to X.5
//   - Hovering over the right half sets rating to X.0

const StarRating: React.FC<Props> = ({
  rating,
  max = 5,
  size = 'md',
  ...rest
}) => {
  const isInteractive = 'interactive' in rest && rest.interactive === true;
  const [hovered, setHovered] = useState<number | null>(null);
  const starSize = sizeClasses[size];

  const currentRating = isInteractive ? (hovered !== null ? hovered : rating) : rating;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHovered(isLeftHalf ? starValue - 0.5 : starValue);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    const selectedVal = isLeftHalf ? starValue - 0.5 : starValue;
    (rest as InteractiveStarRatingProps).onChange(selectedVal);
  };

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of ${max} stars`}
      role={isInteractive ? 'group' : 'img'}
      onMouseLeave={() => isInteractive && setHovered(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        
        let fillPercentage = 0;
        if (currentRating >= starValue) {
          fillPercentage = 100;
        } else if (currentRating >= starValue - 0.5) {
          fillPercentage = 50;
        }

        return (
          <div
            key={i}
            onMouseMove={(e) => handleMouseMove(e, starValue)}
            onClick={(e) => handleClick(e, starValue)}
            className={`relative inline-block ${
              isInteractive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'
            }`}
            title={isInteractive ? `Rate ${starValue - 0.5} or ${starValue}` : undefined}
          >
            {/* Background empty star */}
            <svg
              className={`${starSize} text-gray-600`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Foreground filled star clipped by fillPercentage */}
            {fillPercentage > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden text-amber-400 pointer-events-none transition-all duration-75"
                style={{ width: `${fillPercentage}%` }}
              >
                <svg
                  className={`${starSize}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
