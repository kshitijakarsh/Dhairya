import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GymRegistration from "./pages/dashboard/GymRegistration";
import { useAuth } from "./contexts/AuthContext";
import Home from './pages/Home';
import Search from './components/common/Search';
import GymDetails from './pages/GymDetails';
import UserProfileForm from './pages/dashboard/UserProfileForm';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProfileGuard from './components/guards/ProfileGuard';

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="login" 
            element={!user ? <Login /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="register" 
            element={!user ? <Register /> : <Navigate to="/" replace />} 
          />
          <Route path="/search" element={<Search />} />
          <Route path="/gym/:id" element={<GymDetails />} />
          
          {/* Protected Routes */}
          <Route 
            path="register-gym" 
            element={
              user ? (
                user.role === 'Owner' ? (
                  <GymRegistration />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/profile/setup" 
            element={
              user ? 
                user.role === 'User' ? 
                  <UserProfileForm /> : 
                  <Navigate to="/" replace /> 
                : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? 
                user.role === 'User' ? 
                  <ProfileGuard>
                    <UserDashboard />
                  </ProfileGuard> 
                  : <Navigate to="/" replace />
                : <Navigate to="/login" replace />
            } 
          />
          
          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;