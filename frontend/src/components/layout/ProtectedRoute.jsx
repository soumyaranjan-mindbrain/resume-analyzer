import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const { maintenanceMode, loading: configLoading } = useConfig();

  const loading = authLoading || configLoading;

  // Maintenance redirection logic - Only applies to standard users (non-admins)
  const shouldMaintenanceRedirect = maintenanceMode && user?.role !== 'admin';

  React.useEffect(() => {
    if (shouldMaintenanceRedirect) {
      logout('/?maintenance=true');
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
    return <Navigate to="/" replace />;
  }

  // Onboarding redirection - Only for students
  const isStudent = user.role === 'student';
  const needsOnboarding = isStudent && !user.userType;
  const isOnboardingPage = window.location.pathname === '/onboarding';

  if (needsOnboarding && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
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
