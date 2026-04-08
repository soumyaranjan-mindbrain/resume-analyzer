import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-xl">
        <div className="w-12 h-12 border-4 border-[#4b7bff]/20 border-t-[#4b7bff] rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    // If user is already logged in, redirect away from public pages
    const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
