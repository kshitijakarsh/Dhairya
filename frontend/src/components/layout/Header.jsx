import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTimes, FaBars, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../constants";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  

  useEffect(() => {
    if (user && user.role === "User") {
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasProfile(!!response.data);
    } catch (error) {
      setHasProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl text-slate-900">Dhairya</span>
            </Link>
          </div>

          {/* Navigation Links - Always Visible */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link to="/search" className="relative group">
              <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                Locate
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
            {user ? (
              <div className="flex items-center space-x-6">
                {user.role === "Owner" && (
                  <Link to="/register-gym" className="relative group">
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                      Register Gym
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                )}
                {user.role === "User" && (
                  <Link
                    to="/dashboard"
                    className="relative group flex items-center"
                  >
                    <FaUser className="mr-2" />
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                      Dashboard
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="relative group">
                  <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                    Login
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/search"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Locate
                </Link>
                {user ? (
                  <>
                    {user.role === "Owner" && (
                      <Link
                        to="/register-gym"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Register Gym
                      </Link>
                    )}
                    {user.role === "User" && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser className="mr-2" />
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-base font-medium text-white bg-black hover:bg-gray-900 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
