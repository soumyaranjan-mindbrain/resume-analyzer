import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const { maintenanceMode, loading: configLoading } = useConfig();
  const location = useLocation();

  const loading = authLoading || configLoading;

  // Maintenance redirection logic - Only applies to standard users on dashboard/user routes
  const isUserRoute = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/history') ||
    location.pathname.startsWith('/resume-maker') ||
    location.pathname.startsWith('/matches') ||
    location.pathname.startsWith('/recommendations') ||
    location.pathname.startsWith('/insights') ||
    location.pathname.startsWith('/support');

  const shouldMaintenanceRedirect = maintenanceMode && user?.role === 'user' && isUserRoute;

  React.useEffect(() => {
    if (shouldMaintenanceRedirect) {
      logout().then(() => {
        // Redirect to landing page after logout
        window.location.href = '/?maintenance=true';
      });
    }
  }, [shouldMaintenanceRedirect, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-xl">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  if (shouldMaintenanceRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Calibration - Synchronizing Session</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
