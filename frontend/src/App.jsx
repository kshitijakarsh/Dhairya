import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GymRegistration from "./pages/dashboard/GymRegistration";
import { useAuth } from "./contexts/AuthContext";
import Home from './pages/Home';
import Search from './components/common/Search';

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
          
          {/* Protected Routes */}
          <Route 
            path="register-gym" 
            element={user ? <GymRegistration /> : <Navigate to="/login" replace />} 
          />
          
          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;