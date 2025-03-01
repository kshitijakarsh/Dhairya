import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const navigation = [
    { id: 'users', label: 'Manage Users & Gyms' },
    { id: 'payments', label: 'Monitor Payments' },
    { id: 'disputes', label: 'Handle Disputes' },
    { id: 'ads', label: 'Advertisement Module' },
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
                  to={`/admin/${item.id}`}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeTab === item.id
                      ? 'border-red-500 text-gray-900'
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
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="payments" element={<MonitorPayments />} />
          <Route path="disputes" element={<HandleDisputes />} />
          <Route path="ads" element={<AdvertisementModule />} />
          <Route path="*" element={<Navigate to="users" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const ManageUsers = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Manage Users & Gyms</h2>
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">User Management</h3>
        {/* Add user management table/interface */}
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Gym Management</h3>
        {/* Add gym management table/interface */}
      </div>
    </div>
  </div>
);

const MonitorPayments = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Payment Monitoring</h2>
    {/* Add payment monitoring dashboard */}
  </div>
);

const HandleDisputes = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Dispute Resolution</h2>
    {/* Add dispute handling interface */}
  </div>
);

const AdvertisementModule = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-6">Advertisement Module</h2>
    {/* Add advertisement management interface */}
  </div>
);

export default AdminDashboard; 