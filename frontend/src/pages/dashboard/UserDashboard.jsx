import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Icons object
const Icons = {
  Weight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Activity: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Trophy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
  Fire: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Goal: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>,
};

// Reusable Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, unit = "", className = "" }) => (
  <Card className={`transform hover:scale-105 transition-all duration-300 ${className}`}>
    <div className="p-6">
      <div className="flex items-center gap-2 text-gray-950 mb-2">
        <Icon />
        <span className="font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">
        {value || '--'} {unit}
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
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Weight Progress',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Weight (kg)'
      }
    }
  }
};

const StyledInput = ({ label, value, onChange, placeholder, unit, type = "number", min, step }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
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
        <span className="absolute right-3 top-1/2 -translate-y-1/2 
                      text-gray-400 bg-white px-2 text-sm font-medium">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const MonthlyCalendar = ({ month, attendance, onToggle }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{monthNames[month]}</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-xs text-gray-500 font-medium text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Add empty cells for proper day alignment */}
          {Array.from({ length: new Date(2024, month, 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dateKey = `${month + 1}-${day}`;
            const canToggle = isPastMonth || (isCurrentMonth && day <= currentDate.getDate());
            
            return (
              <button
                key={day}
                onClick={() => canToggle && onToggle(dateKey)}
                disabled={!canToggle}
                className={`
                  aspect-square rounded-lg text-sm font-medium
                  transition-all duration-200 flex items-center justify-center
                  ${canToggle ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}
                  ${attendance[dateKey] ? 'bg-green-500 text-white hover:bg-green-950' : 'bg-white'}
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

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for different data categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendance, setAttendance] = useState({});
  
  // Organized state variables for different data types
  const [dashboardData, setDashboardData] = useState({
    profile: {
      age: '',
      gender: '',
      height: '',
      fitnessGoals: [],
      programs: []
    },
    monthlyData: [],
    attendance: [],
    calorieTarget: null,
    targetWeight: null,
    userDetails: {
      budget: '',
      gymEnrolled: false,
      gymName: ''
    }
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      console.log("Fetching user data from:", `${API_BASE_URL}/users/dashboard`);
  
      const response = await axios.get(
        `${API_BASE_URL}/users/dashboard`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
  
      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        const dashboard = response.data.dashboard;
        setDashboardData({
          profile: dashboard.profile || {
            age: '',
            gender: '',
            height: '',
            fitnessGoals: [],
            programs: []
          },
          monthlyData: dashboard.monthlyData || [],
          attendance: dashboard.attendance || [],
          calorieTarget: dashboard.calorieTarget,
          targetWeight: dashboard.targetWeight,
          userDetails: dashboard.userDetails || {
            budget: '',
            gymEnrolled: false,
            gymName: ''
          }
        });

        // Format attendance data if needed
        const formattedAttendance = {};
        if (dashboard.attendance && Array.isArray(dashboard.attendance)) {
          dashboard.attendance.forEach(monthData => {
            if (monthData.daysPresent) {
              const monthIndex = new Date(Date.parse(`${monthData.month} 1, 2024`)).getMonth() + 1;
              monthData.daysPresent.forEach(day => {
                formattedAttendance[`${monthIndex}-${day}`] = true;
              });
            }
          });
        }
        setAttendance(formattedAttendance);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response || error);
      setError(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceToggle = async (dateKey) => {
    try {
      const [monthNum, day] = dateKey.split('-').map(num => parseInt(num));
      const monthName = new Date(2024, monthNum - 1).toLocaleString('default', { month: 'long' });

      const response = await axios.post(
        `${API_BASE_URL}/api/users/attendance`,
        {
          month: monthName,
          day: day
        },
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}` 
          }
        }
      );

      if (response.status === 200) {
        setAttendance(prev => {
          const newAttendance = { ...prev };
          if (newAttendance[dateKey]) {
            delete newAttendance[dateKey];
          } else {
            newAttendance[dateKey] = true;
          }
          return newAttendance;
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update attendance');
    }
  };

  const calculateBMI = () => {
    if (dashboardData.profile.height && dashboardData.monthlyData[0]?.weight) {
      const heightInMeters = parseFloat(dashboardData.profile.height) / 100;
      const currentWeight = dashboardData.monthlyData[0].weight;
      return (currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '--';
  };

  const weightChartData = {
    labels: dashboardData.monthlyData.map(data => 
      new Date(data.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    ) || [],
    datasets: [
      {
        label: 'Weight Progress',
        data: dashboardData.monthlyData.map(data => data.weight) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto"></div>
          <p className="mt-4 text-gray-950">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentWeight = dashboardData.monthlyData[0]?.weight;
  const weightDifference = currentWeight && dashboardData.targetWeight 
    ? Math.abs(currentWeight - dashboardData.targetWeight)
    : null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="p-6 bg-gradient-to-r from-slate-500 to-slate-950 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name || 'Fitness Enthusiast'} 👋
                </h1>
                <p className="text-slate-100 mt-2">
                  {dashboardData.profile.age} years • {dashboardData.profile.gender?.charAt(0).toUpperCase() + dashboardData.profile.gender?.slice(1)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-slate-50">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MotivationCard 
              icon={Icons.Trophy}
              title="Weight Goal Progress"
              message={weightDifference 
                ? `${weightDifference.toFixed(1)}kg to reach ${dashboardData.targetWeight}kg!`
                : 'Set your weight goals!'}
            />
            <MotivationCard 
              icon={Icons.Fire}
              title="Daily Calories"
              message={`Target: ${dashboardData.calorieTarget?.toLocaleString() || '---'} calories`}
            />
            <MotivationCard 
              icon={Icons.Goal}
              title="Fitness Goals"
              message={dashboardData.profile.fitnessGoals?.[0] || 'No goals set'}
            />
            <MotivationCard 
              icon={Icons.Activity}
              title="Active Programs"
              message={dashboardData.profile.programs?.[0] || 'No programs selected'}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={Icons.Weight} 
              title="Current Weight" 
              value={currentWeight} 
              unit="kg"
              className="bg-gradient-to-br from-purple-50 to-white"
            />
            <StatCard 
              icon={Icons.Target} 
              title="Target Weight" 
              value={dashboardData.targetWeight} 
              unit="kg"
              className="bg-gradient-to-br from-green-50 to-white"
            />
            <StatCard 
              icon={Icons.User} 
              title="Height" 
              value={dashboardData.profile.height}
              unit="cm"
              className="bg-gradient-to-br from-blue-50 to-white"
            />
            <StatCard 
              icon={Icons.Chart} 
              title="BMI" 
              value={calculateBMI()}
              className="bg-gradient-to-br from-yellow-50 to-white"
            />
          </div>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Icons.Chart />
              Weight Progress Journey
            </h2>
            <div className="h-[400px] w-full">
              <Line options={chartOptions} data={weightChartData} />
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.Goal />
                Your Fitness Goals
              </h2>
              <div className="space-y-2">
                {dashboardData.profile.fitnessGoals?.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Icons.Trophy className="text-slate-500" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.Activity />
                Your Training Programs
              </h2>
              <div className="space-y-2">
                {dashboardData.profile.programs?.map((program, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Icons.Fire className="text-slate-500" />
                    <span>{program}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
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
          {dashboardData.userDetails && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icons.User />
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-sm text-gray-600">Budget Range</span>
                  <p className="text-lg font-medium">{dashboardData.userDetails.budget || '--'}</p>
                </div>
                {dashboardData.userDetails.gymEnrolled && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <span className="text-sm text-gray-600">Enrolled Gym</span>
                    <p className="text-lg font-medium">{dashboardData.userDetails.gymName}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard; 