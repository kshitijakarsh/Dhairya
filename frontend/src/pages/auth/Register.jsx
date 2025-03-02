import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaDumbbell, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from '../../contexts/AuthContext';

const roles = [
  {
    id: "User",
    icon: <FaUser className="text-4xl text-blue-500" />,
    title: "Gym Goer",
    description: "Access gyms and track your fitness journey",
    color: "blue",
  },
  {
    id: "Owner",
    icon: <FaUserTie className="text-4xl text-green-500" />,
    title: "Gym Owner",
    description: "Manage your gym and grow your business",
    color: "green",
  },
  {
    id: "Trainer",
    icon: <FaDumbbell className="text-4xl text-purple-500" />,
    title: "Trainer",
    description: "Connect with clients and offer training",
    color: "purple",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
    setStep(2);
    console.log("Selected role:", role); // Debug log
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.terms = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/users/register", formData);
      await login(response.data.token);

      if (formData.role === "Owner") {
        navigate("/gym-owner/register-gym");
      } else {
        const dashboardRoutes = {
          'User': '/gym-goer',
          'Trainer': '/trainer',
          'Admin': '/admin'
        };
        navigate(dashboardRoutes[formData.role] || '/');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-40 bg-gradient-to-r from-slate-950 to-slate-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative text-center">
              <FaDumbbell className="mx-auto text-white text-5xl mb-2" />
              <h2 className="text-2xl font-bold text-white">Join Dhairya</h2>
              <p className="text-gray-200 text-sm">Join 4600+ members today!</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Choose your role</h3>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 
                          ${formData.role === role.id 
                            ? "border-slate-950 shadow-lg" 
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg bg-${role.color}-100 
                            group-hover:bg-${role.color}-200 transition-colors duration-200`}>
                            {role.icon}
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-800">{role.title}</h4>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to roles
                  </button>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={`pl-12 pr-4 py-3.5 block w-full rounded-lg border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:ring-2 focus:ring-slate-950 focus:border-transparent text-base`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`pl-12 pr-4 py-3.5 block w-full rounded-lg border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:ring-2 focus:ring-slate-950 focus:border-transparent text-base`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="8"
                          className={`pl-12 pr-4 py-3.5 block w-full rounded-lg border ${
                            errors.password ? "border-red-500" : "border-gray-300"
                          } shadow-sm focus:ring-2 focus:ring-slate-950 focus:border-transparent text-base`}
                          placeholder="Create a password (min. 8 characters)"
                        />
                        {errors.password && (
                          <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="pt-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={formData.acceptTerms}
                            onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                            className="h-4 w-4 text-slate-950 focus:ring-slate-950 border-gray-300 rounded"
                          />
                        </div>
                        <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                          I agree to the{" "}
                          <Link 
                            to="/terms" 
                            className="text-slate-950 underline hover:text-gray-700"
                          >
                            Terms and Conditions
                          </Link>
                        </label>
                      </div>
                      {errors.terms && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.terms}</p>
                      )}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-4">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent 
                               text-base font-medium rounded-lg text-white bg-slate-950 hover:bg-slate-800 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-950 
                               transition-all duration-150 ease-in-out disabled:opacity-50 mt-6"
                    >
                      {isLoading ? (
                        <svg 
                          className="animate-spin h-5 w-5 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-slate-950 hover:text-gray-700 transition-colors duration-150"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
