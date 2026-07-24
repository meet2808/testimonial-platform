import { useState, useCallback } from 'react';
import { testimonialApi } from '../api/testimonial.api';
import { Testimonial, PaginatedData, AdminTestimonialQuery } from '../types';
import { extractErrorMessage } from '../utils/formatters';

// ─── useAdminTestimonials ─────────────────────────────────────────────────────
// Fetches paginated, filtered, and sorted testimonials for the admin dashboard.

interface UseAdminTestimonialsReturn {
  result: PaginatedData<Testimonial> | null;
  isLoading: boolean;
  error: string | null;
  fetch: (query: AdminTestimonialQuery) => Promise<void>;
}

export const useAdminTestimonials = (): UseAdminTestimonialsReturn => {
  const [result, setResult] = useState<PaginatedData<Testimonial> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (query: AdminTestimonialQuery): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await testimonialApi.getAllAdmin(query);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, fetch };
};
