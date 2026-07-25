import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWidgetTestimonials } from '../hooks/useTestimonials';
import Avatar from '../components/ui/Avatar';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import { truncate } from '../utils/formatters';

import CardSkeletonGrid from '../components/ui/CardSkeleton';

// ─── Preset Accent Maps ───────────────────────────────────────────────────────
const ACCENT_PRESETS: Record<string, string> = {
  indigo: '#6366f1',
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  orange: '#ff5722',
  teal: '#14b8a6',
};

// ─── Theme Configurations ─────────────────────────────────────────────────────
interface ThemeConfig {
  bg: string;
  cardBg: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
  mutedColor: string;
  emptyColor: string;
  arrowBg: string;
}

const THEME_CONFIGS: Record<'dark' | 'light' | 'transparent', ThemeConfig> = {
  dark: {
    bg: 'bg-gray-950',
    cardBg: 'bg-gray-900',
    borderColor: 'border-white/10',
    titleColor: 'text-white',
    textColor: 'text-gray-200',
    mutedColor: 'text-gray-400',
    emptyColor: 'text-gray-500',
    arrowBg: 'bg-white/10 hover:bg-white/20 text-white',
  },
  light: {
    bg: 'bg-gray-50',
    cardBg: 'bg-white',
    borderColor: 'border-gray-200',
    titleColor: 'text-gray-900',
    textColor: 'text-gray-700',
    mutedColor: 'text-gray-500',
    emptyColor: 'text-gray-400',
    arrowBg: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },
  transparent: {
    bg: 'bg-transparent',
    cardBg: 'bg-gray-900/80 backdrop-blur-md',
    borderColor: 'border-white/10',
    titleColor: 'text-white',
    textColor: 'text-gray-200',
    mutedColor: 'text-gray-400',
    emptyColor: 'text-gray-400',
    arrowBg: 'bg-white/10 hover:bg-white/20 text-white',
  },
};

// ─── Widget Page Component ────────────────────────────────────────────────────
// Supports URL Query Parameters:
//   - ?layout=carousel | grid (default: carousel)
//   - ?theme=dark | light | transparent (default: dark)
//   - ?accent=indigo | blue | emerald | amber | rose | violet | orange | teal OR hex (e.g. ff5722)

const WidgetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { testimonials, isLoading, error, refetch } = useWidgetTestimonials();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  // ── Parse Query Parameters ─────────────────────────────────────────────────
  const themeParam = (searchParams.get('theme')?.toLowerCase() ?? 'dark') as 'dark' | 'light' | 'transparent';
  const theme: ThemeConfig = THEME_CONFIGS[themeParam] ?? THEME_CONFIGS.dark;

  const layoutParam = (searchParams.get('layout')?.toLowerCase() ?? 'carousel') as 'carousel' | 'grid';
  const isGrid = layoutParam === 'grid';

  const accentParam = searchParams.get('accent')?.toLowerCase() ?? 'indigo';
  const accentHex = useMemo(() => {
    if (ACCENT_PRESETS[accentParam]) return ACCENT_PRESETS[accentParam];
    return /^([0-9a-fA-F]{3}){1,2}$/.test(accentParam) ? `#${accentParam}` : '#6366f1';
  }, [accentParam]);

  // ── Duplicate list for continuous infinite loop ──────────────────────────────
  const displayTestimonials = useMemo(() => {
    if (testimonials.length <= 1) return testimonials;
    // If multiple items (< 10), duplicate to create a seamless continuous marquee loop
    if (testimonials.length < 10) {
      return [...testimonials, ...testimonials, ...testimonials];
    }
    return [...testimonials, ...testimonials];
  }, [testimonials]);

  // ── Ultra-Smooth Continuous Auto-Scroll (requestAnimationFrame) ─────────────
  useEffect(() => {
    if (isGrid || isPaused || displayTestimonials.length <= 1) return;

    const container = carouselRef.current;
    if (!container) return;

    let animationFrameId: number;

    const step = () => {
      if (container) {
        // If reached near the end of scrollable area, wrap back seamlessly to 0
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 0.75; // 0.75px per 60fps frame = 45px/sec fluid continuous speed
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isGrid, isPaused, displayTestimonials.length]);

  return (
    <div className={`min-h-screen ${theme.bg} p-4 font-sans transition-colors overflow-hidden`}>
      {/* Standard Header with Controls */}
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
        <div className="text-left">
          <h2 className={`text-xl font-bold ${theme.titleColor}`}>
            What Customers Say
          </h2>
          <div
            className="w-12 h-1 mt-1.5 rounded-full transition-all"
            style={{ backgroundColor: accentHex }}
          />
        </div>

        {/* Carousel Arrow Controls */}
        {/* {!isGrid && displayTestimonials.length > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollManual('left')}
              className={`p-2 rounded-full text-xs transition-all ${theme.arrowBg}`}
              aria-label="Previous testimonial"
              title="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollManual('right')}
              className={`p-2 rounded-full text-xs transition-all ${theme.arrowBg}`}
              aria-label="Next testimonial"
              title="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )} */}
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="max-w-6xl mx-auto">
          <CardSkeletonGrid count={3} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={`text-center py-12 ${theme.emptyColor} text-sm`}>
          Could not load testimonials.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && testimonials.length === 0 && (
        <div className={`text-center py-12 ${theme.emptyColor} text-sm`}>
          No testimonials yet.
        </div>
      )}

      {/* Testimonials (Continuous Marquee vs Grid) */}
      {!isLoading && !error && testimonials.length > 0 && (
        <div className="max-w-6xl mx-auto">
          {isGrid ? (
            /* Grid Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className={`w-full ${theme.cardBg} border ${theme.borderColor} rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={t.rating} size="sm" />
                    <span className={`text-xs ${theme.mutedColor} font-medium tabular-nums`}>{t.rating}</span>
                  </div>
                  <blockquote className={`${theme.textColor} text-xs leading-relaxed flex-1`}>
                    &ldquo;{truncate(t.message, 140)}&rdquo;
                  </blockquote>
                  <div className={`flex items-center gap-2.5 pt-3 border-t ${theme.borderColor}`}>
                    <Avatar name={t.customerName} imageUrl={t.profileImageUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${theme.titleColor} truncate`}>
                        {t.customerName}
                      </p>
                      <p className={`text-xs ${theme.mutedColor} truncate`}>
                        {t.company}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Continuous Fluid Auto-Scroll Carousel Layout */
            <div
              ref={carouselRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-none select-none"
            >
              {displayTestimonials.map((t, idx) => (
                <article
                  key={`${t.id}-${idx}`}
                  className={`flex-shrink-0 w-64 ${theme.cardBg} border ${theme.borderColor} rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={t.rating} size="sm" />
                    <span className={`text-xs ${theme.mutedColor} font-medium tabular-nums`}>{t.rating}</span>
                  </div>
                  <blockquote className={`${theme.textColor} text-xs leading-relaxed flex-1`}>
                    &ldquo;{truncate(t.message, 120)}&rdquo;
                  </blockquote>
                  <div className={`flex items-center gap-2 pt-2.5 border-t ${theme.borderColor}`}>
                    <Avatar name={t.customerName} imageUrl={t.profileImageUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${theme.titleColor} truncate`}>
                        {t.customerName}
                      </p>
                      <p className={`text-xs ${theme.mutedColor} truncate`}>
                        {t.company}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WidgetPage;
