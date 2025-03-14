import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { FaDumbbell, FaEdit, FaTrash, FaPlus, FaChartLine, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GymCard = ({ gym, onEdit, onDelete }) => {
  const averageRating = gym.ratings?.length 
    ? (gym.ratings.reduce((acc, curr) => acc + curr.rating, 0) / gym.ratings.length).toFixed(1)
    : 'No ratings';

  const formatPrice = (price) => {
    return price >= 10000 ? `${Math.floor(price/1000)}K` : price;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
    >
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">
            {gym.name}
          </h3>
          <div className="px-3 py-1.5 bg-gray-100 rounded-full">
            <span className="font-semibold text-gray-700">{averageRating} ★</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-8">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Address</h4>
            <div className="text-gray-700 leading-relaxed">
              {gym.address.street},
              <br />
              {gym.address.city}, {gym.address.state},
              <br />
              {gym.address.zip}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Contact</h4>
            <div className="text-gray-700">{gym.phone}</div>
          </div>
        </div>

        {/* Facilities Section */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Available Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {gym.facilities.map((facility, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Operating Hours Section */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Operating Hours</h4>
          <div className="grid grid-cols-2 gap-3">
            {gym.operation_hours.map((hour, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="text-xl font-semibold text-gray-900 mb-2">
                  {hour.day}
                </div>
                <div className="text-gray-600 text-lg">
                  {hour.open} - {hour.close}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Section */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Membership Plans</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative bg-gray-100 p-4 rounded-xl group hover:bg-gray-900 transition-colors duration-200">
              <div className="text-gray-700 font-medium mb-1 group-hover:text-gray-400">Monthly</div>
              <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                ₹{formatPrice(gym.membership_charges.monthly)}
              </div>
            </div>
            <div className="relative bg-gray-100 p-4 rounded-xl group hover:bg-gray-900 transition-colors duration-200">
              <div className="text-gray-700 font-medium mb-1 group-hover:text-gray-400">Yearly</div>
              <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                ₹{formatPrice(gym.membership_charges.yearly)}
              </div>
            </div>
            <div className="relative bg-gray-100 p-4 rounded-xl group hover:bg-gray-900 transition-colors duration-200">
              <div className="text-gray-700 font-medium mb-1 group-hover:text-gray-400">Family</div>
              <div className="text-2xl font-bold text-gray-900 group-hover:text-white">
                ₹{formatPrice(gym.membership_charges.family)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onEdit(gym)}
            className="flex items-center px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(gym._id)}
            className="flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const GymOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Please login to view your gyms');

      const response = await axios.get(
        `${API_BASE_URL}/gyms/my-gyms`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGyms(response.data.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch gyms";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gym) => {
    navigate(`/dashboard/gym/edit/${gym._id}`, { state: { gym } });
  };

  const handleDelete = async (gymId) => {
    if (!window.confirm('Are you sure you want to delete this gym?')) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Please login to delete gym');

      const response = await axios.delete(
        `${API_BASE_URL}/gyms/${gymId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Gym deleted successfully');
        setGyms(gyms.filter(gym => gym._id !== gymId));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete gym";
      toast.error(errorMessage);
    }
  };

  const handleAddGym = () => {
    navigate('/dashboard/gym/register');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Gyms</h1>
            <p className="mt-1 text-gray-500">Manage all your registered gyms</p>
          </div>
          <button
            onClick={handleAddGym}
            className="flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Gym
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {gyms.length === 0 ? (
          <div className="text-center py-12">
            <FaDumbbell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No gyms found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new gym.</p>
            <div className="mt-6">
              <button
                onClick={handleAddGym}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                <FaPlus className="mr-2" />
                Add New Gym
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map(gym => (
              <GymCard
                key={gym._id}
                gym={gym}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymOwnerDashboard; 