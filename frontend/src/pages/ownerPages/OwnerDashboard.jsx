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
import { Line, Pie } from "react-chartjs-2";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL, STORAGE_KEYS } from "../../constants";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";
import GymMembers from "./GymMembers";

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
    { id: "members", label: "Members", icon: "👥" },
    { id: "analytics", label: "Gyms", icon: "🏋️" },
  ];

  return (
    <div
      className={`bg-white text-black h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } fixed left-0 top-0 border-r-2 border-slate-900`}
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-300">
        <h2 className={`font-bold text-xl ${collapsed ? "hidden" : "block"}`}>
          Dhairya
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-black/70 hover:text-black p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="mt-6 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full p-4 flex items-center gap-3 rounded-xl transition-all mb-2 ${
              activePage === item.id
                ? "border-2 drop-shadow-md border-black text-black bg-gray-100"
                : "text-black/70 hover:bg-gray-100"
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

// Gym List Component
const GymList = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Format operation hours
  const formatOperationHours = (hours) => {
    if (!hours || !Array.isArray(hours)) return "Hours not available";
    return hours.map((hour) => `${hour.day}: ${hour.open} - ${hour.close}`);
  };

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const response = await axios.get(`${API_BASE_URL}/owner/my-gyms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setGyms(response.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
        toast.error("Failed to load gyms");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Gyms</h2>
        <button
          onClick={() => navigate("/dashboard/gym/register")}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all"
        >
          + Add New Gym
        </button>
      </div>

      {gyms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Gyms Yet
          </h3>
          <p className="text-gray-600 mb-6">Start by adding your first gym</p>
          <button
            onClick={() => navigate("/dashboard/gym/register")}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all"
          >
            Register a Gym
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {gyms.map((gym) => (
            <motion.div
              key={gym._id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col space-y-6">
                  {/* Header Section with Stats */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                        {gym.name}
                      </h3>
                      <p className="text-gray-600">{gym.description}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">
                          {gym.memberships?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹
                          {(
                            gym.membership_charges?.monthly || 0
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Monthly Plan
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Location and Contact */}
                    <div className="space-y-3">
                      <div className="flex items-start text-gray-600">
                        <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm">
                          {gym.address.street}, {gym.address.city},{" "}
                          {gym.address.state}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="text-sm">{gym.phone}</span>
                      </div>
                    </div>

                    {/* Membership Plans */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-sm text-gray-600">
                          Half Yearly
                        </span>
                        <span className="text-sm font-medium">
                          ₹
                          {gym.membership_charges?.half_yearly?.toLocaleString()}
                        </span>
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Yearly</span>
                          <span className="text-sm font-medium">
                            ₹{gym.membership_charges?.yearly?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operation Hours */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <span className="text-sm text-gray-600">
                          {formatOperationHours(gym.operation_hours)}
                        </span>
                      </h4>
                    </div>
                  </div>

                  {/* Footer with Facilities and Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      {gym.facilities?.map((facility, index) => (
                        <span
                          key={index}
                          className="bg-black/5 px-3 py-1 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/gym/${gym._id}`)}
                        className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/gym/edit/${gym._id}`)}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

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
    memberGrowth: {
      labels: [],
      datasets: [
        {
          label: "Total Members",
          data: [],
          borderColor: "rgb(0, 0, 0)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    peakHours: [],
    membershipDistribution: [],
    gymDetails: [],
    membershipBreakdown: {
      monthly: 0,
      half_yearly: 0,
      yearly: 0,
    },
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
          const {
            totalMembers,
            totalRevenue,
            totalGyms,
            gyms,
            membershipBreakdown,
            monthlyMemberships,
          } = response.data;

          // Process monthly data
          const sortedMonths = Object.keys(monthlyMemberships).sort(
            (a, b) => new Date(a) - new Date(b)
          );
          const monthlyData = sortedMonths.map((month) => ({
            month,
            count: monthlyMemberships[month].length,
          }));

          setDashboardData((prev) => ({
            ...prev,
            metrics: {
              activeMembers: totalMembers,
              monthlyRevenue: totalRevenue,
              totalGyms,
            },
            gymDetails: gyms,
            membershipBreakdown,
            memberGrowth: {
              labels: monthlyData.map((data) => data.month),
              datasets: [
                {
                  label: "Total Members",
                  data: monthlyData.map((data) => data.count),
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  tension: 0.4,
                  fill: true,
                },
              ],
            },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Active Members"
                value={dashboardData.metrics.activeMembers.toLocaleString()}
                icon="👥"
              />
              <MetricCard
                title="Monthly Revenue"
                value={`₹${dashboardData.metrics.monthlyRevenue.toLocaleString()}`}
                icon="💰"
              />
              <MetricCard
                title="Total Gyms"
                value={dashboardData.metrics.totalGyms.toLocaleString()}
                icon="🏋️"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Growth Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6">Member Growth</h3>
                <div className="h-[400px]">
                  <Line
                    data={dashboardData.memberGrowth}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          callbacks: {
                            title: (tooltipItems) => tooltipItems[0].label,
                            label: (context) =>
                              `New Members: ${context.raw.toLocaleString()}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0, 0, 0, 0.05)" },
                          ticks: {
                            callback: (value) => value.toLocaleString(),
                          },
                        },
                        x: { grid: { display: false } },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Membership Distribution Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6">
                  Membership Distribution
                </h3>
                <div className="h-[400px] flex items-center justify-center">
                  <Pie
                    data={{
                      labels: ["Monthly", "Half Yearly", "Yearly"],
                      datasets: [
                        {
                          data: [
                            dashboardData.membershipBreakdown.monthly,
                            dashboardData.membershipBreakdown.half_yearly,
                            dashboardData.membershipBreakdown.yearly,
                          ],
                          backgroundColor: [
                            "rgba(0, 0, 0, 0.8)",
                            "rgba(0, 0, 0, 0.5)",
                            "rgba(0, 0, 0, 0.3)",
                          ],
                          borderColor: "white",
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { font: { weight: "500" }, padding: 20 },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              const value = context.raw;
                              const percentage = (
                                (value / total) *
                                100
                              ).toFixed(1);
                              return `${context.label}: ${value} members (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Pages */}
        {activePage === "members" && <GymMembers />}
        {activePage === "analytics" && <GymList />}
      </main>
    </div>
  );
};

export default GymOwnerDashboard;
