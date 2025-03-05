import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaDumbbell } from 'react-icons/fa';
import { API_BASE_URL, ENDPOINTS, STORAGE_KEYS } from '../../constants';

const GymRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    phone: '',
    facilities: [],
    operation_hours: [
      {
        day: 'All Days',
        open: '',
        close: ''
      }
    ],
    membership_charges: {
      monthly: '',
      yearly: '',
      family: ''
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const facilityOptions = [
    'Cardio Equipment',
    'Weight Training',
    'Personal Training',
    'Yoga Classes',
    'Swimming Pool',
    'Locker Room',
    'Shower',
    'Parking',
    'Wifi',
    'Cafe'
  ];

  // Helper function to format time to HH:mm
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes || '00'}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      
      if (parent === 'operation_hours') {
        // Handle operation hours time fields
        const index = parseInt(child);
        const field = subChild;
        
        setFormData(prev => ({
          ...prev,
          operation_hours: prev.operation_hours.map((hours, idx) => 
            idx === index ? { ...hours, [field]: formatTime(value) } : hours
          )
        }));
      } else {
        // Handle other nested fields
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!user || !user._id) {
        throw new Error('User information not found');
      }

      // Validate time format
      const openTime = formData.operation_hours[0].open;
      const closeTime = formData.operation_hours[0].close;
      
      if (!openTime || !closeTime) {
        setError('Operating hours are required');
        setLoading(false);
        return;
      }

      // Format the data according to the backend schema
      const formattedData = {
        name: formData.name.trim(),
        owner: user._id,
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          zip: formData.address.zip.trim(),
          country: formData.address.country.trim()
        },
        phone: formData.phone.trim(),
        operation_hours: [
          {
            day: 'All Days',
            open: formatTime(openTime),
            close: formatTime(closeTime)
          }
        ],
        facilities: formData.facilities,
        membership_charges: {
          monthly: parseFloat(formData.membership_charges.monthly) || 0,
          yearly: parseFloat(formData.membership_charges.monthly) * 11,
          family: parseFloat(formData.membership_charges.monthly) * 2.5
        },
        description: formData.description.trim()
      };

      // Debug log
      console.log('Sending data:', formattedData);

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.REGISTER_GYM}`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Gym registration successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        console.error('Full error response:', error.response);
        console.error('Error data:', error.response.data);
        
        if (error.response.data.type === 'ValidationError') {
          const errors = error.response.data.message;
          if (Array.isArray(errors)) {
            const errorMessages = errors.map(err => {
              console.log('Validation error:', err);
              return `${err.path}: ${err.message}`;
            }).join('\n');
            setError(errorMessages);
          } else {
            setError(error.response.data.message);
          }
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to register gym. Please check your input and try again.');
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setError(error.message || 'Failed to register gym');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative h-40 bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              >
                <FaDumbbell className="text-white text-5xl mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">Register Your Gym</h2>
              <p className="text-slate-200 text-sm mt-2">Fill in the details to get started</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                {error.split('\n').map((err, index) => (
                  <p key={index} className="text-sm text-red-600">{err}</p>
                ))}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Basic Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gym Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                {/* Location Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        required
                        value={formData.address.street}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        required
                        value={formData.address.city}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        required
                        value={formData.address.state}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="address.zip"
                        required
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Operating Hours and Fees */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Operating Hours & Fees</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Hours
                      </label>
                      <input
                        type="time"
                        name="operation_hours.0.open"
                        required
                        value={formData.operation_hours[0].open}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Hours
                      </label>
                      <input
                        type="time"
                        name="operation_hours.0.close"
                        required
                        value={formData.operation_hours[0].close}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Fee
                      </label>
                      <input
                        type="number"
                        name="membership_charges.monthly"
                        required
                        value={formData.membership_charges.monthly}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {facilityOptions.map((facility) => (
                      <div key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          id={facility}
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                        />
                        <label htmlFor={facility} className="ml-2 text-sm text-gray-700">
                          {facility}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </div>
                  ) : (
                    "Register Gym"
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

export default GymRegistration; 