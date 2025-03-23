import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Sidebar = ({ collapsed, setCollapsed, activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'GridIcon' },
    { id: 'members', label: 'Members & Subscriptions', icon: 'UsersIcon' },
    { id: 'trainers', label: 'Trainers & Staff', icon: 'UserGroupIcon' },
    { id: 'revenue', label: 'Revenue & Billing', icon: 'CurrencyIcon' },
    { id: 'analytics', label: 'Gym Analytics', icon: 'ChartIcon' },
    { id: 'settings', label: 'Settings', icon: 'CogIcon' }
  ];

  return (
    <div className={`bg-slate-900 text-white h-screen transition-all duration-300 
                    ${collapsed ? 'w-20' : 'w-64'} fixed left-0 top-0`}>
      <div className="p-4 flex justify-between items-center">
        <h2 className={`font-bold ${collapsed ? 'hidden' : 'block'}`}>
          Dhairya Dashboard
        </h2>
        <button onClick={() => setCollapsed(!collapsed)} 
                className="text-white hover:bg-slate-700 p-2 rounded">
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="mt-8">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full p-4 flex items-center gap-3 transition-colors
                      ${activePage === item.id ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
          >
            <span className="text-xl">{/* Icon Component */}</span>
            <span className={collapsed ? 'hidden' : 'block'}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-500">{icon}</span>
      {trend && (
        <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-gray-600 mt-1">{title}</p>
  </div>
);

// Activity Feed Component
const ActivityFeed = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
          <span className="text-2xl">{activity.icon}</span>
          <div>
            <p className="font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// AI Insights Widget Component
const AIInsights = ({ insights }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <span>AI Insights</span>
      <span className="text-blue-400">✨</span>
    </h3>
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm">{insight.message}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-slate-300">{insight.category}</span>
            <button className="text-xs text-blue-400 hover:text-blue-300">
              Learn More →
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Mock Data Constants
const MOCK_CHART_DATA = {
  memberGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Total Members',
      data: [150, 180, 210, 240, 280, 320],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  },
  peakHours: {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
    datasets: [{
      label: 'Average Visitors',
      data: [15, 45, 32, 25, 20, 28, 50, 35, 15],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8
    }]
  },
  membershipDistribution: {
    labels: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(99, 102, 241, 0.8)'
      ]
    }]
  }
};

const MOCK_ACTIVITIES = [
  {
    icon: '👋',
    title: 'New member John Doe enrolled',
    time: '5 minutes ago'
  },
  {
    icon: '💰',
    title: 'Payment received from Sarah Smith',
    time: '15 minutes ago'
  },
  {
    icon: '🎯',
    title: 'Monthly target achieved',
    time: '1 hour ago'
  },
  {
    icon: '📊',
    title: 'Weekly report generated',
    time: '2 hours ago'
  },
  {
    icon: '🏋️',
    title: 'New trainer Michael joined',
    time: '3 hours ago'
  }
];

const MOCK_INSIGHTS = [
  {
    message: 'Member attendance is 25% higher on Mondays. Consider adding more morning classes.',
    category: 'Attendance Insight'
  },
  {
    message: 'Revenue has increased by 15% compared to last month due to new membership plans.',
    category: 'Revenue Insight'
  },
  {
    message: 'Peak hours are shifting earlier. Consider adjusting trainer schedules.',
    category: 'Operations Insight'
  }
];

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};

// Main Dashboard Component
const GymOwnerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      activeMembers: 320,
      monthlyRevenue: 450000,
      trainerAvailability: 85,
      dailyCheckIns: 145
    },
    memberGrowth: MOCK_CHART_DATA.memberGrowth,
    peakHours: MOCK_CHART_DATA.peakHours,
    membershipDistribution: MOCK_CHART_DATA.membershipDistribution,
    activities: MOCK_ACTIVITIES,
    insights: MOCK_INSIGHTS
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className={`transition-all duration-300 
                       ${collapsed ? 'ml-20' : 'ml-64'} p-8`}>
        {activePage === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Members"
                value={dashboardData.metrics.activeMembers}
                icon="👥"
                trend={5}
              />
              <MetricCard
                title="Monthly Revenue"
                value={`₹${dashboardData.metrics.monthlyRevenue.toLocaleString()}`}
                icon="💰"
                trend={8}
              />
              <MetricCard
                title="Trainer Availability"
                value={`${dashboardData.metrics.trainerAvailability}%`}
                icon="🏋️"
                trend={-2}
              />
              <MetricCard
                title="Daily Check-ins"
                value={dashboardData.metrics.dailyCheckIns}
                icon="✅"
                trend={3}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Member Growth</h3>
                <div className="h-80">
                  <Line 
                    key="memberGrowth"
                    data={dashboardData.memberGrowth} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Peak Hours</h3>
                <div className="h-80">
                  <Bar 
                    key="peakHours"
                    data={dashboardData.peakHours} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </div>

            {/* Membership Distribution and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Membership Distribution</h3>
                <div className="h-80">
                  <Pie 
                    key="membershipDistribution"
                    data={dashboardData.membershipDistribution}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <ActivityFeed activities={dashboardData.activities} />
                <AIInsights insights={dashboardData.insights} />
              </div>
            </div>
          </div>
        )}

        {/* Other Pages */}
        {activePage === 'members' && <div>Members & Subscriptions Content</div>}
        {activePage === 'trainers' && <div>Trainers & Staff Content</div>}
        {activePage === 'revenue' && <div>Revenue & Billing Content</div>}
        {activePage === 'analytics' && <div>Gym Analytics Content</div>}
        {activePage === 'settings' && <div>Settings Content</div>}
      </main>
    </div>
  );
};

export default GymOwnerDashboard;
