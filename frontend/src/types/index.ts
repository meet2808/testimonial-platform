// ─── Shared Frontend TypeScript Types ────────────────────────────────────────
// Mirror of backend types — kept in sync manually.

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
  submittedAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type SortBy = 'submittedAt' | 'rating';
export type SortOrder = 'asc' | 'desc';
export type StatusFilter = 'ALL' | TestimonialStatus;
export type PageLimit = 10 | 25 | 50;

export interface AdminTestimonialQuery {
  page: number;
  limit: PageLimit;
  status: StatusFilter;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
