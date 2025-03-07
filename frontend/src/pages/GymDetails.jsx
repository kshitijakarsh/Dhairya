import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaDumbbell, FaArrowLeft, FaRegHeart, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const GymDetails = () => {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Placeholder images (replace with actual gym images later)
  const images = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/gyms/view/${id}`);
        setGym(response.data);
      } catch (error) {
        console.error('Error fetching gym details:', error);
        setError('Failed to load gym details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGymDetails();
  }, [id]);

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

  if (!gym) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >

      {/* Hero Section with Carousel */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Image Carousel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-full"
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={`${images[currentImageIndex]}?auto=format&fit=crop&w=2000&q=80`}
            alt="Gym"
            className="w-full h-full object-cover"
          />
          
          {/* Carousel Controls */}
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

          {/* Image Indicators */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>


        {/* Hero Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent py-8 z-10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight tracking-tight">{gym.name}</h1>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-4 py-2 hover:bg-white/20 transition-colors">
                  <FaStar className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-200 ml-1">({gym.ratings?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-4 py-2">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  <span className="text-sm">{[gym.address?.street, gym.address?.city].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* About Section */}
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {gym.description || 'Welcome to ' + gym.name + ', your premier fitness destination. We offer state-of-the-art equipment and expert guidance to help you achieve your fitness goals.'}
              </p>
            </section>

            {/* Facilities Section */}
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gym.facilities.map((facility, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaDumbbell className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm font-medium">{facility}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Operating Hours */}
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Operating Hours</h2>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FaClock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-base font-medium text-gray-900">Open Daily</p>
                  <p className="text-sm text-gray-600">6:00 AM to 10:00 PM</p>
                </div>
              </div>
            </section>

            {/* Contact Information - Moved from right column */}
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
                    <p className="text-sm text-gray-600">{gym.phone || 'Contact number not available'}</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base font-medium text-gray-900">Address</p>
                    <address className="not-italic text-sm text-gray-600">
                      {[
                        gym.address?.street,
                        gym.address?.city,
                        gym.address?.state,
                        gym.address?.zip
                      ].filter(Boolean).join(', ')}
                    </address>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>

          {/* Right Column - Pricing Only */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="lg:sticky lg:top-8 lg:h-fit"
          >
            {/* Membership Plans */}
            <section className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Membership Plans</h2>
              <div className="space-y-3">
                {[
                  { type: 'Monthly', price: gym.membership_charges.monthly, desc: 'Pay month-to-month' },
                  { type: 'Yearly', price: gym.membership_charges.yearly, desc: 'Save up to 20%' },
                  { type: 'Family Plan', price: gym.membership_charges.family, desc: 'Up to 4 members' }
                ].map((plan, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <span className="text-base font-medium text-gray-900">{plan.type}</span>
                      <p className="text-xs text-gray-500">{plan.desc}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">₹{plan.price}</span>
                  </motion.div>
                ))}
              </div>
              {!user ? (
                <Link
                  to="/login"
                  className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium text-center block hover:scale-[1.02] text-base"
                >
                  Login to Book
                </Link>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium text-base"
                >
                  Book Now
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