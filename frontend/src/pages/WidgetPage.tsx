import React, { useEffect } from 'react';
import { useWidgetTestimonials } from '../hooks/useTestimonials';
import Avatar from '../components/ui/Avatar';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import { truncate } from '../utils/formatters';

// ─── Widget Page ──────────────────────────────────────────────────────────────
// This page is designed to be embedded via <iframe> in third-party websites.
// It is completely self-contained — no shared layout, minimal chrome.
// All styles use inline TailwindCSS classes that work within the iframe context.

const WidgetPage: React.FC = () => {
  const { testimonials, isLoading, error, refetch } = useWidgetTestimonials();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gray-950 p-4 font-sans">
      {/* Compact header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">
          What Customers Say
        </h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mt-2 rounded-full" />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-12 text-gray-500 text-sm">
          Could not load testimonials.
        </div>
      )}

      {!isLoading && !error && testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          No testimonials yet.
        </div>
      )}

      {/* Scrollable horizontal carousel */}
      {!isLoading && !error && testimonials.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex-shrink-0 w-64 bg-gray-900 border border-white/10 rounded-xl p-4 flex flex-col gap-3"
            >
              <StarRating rating={t.rating} size="sm" />
              <blockquote className="text-gray-300 text-xs leading-relaxed flex-1">
                &ldquo;{truncate(t.message, 120)}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <Avatar
                  name={t.customerName}
                  imageUrl={t.profileImageUrl}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {t.customerName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{t.company}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetPage;
