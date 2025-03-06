import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import hero from "../../assets/hero.svg";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Perfect <span className="gradient-text">Fitness</span> Journey
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover and connect with the best gyms in your area. Whether you're a fitness enthusiast, 
              trainer, or gym owner, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto monochrome-button"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto monochrome-button-outline"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                user.role === 'Owner' && (
                  <Link
                    to="/register-gym"
                    className="w-full sm:w-auto monochrome-button"
                  >
                    Register Your Gym
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="relative lg:ml-4">
            <img
              src={hero}
              alt="Fitness Illustration"
              className="w-full h-auto transform transition-transform duration-500 hover:scale-105"
            />
            
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gray-200/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gray-200/50 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
