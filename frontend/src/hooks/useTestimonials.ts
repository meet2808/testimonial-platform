import { useState, useCallback } from 'react';
import { testimonialApi } from '../api/testimonial.api';
import type { Testimonial } from '../types';
import { extractErrorMessage } from '../utils/formatters';

// ─── usePublicTestimonials ────────────────────────────────────────────────────
// Fetches approved testimonials for the public wall.

interface UsePublicTestimonialsReturn {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePublicTestimonials = (): UsePublicTestimonialsReturn => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await testimonialApi.getPublic();
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { testimonials, isLoading, error, refetch: fetch };
};

// ─── useWidgetTestimonials ────────────────────────────────────────────────────
// Fetches approved testimonials for the embeddable widget.

interface UseWidgetTestimonialsReturn {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWidgetTestimonials = (): UseWidgetTestimonialsReturn => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await testimonialApi.getWidget();
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { testimonials, isLoading, error, refetch: fetch };
};
