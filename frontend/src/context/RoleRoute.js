import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ children, roles = [] }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" state={{ reason: 'expired' }} />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/profile" />;
    }

    return children;
}

