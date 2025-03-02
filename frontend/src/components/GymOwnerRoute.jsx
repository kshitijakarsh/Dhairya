import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GymOwnerRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default GymOwnerRoute; 