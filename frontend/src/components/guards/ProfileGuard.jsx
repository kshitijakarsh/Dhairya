import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

const ProfileGuard = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/goer/dashboard`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setHasProfile(!!response.data);
    } catch (error) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasProfile) {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
};

export default ProfileGuard; 