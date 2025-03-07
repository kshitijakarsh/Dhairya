import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: '',
    height: '',
    calorieTarget: ''
  });
  const [newWeight, setNewWeight] = useState('');
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.get(
        `${API_BASE_URL}/api/users/dashboard`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (!response.data) {
        setShowForm(true);
      } else {
        setUserData(response.data);
        setMarkedDates(response.data.workoutDates || []);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowForm(true);
      } else {
        setError(error.response?.data?.message || 'Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await axios.post(
        `${API_BASE_URL}/api/users/dashboard`,
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      fetchUserData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create dashboard');
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const weightEntry = {
        weight: parseFloat(newWeight),
        date: new Date().toISOString()
      };

      await axios.post(
        `${API_BASE_URL}/users/weight`,
        { weightEntry },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      fetchUserData();
      setNewWeight('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add weight entry');
    }
  };

  const handleDateClick = async (date) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await axios.post(
        `${API_BASE_URL}/users/workout-date`,
        { date: date.toISOString() },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      fetchUserData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark workout date');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Set Up Your Dashboard</h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Weight (kg)</label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  currentWeight: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetWeight: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  height: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Daily Calorie Target</label>
              <input
                type="number"
                name="calorieTarget"
                value={formData.calorieTarget}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  calorieTarget: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const weightData = {
    labels: userData.weightHistory.map(entry => 
      new Date(entry.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Weight Progress',
        data: userData.weightHistory.map(entry => entry.weight),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Profile Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold">
                  {userData.currentWeight} kg
                </p>
              </div>
              <div>
                <p className="text-gray-600">Target Weight</p>
                <p className="text-2xl font-bold">
                  {userData.targetWeight} kg
                </p>
              </div>
              <div>
                <p className="text-gray-600">Height</p>
                <p className="text-2xl font-bold">
                  {userData.height} cm
                </p>
              </div>
              <div>
                <p className="text-gray-600">Calorie Target</p>
                <p className="text-2xl font-bold">
                  {userData.calorieTarget} kcal
                </p>
              </div>
            </div>

            {/* Add Weight Form */}
            <form onSubmit={handleAddWeight} className="mt-8">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter new weight"
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Add Weight
                </button>
              </div>
            </form>
          </motion.div>

          {/* Weight Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Weight Progress</h2>
            <Line data={weightData} />
          </motion.div>

          {/* Workout Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold mb-6">Workout Calendar</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickDay={handleDateClick}
              tileClassName={({ date }) => {
                if (markedDates.find(dDate => 
                  new Date(dDate).toDateString() === date.toDateString()
                )) {
                  return 'bg-green-500 text-white rounded-full';
                }
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 