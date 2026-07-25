import React, { useEffect } from 'react';
import { usePublicTestimonials } from '../hooks/useTestimonials';
import Avatar from '../components/ui/Avatar';
import StarRating from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import { formatDate, truncate } from '../utils/formatters';
import { Testimonial } from '../types';

// ─── Testimonial Card ─────────────────────────────────────────────────────────
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  return (
    <article className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-0.5 group">
      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <StarRating rating={testimonial.rating} size="sm" />
        <span className="text-xs text-gray-400 font-medium tabular-nums">{testimonial.rating}</span>
      </div>

      {/* Message */}
      <blockquote className="text-gray-300 text-sm leading-relaxed flex-1">
        &ldquo;{truncate(testimonial.message, 200)}&rdquo;
      </blockquote>

      {/* Divider */}
      <div className="w-full h-px bg-white/10" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar
          name={testimonial.customerName}
          imageUrl={testimonial.profileImageUrl}
          size="md"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {testimonial.customerName}
          </p>
          <p className="text-xs text-gray-500 truncate">{testimonial.company}</p>
        </div>
        <time
          className="ml-auto text-xs text-gray-600 flex-shrink-0"
          dateTime={testimonial.submittedAt}
        >
          {formatDate(testimonial.submittedAt)}
        </time>
      </div>
    </article>
  );
};

// ─── Public Wall Page ─────────────────────────────────────────────────────────
const PublicWallPage: React.FC = () => {
  const { testimonials, isLoading, error, refetch } = usePublicTestimonials();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Customer Stories
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            What Our{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real experiences from real people who have used our platform.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-24">
            <Spinner size="lg" />
            <p className="text-sm text-gray-500">Loading testimonials...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium mb-2">Failed to load testimonials</p>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => void refetch()}
              className="text-indigo-400 hover:text-indigo-300 text-sm underline-offset-2 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && testimonials.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No testimonials yet</h2>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        )}

        {/* Masonry-style grid */}
        {!isLoading && !error && testimonials.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {testimonials.map((t) => (
              <div key={t.id} className="break-inside-avoid">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicWallPage;
