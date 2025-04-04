import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../../constants";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaDumbbell,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const GymDetails = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        setLoading(true);
        setError(""); // Reset error state
        
        // Add timeout to the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await axios.get(
          `${API_BASE_URL}/gyms/view/${id}`,
          {
            signal: controller.signal,
            // Remove auth header since this is a public route
          }
        );

        clearTimeout(timeoutId);

        if (response.data.success) {
          setGym(response.data.data);
        } else {
          setError(response.data.message || "Failed to load gym details");
        }
      } catch (error) {
        console.error("Error fetching gym details:", error);
        if (error.name === 'AbortError') {
          setError("Request timed out. Please try again.");
        } else if (error.response?.status === 404) {
          setError("Gym not found");
        } else {
          setError(error.response?.data?.message || "Failed to load gym details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only check for ID since we don't need auth
      fetchGymDetails();
    }
    
    return () => {
      setGym(null); // Cleanup on unmount
      setError("");
    };
  }, [id]); // Remove user.token dependency since we don't need auth

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-600 text-center mb-4">{error}</p>
        <Link to="/search" className="text-blue-600 hover:underline">
          Return to Search
        </Link>
      </div>
    );
  }
  if (!gym) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No gym data available</p>
      </div>
    );
  }
  const images = gym.images || [];
  const facilities = gym.facilities || [];
  const ratings = gym.ratings || [];
  const operationHours = gym.operation_hours || [];

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const formatMembershipType = (type) => {
    // For display: Convert to Title Case
    if (type.includes('_')) {
      return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const transformMembershipType = (type) => {
    // For backend: Convert to lowercase with underscore
    return type.toLowerCase().replace(' ', '_');
  };

  const handleEnrollment = () => {
    const plans = [
      {
        type: "Monthly",
        backendType: "monthly",
        price: gym.membership_charges.monthly,
        desc: "Pay month-to-month",
      },
      {
        type: "Half Yearly",
        backendType: "half_yearly",
        price: gym.membership_charges.half_yearly,
        desc: "Save up to 20%",
      },
      {
        type: "Yearly",
        backendType: "yearly",
        price: gym.membership_charges.yearly,
        desc: "Up to 4 members",
      },
    ];

    navigate(`/enroll/${id}`, {
      state: {
        gym: gym,
        plans: plans,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="relative h-[400px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-full"
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {images.length > 0 ? (
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={images[currentImageIndex]}
              alt={`${gym.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 z-20">
                <button
                  onClick={prevImage}
                  className="p-3 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition-all text-white"
                >
                  <FaChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-3 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition-all text-white"
                >
                  <FaChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-110"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent py-8 z-10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
                {gym.name || "Gym Name Not Available"}
              </h1>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-4 py-2 hover:bg-white/20 transition-colors">
                  <FaStar className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-200 ml-1">
                    ({ratings?.length || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-4 py-2">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {gym.address
                      ? `${gym.address.street}, ${gym.address.city}`
                      : "Address Not Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{gym.description}</p>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {facilities.map((facility, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaDumbbell className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm font-medium">
                      {facility}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Operating Hours
              </h2>
              <div className="grid gap-3">
                {gym.operation_hours?.map((schedule, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FaClock className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900 w-28">{schedule.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>{formatTime(schedule.open)}</span>
                      <span className="text-gray-400 mx-2">to</span>
                      <span>{formatTime(schedule.close)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaPhone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">
                      {gym.phone || "Contact number not available"}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      Address
                    </p>
                    <address className="not-italic text-sm text-gray-600">
                      {[
                        gym.address?.street,
                        gym.address?.city,
                        gym.address?.state,
                        gym.address?.zip,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </address>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="lg:sticky lg:top-8 lg:h-fit"
          >
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Membership Plans
              </h2>
              <div className="space-y-3">
                {[
                  {
                    type: "Monthly",
                    backendType: "monthly",
                    price: gym.membership_charges.monthly,
                    desc: "Pay month-to-month",
                  },
                  {
                    type: "Half Yearly",
                    backendType: "half_yearly",
                    price: gym.membership_charges.half_yearly,
                    desc: "Save up to 20%",
                  },
                  {
                    type: "Yearly",
                    backendType: "yearly",
                    price: gym.membership_charges.yearly,
                    desc: "Up to 4 members",
                  },
                ].map((plan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <span className="text-base font-medium text-gray-900">
                        {plan.type}
                      </span>
                      <p className="text-xs text-gray-500">{plan.desc}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{plan.price?.toLocaleString() || 0}
                    </span>
                  </motion.div>
                ))}
              </div>

              {!user ? (
                <Link
                  to="/login"
                  className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium text-center block hover:scale-[1.02] text-base"
                >
                  Login to Enroll
                </Link>
              ) : isEnrolled ? (
                <button
                  className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg font-medium text-base cursor-default"
                  disabled
                >
                  Already Enrolled
                </button>
              ) : (
                <motion.button
                  onClick={handleEnrollment}
                  whileHover={{ scale: 1.02 }}
                  disabled={enrollmentLoading}
                  className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {enrollmentLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </span>
                  ) : (
                    "Enroll Now"
                  )}
                </motion.button>
              )}
            </section>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GymDetails;
