import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Guards admin pages behind authentication.
// While session is being verified (isLoading), shows a full-page spinner.
// If not authenticated after check, redirects to the admin login page.

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
