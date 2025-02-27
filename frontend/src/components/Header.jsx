import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <header className="relative py-2 md:py-4">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex rounded">
              <img className="w-auto h-8" src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button type="button" className="text-gray-900">
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-base font-medium text-gray-900 transition-all duration-200 hover:text-opacity-50">Dashboard</Link>
                <Link to="/profile" className="text-base font-medium text-gray-900 transition-all duration-200 hover:text-opacity-50">Profile</Link>
                <button onClick={handleLogout} className="px-5 py-2 text-base font-semibold leading-7 text-gray-900 transition-all duration-200 bg-transparent border border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium text-gray-900 transition-all duration-200 hover:text-opacity-50">Login</Link>
                <Link to="/signup" className="px-5 py-2 text-base font-semibold leading-7 text-gray-900 transition-all duration-200 bg-transparent border border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white">
                  Join community
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
