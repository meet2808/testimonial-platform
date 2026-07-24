import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminTestimonials } from '../../hooks/useAdminTestimonials';
import { useAdminStats } from '../../hooks/useAdminStats';
import { testimonialApi } from '../../api/testimonial.api';
import {
  Testimonial,
  AdminTestimonialQuery,
  PageLimit,
  TestimonialStatus,
} from '../../types';
import { formatDateTime, extractErrorMessage } from '../../utils/formatters';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | null;
  color: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon }) => (
  <div className={`bg-gray-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5">
        {value === null ? <Spinner size="sm" /> : value.toLocaleString()}
      </p>
    </div>
  </div>
);

// ─── Admin Dashboard Page ──────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { result, isLoading, error, fetch } = useAdminTestimonials();
  const { stats, refetch: refetchStats } = useAdminStats();

  // ── Query state ──────────────────────────────────────────────────────────
  const [query, setQuery] = useState<AdminTestimonialQuery>({
    page: 1,
    limit: 10,
    status: 'ALL',
    search: '',
    sortBy: 'submittedAt',
    sortOrder: 'desc',
  });

  // ── UI state ─────────────────────────────────────────────────────────────
  const [detailTestimonial, setDetailTestimonial] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // ID of testimonial being acted on
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    void fetch(query);
  }, [query, fetch]);

  useEffect(() => {
    void refetchStats();
  }, [refetchStats]);

  // ── Debounced search ──────────────────────────────────────────────────────
  const handleSearchChange = (val: string): void => {
    setSearchInput(val);
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => {
      setQuery((q) => ({ ...q, search: val, page: 1 }));
    }, 400);
    setSearchTimeout(t);
  };

  // ── Query helpers ─────────────────────────────────────────────────────────
  const updateQuery = (updates: Partial<AdminTestimonialQuery>): void => {
    setQuery((q) => ({ ...q, ...updates, page: 1 }));
  };

  const setPage = (page: number): void => {
    setQuery((q) => ({ ...q, page }));
  };

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleApprove = useCallback(async (id: string): Promise<void> => {
    setActionLoading(id);
    setActionError(null);
    try {
      await testimonialApi.approve(id);
      void fetch(query);
      void refetchStats();
      if (detailTestimonial?.id === id) setDetailTestimonial(null);
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [query, fetch, refetchStats, detailTestimonial]);

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleReject = useCallback(async (id: string): Promise<void> => {
    setActionLoading(id);
    setActionError(null);
    try {
      await testimonialApi.reject(id);
      void fetch(query);
      void refetchStats();
      if (detailTestimonial?.id === id) setDetailTestimonial(null);
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [query, fetch, refetchStats, detailTestimonial]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (): Promise<void> => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    setActionError(null);
    try {
      await testimonialApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      void fetch(query);
      void refetchStats();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [deleteTarget, query, fetch, refetchStats]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async (): Promise<void> => {
    await logout();
    void navigate('/admin/login', { replace: true });
  };

  const testimonials = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top nav */}
      <header className="border-b border-white/10 bg-gray-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => void handleLogout()}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total"
            value={stats?.total ?? null}
            color="bg-indigo-500/15"
            icon={<svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
          />
          <StatCard
            label="Pending"
            value={stats?.pending ?? null}
            color="bg-amber-500/15"
            icon={<svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Approved"
            value={stats?.approved ?? null}
            color="bg-emerald-500/15"
            icon={<svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Rejected"
            value={stats?.rejected ?? null}
            color="bg-red-500/15"
            icon={<svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Filters */}
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by name, email, or company..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Status filter */}
              <select
                value={query.status}
                onChange={(e) => updateQuery({ status: e.target.value as TestimonialStatus | 'ALL' })}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer"
              >
                <option value="ALL" className="bg-gray-900">All Status</option>
                <option value="PENDING" className="bg-gray-900">Pending</option>
                <option value="APPROVED" className="bg-gray-900">Approved</option>
                <option value="REJECTED" className="bg-gray-900">Rejected</option>
              </select>

              {/* Sort by */}
              <select
                value={`${query.sortBy}-${query.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-') as ['submittedAt' | 'rating', 'asc' | 'desc'];
                  updateQuery({ sortBy, sortOrder });
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer"
              >
                <option value="submittedAt-desc" className="bg-gray-900">Newest First</option>
                <option value="submittedAt-asc" className="bg-gray-900">Oldest First</option>
                <option value="rating-desc" className="bg-gray-900">Highest Rating</option>
                <option value="rating-asc" className="bg-gray-900">Lowest Rating</option>
              </select>

              {/* Page size */}
              <select
                value={query.limit}
                onChange={(e) => updateQuery({ limit: Number(e.target.value) as PageLimit })}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors cursor-pointer"
              >
                <option value={10} className="bg-gray-900">10 / page</option>
                <option value={25} className="bg-gray-900">25 / page</option>
                <option value={50} className="bg-gray-900">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {actionError}
            <button onClick={() => setActionError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-gray-500">Loading testimonials...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <p className="text-red-400 font-medium mb-2">Failed to load testimonials</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && testimonials.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">No testimonials found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Table content */}
          {!isLoading && !error && testimonials.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Customer</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Rating</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Message</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden xl:table-cell">Submitted</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {testimonials.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={t.customerName} imageUrl={t.profileImageUrl} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-32">{t.customerName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-32">{t.company}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <StarRating rating={t.rating} size="sm" />
                      </td>

                      {/* Message preview */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-xs text-gray-400 max-w-xs truncate">{t.message}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge status={t.status} />
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <time className="text-xs text-gray-500" dateTime={t.submittedAt}>
                          {formatDateTime(t.submittedAt)}
                        </time>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View detail */}
                          <button
                            onClick={() => setDetailTestimonial(t)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="View testimonial detail"
                            title="View detail"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Approve */}
                          {t.status !== 'APPROVED' && (
                            <button
                              onClick={() => void handleApprove(t.id)}
                              disabled={actionLoading === t.id}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                              aria-label="Approve testimonial"
                              title="Approve"
                            >
                              {actionLoading === t.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )}

                          {/* Reject */}
                          {t.status !== 'REJECTED' && (
                            <button
                              onClick={() => void handleReject(t.id)}
                              disabled={actionLoading === t.id}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                              aria-label="Reject testimonial"
                              title="Reject"
                            >
                              {actionLoading === t.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Delete testimonial"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Showing{' '}
                <span className="text-white font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="text-white font-medium">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Button>

                <span className="text-xs text-gray-400 px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(pagination.page + 1)}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={detailTestimonial !== null}
        onClose={() => setDetailTestimonial(null)}
        title="Testimonial Detail"
        maxWidth="lg"
      >
        {detailTestimonial && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar
                name={detailTestimonial.customerName}
                imageUrl={detailTestimonial.profileImageUrl}
                size="lg"
              />
              <div>
                <p className="text-lg font-semibold text-white">{detailTestimonial.customerName}</p>
                <p className="text-sm text-gray-400">{detailTestimonial.company}</p>
                <p className="text-xs text-gray-500">{detailTestimonial.email}</p>
              </div>
              <div className="ml-auto flex flex-col items-end gap-2">
                <Badge status={detailTestimonial.status} />
                <StarRating rating={detailTestimonial.rating} size="sm" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <blockquote className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                &ldquo;{detailTestimonial.message}&rdquo;
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                <p className="text-gray-300">{formatDateTime(detailTestimonial.submittedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                <p className="text-gray-300">{formatDateTime(detailTestimonial.updatedAt)}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-white/10">
              {detailTestimonial.status !== 'APPROVED' && (
                <Button
                  variant="success"
                  size="sm"
                  isLoading={actionLoading === detailTestimonial.id}
                  onClick={() => void handleApprove(detailTestimonial.id)}
                >
                  Approve
                </Button>
              )}
              {detailTestimonial.status !== 'REJECTED' && (
                <Button
                  variant="secondary"
                  size="sm"
                  isLoading={actionLoading === detailTestimonial.id}
                  onClick={() => void handleReject(detailTestimonial.id)}
                >
                  Reject
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setDeleteTarget(detailTestimonial);
                  setDetailTestimonial(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Testimonial"
        maxWidth="sm"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-300">
                This action is <strong>permanent</strong> and cannot be undone. The testimonial from{' '}
                <strong>{deleteTarget.customerName}</strong> will be deleted forever.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading === deleteTarget.id}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={actionLoading === deleteTarget.id}
                onClick={() => void handleDelete()}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
