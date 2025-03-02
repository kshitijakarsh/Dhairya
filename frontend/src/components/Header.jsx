import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaDumbbell, FaSignOutAlt, FaPlus, FaTachometerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from "../assets/logo.png"

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren"
      }
    }
  };

  const mobileItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // Function to render gym owner specific options
  const renderGymOwnerOptions = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center text-gray-700 hover:text-slate-950 px-3 py-2 text-sm font-medium"
      >
        Gym Management
        <svg
          className={`ml-2 h-5 w-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <Link
              to="/gym-owner/register-gym"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaPlus className="mr-2" />
              Register New Gym
            </Link>
            <Link
              to="/gym-owner/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl text-slate-950">Dhairya</span>
            </Link>
          </motion.div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <motion.div
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/search"
                className="text-gray-700 hover:text-slate-950 px-3 py-2 text-sm font-medium"
              >
                Locate
              </Link>
            </motion.div>
            
            {user?.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Render gym owner options if user is a gym owner */}
                {user.role === 'Owner' && renderGymOwnerOptions()}
                
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-slate-950 px-3 py-2 text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-950 hover:bg-slate-800"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-slate-950 px-3 py-2 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-950 hover:bg-slate-800"
                  >
                    Get started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-slate-950"
          >
            <span className="sr-only">Open main menu</span>
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="sm:hidden overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              <motion.div
                variants={mobileItemVariants}
                custom={0}
              >
                <Link
                  to="/search"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Locate
                </Link>
              </motion.div>
              
              {user?.isAuthenticated && user.role === 'Owner' && (
                <>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={1}
                  >
                    <Link
                      to="/gym-owner/register-gym"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register New Gym
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={2}
                  >
                    <Link
                      to="/gym-owner/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                </>
              )}
              
              {user?.isAuthenticated ? (
                <>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={1}
                  >
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={2}
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={1}
                  >
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={mobileItemVariants}
                    custom={2}
                  >
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-slate-950 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
