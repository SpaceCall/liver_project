import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Protected({ children, publicOnly = false, role, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; 

  if (publicOnly && user) {
    const from = location.state?.from || '/profile';
    return <Navigate to={from} replace />;
  }
  
  
  if (!publicOnly && !user) {
    return <Navigate to="/login" state={{ reason: 'expired', from: location }} replace />;
  }

  const allowedRoles = roles || (role ? [role] : []);
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
