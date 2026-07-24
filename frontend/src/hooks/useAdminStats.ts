import { useState, useCallback } from 'react';
import { testimonialApi } from '../api/testimonial.api';
import { AdminStats } from '../types';
import { extractErrorMessage } from '../utils/formatters';

// ─── useAdminStats ────────────────────────────────────────────────────────────
// Fetches dashboard statistics for the admin dashboard.

interface UseAdminStatsReturn {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdminStats = (): UseAdminStatsReturn => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await testimonialApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, isLoading, error, refetch: fetch };
};
