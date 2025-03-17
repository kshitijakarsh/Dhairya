// src/pages/EnrollmentForm.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnrollmentForm = () => {
  const { id: gymId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gym, plans } = state || {};

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!gym || !plans) {
    navigate('/search');
    return null;
  }

  const calculateEndDate = (planType) => {
    const today = new Date();
    switch (planType) {
      case 'Monthly': return new Date(today.setMonth(today.getMonth() + 1));
      case 'Half Yearly': return new Date(today.setMonth(today.getMonth() + 6));
      case 'Yearly': return new Date(today.setFullYear(today.getFullYear() + 1));
      default: return new Date(today.setMonth(today.getMonth() + 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Please select a plan to continue');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.post(
        `${API_BASE_URL}/memberships/enroll`,
        {
          userId: user._id,
          gymId: gymId,
          membershipType: selectedPlan.toLowerCase(),
          endDate: calculateEndDate(selectedPlan)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Successfully enrolled!');
        navigate(`/gym/${gymId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-8 bg-black text-white text-center">
            <motion.h2 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-2xl font-bold"
            >
              Join {gym.name}
            </motion.h2>
            <p className="mt-2 text-gray-300">Select your membership plan</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Plan Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.button
                  key={plan.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(plan.type)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    selectedPlan === plan.type
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="text-lg font-semibold">{plan.type}</div>
                    <div className="text-3xl font-bold">₹{plan.price}</div>
                    <div className={`text-sm ${selectedPlan === plan.type ? 'text-gray-300' : 'text-gray-500'}`}>
                      {plan.desc}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Submit Button */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-6"
            >
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedPlan}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-lg
                  transition-all duration-200
                  ${selectedPlan 
                    ? 'bg-black text-white hover:bg-gray-900' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  selectedPlan 
                    ? `Confirm ${selectedPlan} Plan` 
                    : 'Select a Plan to Continue'
                )}
              </button>
            </motion.div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => navigate(`/gym/${gymId}`)}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Return to Gym Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnrollmentForm;