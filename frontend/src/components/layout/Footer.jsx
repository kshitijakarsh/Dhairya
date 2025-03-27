import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="py-10 bg-slate-900 text-white">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center">
          <img src={Logo} alt="Logo" className="h-12 mb-4" />
          <div className="flex space-x-6 mt-4">
            <Link
              to="/"
              className="text-base transition-all duration-200 hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-base transition-all duration-200 hover:text-gray-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-base transition-all duration-200 hover:text-gray-300"
            >
              Register
            </Link>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-700" />

        <p className="text-sm text-center text-gray-400">
          © {new Date().getFullYear()} All Rights Reserved by Dhairya
        </p>
      </div>
    </footer>
  );
}

export default Footer;
