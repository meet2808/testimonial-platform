// ─── Shared TypeScript Types ──────────────────────────────────────────────────

export type TestimonialStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Testimonial {
  id: string;
  customerName: string;
  email: string;
  company: string;
  message: string;
  rating: number;
  profileImageUrl: string | null;
  status: TestimonialStatus;
  consentGiven: boolean;
  submittedAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ─── Query Params for Admin Testimonial List ──────────────────────────────────
export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  status?: TestimonialStatus | 'ALL';
  search?: string;
  sortBy?: 'submittedAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
