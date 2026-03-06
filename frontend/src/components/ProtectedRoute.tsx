import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullPageLoader } from '../components/Loader';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <FullPageLoader />;
    }

    if (!isAuthenticated) {
        // Redirect to login page, but save the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Role mismatch, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
