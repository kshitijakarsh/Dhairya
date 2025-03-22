import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Icons = {
  Weight: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
      />
    </svg>
  ),
  Target: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Activity: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Save: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Trophy: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Fire: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
    </svg>
  ),
  Chart: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Goal: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  ),
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, unit = "", className = "" }) => (
  <Card
    className={`transform hover:scale-105 transition-all duration-300 ${className}`}
  >
    <div className="p-6">
      <div className="flex items-center gap-2 text-gray-950 mb-2">
        <Icon />
        <span className="font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">
        {value || "--"} {unit}
      </div>
    </div>
  </Card>
);

const MotivationCard = ({ icon: Icon, title, message }) => (
  <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 text-slate-950 mb-2">
      <Icon />
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-gray-950 text-sm">{message}</p>
  </div>
);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          size: 14,
        },
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12,
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: false,
      ticks: {
        font: {
          size: 12,
        },
      },
      title: {
        display: true,
        text: "Weight (kg)",
        font: {
          size: 14,
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 3,
      hoverRadius: 6,
    },
  },
};

const StyledInput = ({
  label,
  value,
  onChange,
  placeholder,
  unit,
  type = "number",
  min,
  step,
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">{label}</label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 
                 transition-all duration-200 bg-white
                 placeholder-gray-400 text-gray-700"
      />
      {unit && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 
                      text-gray-400 bg-white px-2 text-sm font-medium"
        >
          {unit}
        </span>
      )}
    </div>
  </div>
);

const MonthlyCalendar = ({ month, attendance, onToggle }) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month) => {
    const year = new Date().getFullYear();
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month);
  const currentDate = new Date();
  const isCurrentMonth = month === currentDate.getMonth();
  const isPastMonth = month < currentDate.getMonth();

  // Add weekday headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 p-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[month].substring(0, 3)}
        </h3>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day) => (
            <div key={day} className="text-[0.6rem] text-gray-500 text-center">
              {day[0]}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Calendar cells with compact styling */}
          {Array.from({ length: new Date(2024, month, 1).getDay() }).map(
            (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            )
          )}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = `${month + 1}-${day}`;
            const canToggle =
              isPastMonth || (isCurrentMonth && day <= currentDate.getDate());

            return (
              <button
                key={day}
                onClick={() => canToggle && onToggle(dateKey)}
                disabled={!canToggle}
                className={`
                  aspect-square rounded-sm text-xs
                  transition-colors duration-150
                  ${
                    canToggle
                      ? "hover:bg-gray-100"
                      : "cursor-not-allowed opacity-50"
                  }
                  ${
                    attendance[dateKey]
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-50"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const EditableStatCard = ({
  icon: Icon,
  title,
  value,
  unit,
  onSave,
  label,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  // Reset local state when value changes
  useEffect(() => {
    setEditedValue(value);
    setIsEditing(false);
  }, [value]);

  const handleSave = async () => {
    if (editedValue === value) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const success = await onSave({
        [label]:
          unit === "kg" ? parseFloat(editedValue) : parseInt(editedValue),
      });

      if (success) {
        toast.success(`${title} updated!`, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      setEditedValue(value);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      className={`relative transition-all ${
        isEditing ? "ring-2 ring-slate-500" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon />
          <span className="font-medium">{title}</span>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <StyledInput
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              type="number"
              min="0"
              step={unit === "kg" ? "0.1" : "1"}
              className="flex-1"
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 text-white bg-slate-500 rounded-lg hover:bg-slate-600 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : <Icons.Save />}
            </button>
          </div>
        ) : (
          <div
            className="text-3xl font-bold cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {value || "--"} {unit}
          </div>
        )}
      </div>
    </Card>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendance, setAttendance] = useState({});
  const [dashboard, setDashboard] = useState({
    profile: {
      age: "",
      gender: "",
      height: "",
      fitnessGoals: [],
      programs: [],
    },
    monthlyData: [],
    calorieTarget: null,
    targetWeight: null,
    userDetails: { budget: "", gymEnrolled: false, gymName: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const { data } = await axios.get(`${API_BASE_URL}/goer/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.success) {
          setDashboard({
            ...data.dashboard,
            profileImage: data.dashboard.profileImage || user?.profileImage,
          });
          setAttendance(formatAttendance(data.dashboard.attendance));
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.profileImage]);

  const formatAttendance = (attendanceData = []) => {
    return attendanceData.reduce((acc, { month, daysPresent = [] }) => {
      const monthIndex = new Date(`${month} 1, 2024`).getMonth() + 1;
      daysPresent.forEach((day) => (acc[`${monthIndex}-${day}`] = true));
      return acc;
    }, {});
  };

  const handleAttendanceToggle = async (dateKey) => {
    try {
      const [monthNum, day] = dateKey.split("-");
      const monthName = new Date(2024, monthNum - 1).toLocaleString("default", {
        month: "long",
      });

      await axios.patch(
        `${API_BASE_URL}/goer/update`,
        {
          attendance: {
            month: monthName,
            day: parseInt(day),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              STORAGE_KEYS.AUTH_TOKEN
            )}`,
          },
        }
      );

      setAttendance((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));

      // Refresh attendance data after update
      const { data } = await axios.get(`${API_BASE_URL}/goer/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            STORAGE_KEYS.AUTH_TOKEN
          )}`,
        },
      });
      setAttendance(formatAttendance(data.dashboard.attendance));

      toast.success("Attendance updated!");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const getWeightMetrics = () => {
    // Get the most recent weight entry (last in array)
    const latestWeightEntry = dashboard.monthlyData.slice(-1)[0];
    const currentWeight = latestWeightEntry?.weight;
    const targetWeight = dashboard.targetWeight;
    const weightDifference =
      currentWeight && targetWeight
        ? Math.abs(currentWeight - targetWeight)
        : null;

    return { currentWeight, targetWeight, weightDifference };
  };

  const calculateBMI = () => {
    const { currentWeight } = getWeightMetrics();
    const height = dashboard.profile.height;
    return height && currentWeight
      ? (currentWeight / (height / 100) ** 2).toFixed(1)
      : "--";
  };

  const handleUpdateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // Optimistic update for weight
      if (updateData.currentWeight) {
        setDashboard((prev) => ({
          ...prev,
          monthlyData: [
            ...prev.monthlyData,
            {
              weight: updateData.currentWeight,
              date: new Date().toISOString(),
            },
          ],
        }));
      }

      // Optimistic update for other fields
      setDashboard((prev) => ({
        ...prev,
        ...updateData,
        profile: {
          ...prev.profile,
          ...(updateData.height && { height: updateData.height }),
        },
      }));

      await axios.patch(`${API_BASE_URL}/goer/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = await axios.get(`${API_BASE_URL}/goer/dashboard`);
      setDashboard(data.dashboard);

      return true;
    } catch (error) {
      const { data } = await axios.get(`${API_BASE_URL}/goer/dashboard`);
      setDashboard(data.dashboard);

      toast.error(error.response?.data?.message || "Update failed");
      return false;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto"></div>
          <p className="mt-4 text-gray-950">Loading your dashboard...</p>
        </div>
      </div>
    );

  const { currentWeight, targetWeight, weightDifference } = getWeightMetrics();
  const { age, gender, fitnessGoals, programs } = dashboard.profile;
  const { budget, gymEnrolled, gymName } = dashboard.userDetails;

  console.log("Profile Image URL:", user?.profileImage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <Card className="p-6 bg-gradient-to-r from-slate-500 to-slate-950 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image Section */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg overflow-hidden transition-all duration-300 group-hover:border-white/40">
                <img
                  src={dashboard.profileImage || user?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback =
                      e.target.parentElement.querySelector(".fallback");
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              <div className="fallback hidden w-full h-full bg-slate-700 absolute top-0 left-0 items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {user?.name || "Fitness Enthusiast"}
                <span className="text-xl">👋</span>
              </h1>
              <div className="mt-2 space-y-1">
                <p className="text-slate-100">
                  {age} years •{" "}
                  {gender?.charAt(0).toUpperCase() + gender?.slice(1)}
                </p>
                <p className="text-slate-200 text-sm">
                  Member since{" "}
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>

            {/* Date Display */}
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg mt-4 md:mt-0 self-start">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MotivationCard
            icon={Icons.Trophy}
            title="Weight Goal Progress"
            message={
              weightDifference
                ? `${weightDifference.toFixed(1)}kg to reach ${targetWeight}kg!`
                : "Set your weight goals!"
            }
          />
          <MotivationCard
            icon={Icons.Fire}
            title="Daily Calories"
            message={`Target: ${
              dashboard.calorieTarget?.toLocaleString() || "---"
            } calories`}
          />
          <MotivationCard
            icon={Icons.Goal}
            title="Fitness Goals"
            message={fitnessGoals?.[0] || "No goals set"}
          />
          <MotivationCard
            icon={Icons.Activity}
            title="Active Programs"
            message={programs?.[0] || "No programs selected"}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <EditableStatCard
            icon={Icons.Weight}
            title="Current Weight"
            value={currentWeight}
            unit="kg"
            label="currentWeight"
            onSave={handleUpdateProfile}
          />
          <EditableStatCard
            icon={Icons.Target}
            title="Target Weight"
            value={targetWeight}
            unit="kg"
            label="targetWeight"
            onSave={handleUpdateProfile}
          />
          <EditableStatCard
            icon={Icons.User}
            title="Height"
            value={dashboard.profile.height}
            unit="cm"
            label="height"
            onSave={handleUpdateProfile}
          />
          <StatCard icon={Icons.Chart} title="BMI" value={calculateBMI()} />
        </div>

        {/* Weight Progress Chart */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Icons.Chart />
              Weight Progress Journey
            </h2>
            <div className="text-sm text-gray-500">
              {dashboard.monthlyData.length} data points
            </div>
          </div>
          <div className="h-[500px] w-full">
            <Line
              options={chartOptions}
              data={{
                labels: dashboard.monthlyData.map((d) =>
                  new Date(d.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Weight Progress",
                    data: dashboard.monthlyData.map((d) => d.weight),
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
            />
          </div>
        </Card>

        {/* Goals and Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListSection
            title="Your Fitness Goals"
            items={fitnessGoals}
            icon={Icons.Trophy}
          />
          <ListSection
            title="Your Training Programs"
            items={programs}
            icon={Icons.Activity}
          />
        </div>

        {/* Attendance Calendar */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Icons.Calendar />
            Attendance Tracker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, i) => (
              <MonthlyCalendar
                key={i}
                month={i}
                attendance={attendance}
                onToggle={handleAttendanceToggle}
              />
            ))}
          </div>
        </Card>

        {/* User Details */}
        {dashboard.userDetails && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.User />
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Budget Range" value={budget} />
              {gymEnrolled && (
                <DetailItem label="Enrolled Gym" value={gymName} />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Extracted Components
const ListSection = ({ title, items = [], icon: Icon }) => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
      <Icon />
      {title}
    </h2>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg"
        >
          <Icon className="text-slate-500" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  </Card>
);

const DetailItem = ({ label, value }) => (
  <div className="p-4 bg-slate-50 rounded-lg">
    <span className="text-sm text-gray-600">{label}</span>
    <p className="text-lg font-medium">{value || "--"}</p>
  </div>
);

export default UserDashboard;
