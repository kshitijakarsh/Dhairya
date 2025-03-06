import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        `${API_BASE_URL}/users/profile/${user._id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setUserData(response.data);
      setMarkedDates(response.data.workoutDates || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
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
  if (!userData) return <div>No data found</div>;

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