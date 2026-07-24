import React from 'react';

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

// ─── StarRating ───────────────────────────────────────────────────────────────
// Dual-mode component:
//  - Display mode (interactive=false): renders colored stars based on rating
//  - Interactive mode (interactive=true): clickable stars for form input

const StarRating: React.FC<Props> = ({
  rating,
  max = 5,
  size = 'md',
  ...rest
}) => {
  const isInteractive = 'interactive' in rest && rest.interactive === true;
  const [hovered, setHovered] = React.useState(0);
  const starSize = sizeClasses[size];

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of ${max} stars`}
      role={isInteractive ? 'group' : 'img'}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = isInteractive
          ? starValue <= (hovered || rating)
          : starValue <= rating;

        return (
          <button
            key={i}
            type={isInteractive ? 'button' : undefined}
            disabled={!isInteractive}
            onClick={
              isInteractive
                ? () => (rest as InteractiveStarRatingProps).onChange(starValue)
                : undefined
            }
            onMouseEnter={isInteractive ? () => setHovered(starValue) : undefined}
            onMouseLeave={isInteractive ? () => setHovered(0) : undefined}
            aria-label={isInteractive ? `Rate ${starValue} out of ${max}` : undefined}
            className={
              isInteractive
                ? 'cursor-pointer transition-transform hover:scale-110 focus:outline-none disabled:cursor-default'
                : 'cursor-default'
            }
          >
            <svg
              className={`${starSize} transition-colors duration-150 ${
                isFilled ? 'text-amber-400' : 'text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
