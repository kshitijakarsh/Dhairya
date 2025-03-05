import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/gyms/search`, {
        params: { query: searchTerm }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-14">
      {/* Search Header */}
      <div className="text-center mb-16">
        <h1 className="text-[40px] text-gray-900 mb-4">Find Your Perfect Gym</h1>
        <p className="text-gray-500">Search by gym name, location, or facilities</p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-2xl px-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for gyms or enter location..."
            className="w-full py-2 pr-10 border-b border-gray-300 focus:border-gray-400 outline-none text-gray-600 placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaSearch className="h-5 w-5" />
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {results.map((gym) => (
              <div 
                key={gym._id} 
                className="border border-gray-200 rounded p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-2">{gym.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{gym.address.street}, {gym.address.city}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gym.facilities.map((facility, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/gym/${gym._id}`}
                  className="block w-full text-center py-2 bg-black text-white text-sm rounded hover:bg-gray-900 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {results.length === 0 && !loading && searchTerm && (
          <div className="text-center mt-8">
            <p className="text-gray-500">No gyms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
