import React, { useState, useEffect } from "react";
import { API_BASE_URL, STORAGE_KEYS } from "../../constants";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const GymMembers = () => {
  const [gymMembers, setGymMembers] = useState({});
  const [monthlyMemberships, setMonthlyMemberships] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedGym, setExpandedGym] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const response = await axios.get(`${API_BASE_URL}/owner/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setGymMembers(response.data.gymMembers);
          setMonthlyMemberships(response.data.monthlyMemberships);
          // Set the most recent month as selected by default
          const months = Object.keys(response.data.monthlyMemberships || {});
          if (months.length > 0) {
            setSelectedMonth(months[months.length - 1]);
          }
        }
      } catch (error) {
        console.error("Error fetching gym members:", error);
        toast.error("Failed to load gym members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gym Members</h1>
          
          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by month:</span>
            <select
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Months</option>
              {monthlyMemberships && Object.keys(monthlyMemberships).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monthly Summary */}
        {selectedMonth && monthlyMemberships[selectedMonth] && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Memberships in {selectedMonth}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyMemberships[selectedMonth].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-lg text-gray-500">
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <span className="text-sm text-gray-500">
                      {member.membershipType}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Gym Members List */}
        <div className="space-y-4">
          {Object.entries(gymMembers).map(([gymName, members]) => (
            <motion.div
              key={gymName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedGym(expandedGym === gymName ? null : gymName)
                }
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl">🏋️</span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {gymName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {members.length} members
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedGym === gymName ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {expandedGym === gymName && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 space-y-4">
                      {members.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No members enrolled yet
                        </div>
                      ) : (
                        members.map((member, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                              {member.profilePicture ? (
                                <img
                                  src={member.profilePicture}
                                  alt={member.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xl text-gray-500">
                                  {member.name?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {member.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                  {member.membershipType}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(member.startDate)} -{" "}
                                  {formatDate(member.endDate)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymMembers;