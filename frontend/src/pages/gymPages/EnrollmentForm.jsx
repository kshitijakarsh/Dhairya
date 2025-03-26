import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnrollmentForm = () => {
  const { gymId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gym, plans } = state || {};

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!gymId) {
    console.error('🚨 Missing gymId parameter');
    navigate('/search');
    return null;
  }

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
      
      const today = new Date();
      const endDate = new Date(today);
      switch(selectedPlan.type) {
        case 'Monthly': endDate.setMonth(endDate.getMonth() + 1); break;
        case 'Half Yearly': endDate.setMonth(endDate.getMonth() + 6); break;
        case 'Yearly': endDate.setFullYear(endDate.getFullYear() + 1); break;
      }

      const requestData = {
        gymId: gymId,
        membershipType: selectedPlan.type.toLowerCase().replace(' ', '_'),
        endDate: endDate.toISOString().split('T')[0]
      };

      console.log('Sending enrollment request:', requestData);

      const response = await axios.post(
        `${API_BASE_URL}/memberships/enroll`,
        requestData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          }
        }
      );

      if (response.data.success) {
        toast.success('Successfully enrolled!');
        if (response.data.membershipId) {
          navigate(`/invoice/${response.data.membershipId}`);
        } else {
          navigate('/user/dashboard');
        }
      }

    } catch (error) {
      console.error('Enrollment error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Enrollment failed';
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-6 border-b border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {gym.name} Membership
            </h2>
            <p className="mt-1 text-sm text-gray-500">Select your plan</p>
          </div>

          <div className="p-4 space-y-6">
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.type}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full p-4 text-left rounded-md transition-all
                    ${
                      selectedPlan?.type === plan.type
                        ? 'bg-gray-100 border-2 border-gray-300'
                        : 'border border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{plan.type}</div>
                      <div className="text-sm text-gray-500 mt-1">{plan.desc}</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      ₹{plan.price?.toLocaleString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Gateway Scaffolding */}
            {/* {selectedPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 border-t border-gray-100"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Payment Details
                </h3>
                
                // Payment form elements can be added here later
                <div className="h-32 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    Payment gateway integration
                  </span>
                </div>
              </motion.div>
            )} */}

            
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedPlan}
              className={`
                w-full py-3 px-4 rounded-md font-medium text-white
                transition-colors
                ${selectedPlan 
                  ? 'bg-gray-900 hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing Enrollment...</span>
                </div>
              ) : (
                selectedPlan 
                  ? `Enroll in ${selectedPlan.type} Plan` 
                  : 'Select a Plan'
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate(`/gym/${gymId}`)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Gym Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollmentForm;