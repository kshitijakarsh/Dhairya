import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import hero from "../../assets/hero.svg";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.100),white)]" />
      
      <div className="container relative">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
          <div className="text-center lg:text-left space-y-8 max-w-lg mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              A place to grow{" "}
              <span className="gradient-text">stronger and fitter</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Train hard, stay consistent, and push beyond limits. Strength
              grows with discipline, and fitness fuels confidence, energy, and
              resilience.
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
                <Link
                  to="/register-gym"
                  className="w-full sm:w-auto monochrome-button"
                >
                  Register Your Gym
                </Link>
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
}

export default Hero;
