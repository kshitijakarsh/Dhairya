import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../constants";

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative group"
    >
      <span className={`block px-4 py-2 text-base font-medium transition-colors duration-200 ${
        isActive ? 'text-black' : 'text-gray-600 hover:text-black'
      }`}>
        {children}
      </span>
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black origin-left transform transition-transform duration-200 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`} />
    </Link>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center">
              <span className="text-xl text-slate-900">Dhairya</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <NavLink to={ROUTES.SEARCH}>Locate</NavLink>

            {user ? (
              <div className="flex items-center space-x-6">
                {user.role === 'Owner' ? (
                  <>
                    <NavLink to={ROUTES.OWNER_DASHBOARD}>Dashboard</NavLink>
                    <NavLink to={ROUTES.REGISTER_GYM}>Register Gym</NavLink>
                  </>
                ) : (
                  <NavLink to={ROUTES.USER_DASHBOARD}>Dashboard</NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <NavLink to={ROUTES.LOGIN}>Login</NavLink>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-900 transition-colors duration-200"
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
              <span className="text-base">Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden"
            >
              <div className="pt-2 pb-3 space-y-2">
                <Link
                  to={ROUTES.SEARCH}
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Locate
                </Link>

                {user ? (
                  <>
                    {user.role === 'Owner' ? (
                      <>
                        <Link
                          to={ROUTES.OWNER_DASHBOARD}
                          className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          My Gyms
                        </Link>
                        <Link
                          to={ROUTES.REGISTER_GYM}
                          className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          Register Gym
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={ROUTES.USER_DASHBOARD}
                        className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-black transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
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
