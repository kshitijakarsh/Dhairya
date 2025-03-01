import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="pt-20 min-h-screen flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSearch} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gyms, trainers, or workouts..."
              className="w-full py-4 pr-12 text-lg text-gray-700 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-slate-950 transition-colors duration-200 placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-slate-950 transition-colors duration-200"
            >
              <FiSearch className="w-6 h-6" />
            </button>
          </motion.div>

          {/* Optional: Show some trending searches or search suggestions */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-full left-0 right-0 mt-4 text-sm text-gray-500"
            >
              <p className="font-medium mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Yoga Studios', 'Personal Trainers', 'CrossFit', 'Zumba Classes'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Search;
