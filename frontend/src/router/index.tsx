import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/ui/Spinner';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Code splitting — each page is its own bundle, loaded only when visited.
const SubmissionPage = lazy(() => import('../pages/SubmissionPage'));
const PublicWallPage = lazy(() => import('../pages/PublicWallPage'));
const WidgetPage = lazy(() => import('../pages/WidgetPage'));
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));

// ─── Loading Fallback ─────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
    <Spinner size="lg" />
  </div>
);

// ─── App Router ───────────────────────────────────────────────────────────────
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SubmissionPage />} />
          <Route path="/testimonials" element={<PublicWallPage />} />
          <Route path="/widget" element={<WidgetPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
