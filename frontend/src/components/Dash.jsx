import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import workouts from "../assets/workouts.gif";

function Dash() {
  const { user } = useAuth();

  return (
    <section className="py-24 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h2 className="text-4xl font-bold mb-6">
              Powerful Dashboard for{" "}
              <span className="gradient-text">Every User</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our intuitive dashboard provides gym owners with comprehensive management tools,
              trainers with client tracking capabilities, and members with progress monitoring features.
              Everything you need to succeed in one place.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center monochrome-button"
                >
                  Get Started
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center monochrome-button-outline"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/register-gym"
                className="inline-flex items-center justify-center monochrome-button"
              >
                Register Your Gym
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </div>

            <div className="relative">
              <div className="relative z-10 shadow-lg p-2 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                <img
                  src={workouts}
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-500/20 to-gray-500/20 rounded-xl" />
            </div>
          </div>
        </div>
    </section>
  );
}

export default Dash;
