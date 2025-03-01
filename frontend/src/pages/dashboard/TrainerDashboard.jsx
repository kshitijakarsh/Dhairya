import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const navigation = [
    { id: 'profile', label: 'Manage Profile' },
    { id: 'bookings', label: 'Manage Bookings' },
    { id: 'clients', label: 'Client Progress' },
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
                  to={`/trainer/${item.id}`}
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
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<TrainerProfile />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="clients" element={<ClientProgress />} />
          <Route path="*" element={<Navigate to="profile" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const TrainerProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    specialization: '',
    experience: '',
    certifications: '',
    bio: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Trainer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <input
            type="text"
            value={profileData.specialization}
            onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
          <input
            type="number"
            value={profileData.experience}
            onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

const ManageBookings = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
    {/* Add booking management functionality */}
  </div>
);

const ClientProgress = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Client Progress</h2>
    {/* Add client progress tracking */}
  </div>
);

export default TrainerDashboard; 