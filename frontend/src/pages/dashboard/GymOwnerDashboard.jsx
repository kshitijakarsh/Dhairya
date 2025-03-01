import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const GymOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('register-gym');

  const navigation = [
    { id: 'register-gym', label: 'Register Gym' },
    { id: 'manage-gym', label: 'Manage Gym Profile' },
    { id: 'trainer-booking', label: 'Trainer Booking System' },
    { id: 'analytics', label: 'View Analytics & Revenue' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={`/gym-owner/${item.id}`}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === item.id
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<Navigate to="register-gym" replace />} />
          <Route path="register-gym" element={<RegisterGym />} />
          <Route path="manage-gym" element={<ManageGym />} />
          <Route path="trainer-booking" element={<TrainerBooking />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="register-gym" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const RegisterGym = () => {
  const [gymData, setGymData] = useState({
    name: '',
    address: '',
    facilities: '',
    description: '',
    photos: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle gym registration logic
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Register Your Gym</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gym Name</label>
          <input
            type="text"
            value={gymData.name}
            onChange={(e) => setGymData({ ...gymData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={gymData.address}
            onChange={(e) => setGymData({ ...gymData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facilities</label>
          <textarea
            value={gymData.facilities}
            onChange={(e) => setGymData({ ...gymData, facilities: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register Gym
        </button>
      </form>
    </div>
  );
};

const ManageGym = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Manage Gym Profile</h2>
    {/* Add gym management functionality */}
  </div>
);

const TrainerBooking = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Trainer Booking System</h2>
    {/* Add trainer booking system */}
  </div>
);

const Analytics = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Analytics & Revenue</h2>
    {/* Add analytics and revenue tracking */}
  </div>
);

export default GymOwnerDashboard; 