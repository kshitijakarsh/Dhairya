import React, { useState, useEffect } from "react";
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
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL, STORAGE_KEYS } from "../../constants";
import { toast } from "react-toastify";
import axios from "axios";

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
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "members", label: "Members & Subscriptions", icon: "👥" },
    { id: "trainers", label: "Trainers & Staff", icon: "🏋️" },
    { id: "revenue", label: "Revenue & Billing", icon: "💰" },
    { id: "analytics", label: "Gym Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className={`bg-black text-white h-screen transition-all duration-300 
                    ${collapsed ? "w-20" : "w-64"} fixed left-0 top-0`}
    >
      <div className="p-6 flex justify-between items-center border-b border-white/10">
        <h2 className={`font-bold text-xl ${collapsed ? "hidden" : "block"}`}>
          Dhairya
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/70 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="mt-6 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full p-4 flex items-center gap-3 rounded-xl transition-all mb-2
                      ${
                        activePage === item.id
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={collapsed ? "hidden" : "block text-sm"}>
              {item.label}
            </span>
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
        <span
          className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
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
        <div
          key={index}
          className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg"
        >
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
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Members",
        data: [150, 180, 210, 240, 280, 320],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  peakHours: {
    labels: ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"],
    datasets: [
      {
        label: "Average Visitors",
        data: [15, 45, 32, 25, 20, 28, 50, 35, 15],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  },
  membershipDistribution: {
    labels: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
      },
    ],
  },
};

const MOCK_ACTIVITIES = [
  {
    icon: "👋",
    title: "New member John Doe enrolled",
    time: "5 minutes ago",
  },
  {
    icon: "💰",
    title: "Payment received from Sarah Smith",
    time: "15 minutes ago",
  },
  {
    icon: "🎯",
    title: "Monthly target achieved",
    time: "1 hour ago",
  },
  {
    icon: "📊",
    title: "Weekly report generated",
    time: "2 hours ago",
  },
  {
    icon: "🏋️",
    title: "New trainer Michael joined",
    time: "3 hours ago",
  },
];

const MOCK_INSIGHTS = [
  {
    message:
      "Member attendance is 25% higher on Mondays. Consider adding more morning classes.",
    category: "Attendance Insight",
  },
  {
    message:
      "Revenue has increased by 15% compared to last month due to new membership plans.",
    category: "Revenue Insight",
  },
  {
    message:
      "Peak hours are shifting earlier. Consider adjusting trainer schedules.",
    category: "Operations Insight",
  },
];

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

// Main Dashboard Component
const GymOwnerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      activeMembers: 0,
      monthlyRevenue: 0,
      totalGyms: 0,
      dailyCheckIns: 145,
    },
    memberGrowth: MOCK_CHART_DATA.memberGrowth,
    peakHours: MOCK_CHART_DATA.peakHours,
    membershipDistribution: MOCK_CHART_DATA.membershipDistribution,
    activities: MOCK_ACTIVITIES,
    insights: MOCK_INSIGHTS,
    gymDetails: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const response = await axios.get(`${API_BASE_URL}/owner/dash`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const { totalMembers, totalRevenue, totalGyms, gyms } = response.data;
          console.log(totalMembers, totalRevenue, totalGyms, gyms);

          setDashboardData((prev) => ({
            ...prev,
            metrics: {
              ...prev.metrics,
              activeMembers: totalMembers,
              monthlyRevenue: totalRevenue,
              totalGyms,
            },
            gymDetails: gyms,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } p-8`}
      >
        {activePage === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-black rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl text-white">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {user?.name}
                  </h1>
                  <p className="mt-2 text-gray-400">
                    Here's what's happening across your gyms today
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">👥</span>
                  <span className="text-sm px-4 py-1.5 rounded-full bg-black/5 font-medium">
                    Active Members
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-black mt-2">
                  {dashboardData.metrics.activeMembers.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💰</span>
                  <span className="text-sm px-4 py-1.5 rounded-full bg-black/5 font-medium">
                    Monthly Revenue
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-black mt-2">
                  ₹{dashboardData.metrics.monthlyRevenue.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏋️</span>
                  <span className="text-sm px-4 py-1.5 rounded-full bg-black/5 font-medium">
                    Total Gyms
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-black mt-2">
                  {dashboardData.metrics.totalGyms.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-6">Member Growth</h3>
              <div className="h-[400px]">
                <Line
                  key="memberGrowth"
                  data={{
                    ...dashboardData.memberGrowth,
                    datasets: [
                      {
                        ...dashboardData.memberGrowth.datasets[0],
                        borderColor: "rgb(0, 0, 0)",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          font: {
                            weight: '500'
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            weight: '500'
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Other Pages */}
        {activePage === "members" && <div>Members & Subscriptions Content</div>}
        {activePage === "trainers" && <div>Trainers & Staff Content</div>}
        {activePage === "revenue" && <div>Revenue & Billing Content</div>}
        {activePage === "analytics" && <div>Gym Analytics Content</div>}
        {activePage === "settings" && <div>Settings Content</div>}
      </main>
    </div>
  );
};

export default GymOwnerDashboard;
