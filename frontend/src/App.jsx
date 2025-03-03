import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GymOwnerDashboard from "./pages/dashboard/GymOwnerDashboard";
import GymGoerDashboard from "./pages/dashboard/GymGoerDashboard";
import TrainerDashboard from "./pages/dashboard/TrainerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import Search from "./components/Search";
import GymRegistration from "./pages/dashboard/GymRegistration";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";

function App() {
  const { user } = useAuth();

  // Redirect authenticated users to their respective dashboards
  const AuthRoute = ({ children }) => {
    return !user ? children : <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  };

  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes - Accessible to all users */}
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected Routes - Accessible only to authenticated users */}
          <Route path="profile" element={<ProtectedRoute>{/* Profile Page */}</ProtectedRoute>} />

          {/* Gym Owner Routes - Accessible only to gym owners */}
          <Route path="gym-owner/*" element={<ProtectedRoute roles={["Owner"]} />}>
            <Route path="register-gym" element={<GymRegistration />} />
            <Route path="dashboard" element={<GymOwnerDashboard />} />
          </Route>

          {/* Trainer Routes - Accessible only to trainers */}
          <Route path="trainer/*" element={<ProtectedRoute roles={["Trainer"]} />}>
            <Route index element={<TrainerDashboard />} />
            <Route path="schedule" element={<TrainerDashboard />} />
            <Route path="clients" element={<TrainerDashboard />} />
          </Route>

          {/* Gym Goer Routes - Accessible only to gym goers */}
          <Route path="gym-goer/*" element={<ProtectedRoute roles={["Gym-Goer"]} />}>
            <Route index element={<GymGoerDashboard />} />
            <Route path="memberships" element={<GymGoerDashboard />} />
            <Route path="workouts" element={<GymGoerDashboard />} />
          </Route>

          {/* Admin Routes - Accessible only to admins */}
          <Route path="admin/*" element={<ProtectedRoute roles={["Admin"]} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="gyms" element={<AdminDashboard />} />
          </Route>

          {/* 404 Page - For undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
