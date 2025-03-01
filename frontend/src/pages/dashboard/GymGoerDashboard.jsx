import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const GymGoerDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');

  const navigation = [
    { id: 'search', label: 'Search Gyms' },
    { id: 'membership', label: 'My Memberships' },
    { id: 'workouts', label: 'Track Workouts' },
    { id: 'community', label: 'Community Forum' },
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
                  to={`/gym-goer/${item.id}`}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === item.id
                      ? 'border-blue-500 text-gray-900'
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="search" element={<SearchGyms />} />
          <Route path="membership" element={<MyMemberships />} />
          <Route path="workouts" element={<TrackWorkouts />} />
          <Route path="community" element={<CommunityForum />} />
        </Routes>
      </main>
    </div>
  );
};

// Placeholder components
const SearchGyms = () => <div>Search Gyms Component</div>;
const MyMemberships = () => <div>My Memberships Component</div>;
const TrackWorkouts = () => <div>Track Workouts Component</div>;
const CommunityForum = () => <div>Community Forum Component</div>;

export default GymGoerDashboard;
