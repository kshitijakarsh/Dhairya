import React from "react";
import Layout from "./Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GymOwnerDashboard from "./pages/dashboard/GymOwnerDashboard";
import GymGoerDashboard from "./pages/dashboard/GymGoerDashboard";
import TrainerDashboard from "./pages/dashboard/TrainerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import Search from './components/Search';

function App() {
  const { user } = useAuth();

  // Helper function to redirect authenticated users
  const AuthRoute = ({ children }) => {
    return !user ? children : <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home page - accessible to all */}
        <Route index element={<Home />} />
        
        {/* Search route - accessible to all */}
        <Route path="search" element={<Search />} />
        
        {/* Auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected routes */}
        <Route path="profile" element={
          <ProtectedRoute>
            {/* <Profile /> */}
          </ProtectedRoute>
        } />

        {/* Gym Owner Routes */}
        <Route path="gym-owner/*" element={
          <ProtectedRoute roles={['gym-owner']}>
            <Routes>
              <Route index element={<GymOwnerDashboard />} />
              <Route path="gyms" element={<GymOwnerDashboard />} />
              <Route path="trainers" element={<GymOwnerDashboard />} />
              <Route path="members" element={<GymOwnerDashboard />} />
              <Route path="*" element={<Navigate to="/gym-owner" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Trainer Routes */}
        <Route path="trainer/*" element={
          <ProtectedRoute roles={['trainer']}>
            <Routes>
              <Route index element={<TrainerDashboard />} />
              <Route path="schedule" element={<TrainerDashboard />} />
              <Route path="clients" element={<TrainerDashboard />} />
              <Route path="*" element={<Navigate to="/trainer" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Gym Goer Routes */}
        <Route path="gym-goer/*" element={
          <ProtectedRoute roles={['gym-goer']}>
            <Routes>
              <Route index element={<GymGoerDashboard />} />
              <Route path="memberships" element={<GymGoerDashboard />} />
              <Route path="workouts" element={<GymGoerDashboard />} />
              <Route path="*" element={<Navigate to="/gym-goer" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="admin/*" element={
          <ProtectedRoute roles={['admin']}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="gyms" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
