import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { FaDumbbell, FaWeight, FaRuler, FaFire, FaCheck } from 'react-icons/fa';

const UserProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    height: '',
    calorieTarget: '',
    programmes: [], // From schema
    budget: '', // From schema
    location: '' // From schema
  });

  // Available programmes from schema
  const programmeOptions = [
    "Cardio",
    "Weightlifting",
    "Zumba",
    "CrossFit",
    "Yoga",
    "Boxing",
    "HIIT",
    "Pilates",
    "Calisthenics",
    "Powerlifting",
    "Bodybuilding",
    "Olympic Weightlifting",
    "Kickboxing",
    "Spinning",
    "Athletic Conditioning",
    "Circuit Training",
    "Martial Arts",
    "Swimming",
    "Functional Training"
  ];

  const budgetRanges = [
    "₹500 - ₹1000",
    "₹1000 - ₹2000",
    "₹2000 - ₹3000",
    "₹3000 - ₹5000",
    "₹5000+"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgrammesChange = (program) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.includes(program)
        ? prev.programmes.filter(p => p !== program)
        : [...prev.programmes, program]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Please login to continue');

      // Add initial weight entry with current date
      const weightEntry = {
        weight: parseFloat(formData.currentWeight),
        date: new Date().toISOString()
      };

      await axios.post(
        `${API_BASE_URL}/users/profile`,
        {
          ...formData,
          weightHistory: [weightEntry],
          userId: user._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-gray-900 to-black">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              >
                <FaDumbbell className="text-white text-5xl mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Complete Your Fitness Profile</h2>
              <p className="mt-2 text-gray-200">Help us personalize your fitness journey</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 lg:p-12">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Measurements Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaWeight className="w-4 h-4 mr-2" />
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="currentWeight"
                      value={formData.currentWeight}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                      placeholder="Enter your current weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaWeight className="w-4 h-4 mr-2" />
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="targetWeight"
                      value={formData.targetWeight}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                      placeholder="Enter your target weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaRuler className="w-4 h-4 mr-2" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                      placeholder="Enter your height"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaFire className="w-4 h-4 mr-2" />
                      Daily Calorie Target
                    </label>
                    <input
                      type="number"
                      name="calorieTarget"
                      value={formData.calorieTarget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                      placeholder="Enter your daily calorie target"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Training Programs
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {programmeOptions.map(program => (
                        <div 
                          key={program}
                          className="relative flex items-center"
                        >
                          <div 
                            onClick={() => handleProgrammesChange(program)}
                            className={`
                              flex items-center justify-between w-full p-4 rounded-xl cursor-pointer
                              border transition-all duration-200
                              ${formData.programmes.includes(program)
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 hover:border-black'
                              }
                            `}
                          >
                            <span className="text-sm font-medium">{program}</span>
                            {formData.programmes.includes(program) && (
                              <FaCheck className="w-4 h-4 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Select all that apply
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Monthly Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                    >
                      <option value="">Select your budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-gray-300 hover:border-black focus:border-black focus:ring-black transition-colors duration-200"
                      placeholder="Enter your preferred gym location"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Profile...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileForm; 