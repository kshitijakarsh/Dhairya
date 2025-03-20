import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { STORAGE_KEYS } from '../../constants';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 10);

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/gyms/search`, {
        params: { query: debouncedSearchTerm }
      });
      
      // Validate and format the response data
      const formattedResults = response.data.map(gym => ({
        _id: gym._id || '',
        name: gym.name || 'Unnamed Gym',
        address: {
          street: gym.address?.street || '',
          city: gym.address?.city || '',
          state: gym.address?.state || '',
        },
        facilities: Array.isArray(gym.facilities) ? gym.facilities : [],
        membership_charges: {
          monthly: gym.membership_charges?.monthly || 0,
          half: gym.membership_charges?.half_yearly || 0,
          yearly: gym.membership_charges?.yearly || 0,
        },
        ratings: Array.isArray(gym.ratings) ? gym.ratings : [],
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  // Effect to trigger search when debounced search term changes
  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, handleSearch]);

  const handleEnrollment = async (gymId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/gyms/${gymId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
          }
        }
      );
      
      if (response.data.success) {
        // Update user context or reload user data
        toast.success('Enrollment successful!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-[40px] text-gray-900 mb-4">Find Your Perfect Gym</h1>
        <p className="text-gray-500">Search by gym name, location, or facilities</p>
      </div>

      <div className="w-full max-w-2xl px-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for gyms or enter location..."
            className="w-full py-2 pr-10 border-b border-gray-300 focus:border-gray-400 outline-none text-gray-600 placeholder-gray-400"
          />
          <FaSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {error && (
          <div className="mt-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((gym) => (
                <div 
                  key={gym._id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-[240px] bg-gray-100">
                    <div className="absolute top-6 left-6">
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{gym.name}</h3>
                        <div className="flex items-center gap-2">
                          <FaStar className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg font-semibold text-gray-900">4.8</span>
                          <span className="text-base text-gray-500">({gym.ratings.length} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{gym.membership_charges.monthly}
                        </p>
                        <p className="text-sm text-gray-500">/month</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaMapMarkerAlt className="w-5 h-5 flex-shrink-0 text-gray-500" />
                        <div>
                          <p className="text-base">
                            {[gym.address.street, gym.address.city].filter(Boolean).join(', ')}
                          </p>
                          <p className="text-sm text-gray-400">2.5 miles away</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <FaClock className="w-5 h-5 flex-shrink-0 text-gray-500" />
                        <p className="text-base">Open · 6AM - 10PM</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {gym.facilities.map((facility, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/gym/${gym._id}`}
                        className="px-4 py-2.5 text-center text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      {user ? (
                        user.role === 'User' ? (
                          user.enrolledGyms?.includes(gym._id) ? (
                            <button
                              className="px-4 py-2.5 text-center text-white bg-gray-400 rounded-xl cursor-not-allowed font-medium"
                              disabled
                            >
                              Enrolled
                            </button>
                          ) : (
                            <button
                              className="px-4 py-2.5 text-center text-white bg-black rounded-xl hover:bg-gray-900 transition-colors font-medium"
                              onClick={() => handleEnrollment(gym._id)}
                            >
                              Enroll Now
                            </button>
                          )
                        ) : (
                          <div className="px-4 py-2.5 text-center text-gray-500">
                            Owner Access
                          </div>
                        )
                      ) : (
                        <Link
                          to="/login"
                          className="px-4 py-2.5 text-center text-white bg-black rounded-xl hover:bg-gray-900 transition-colors font-medium"
                        >
                          Login to Enroll
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {results.length === 0 && !loading && searchTerm && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No gyms found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Search;