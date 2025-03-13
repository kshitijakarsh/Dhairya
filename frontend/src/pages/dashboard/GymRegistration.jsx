import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { FaDumbbell, FaMapMarkerAlt, FaPhone, FaClock, FaRupeeSign, FaListUl } from 'react-icons/fa';

const GymRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: { street: '', city: '', state: '', zip: '', country: 'India' },
    phone: '',
    operation_hours: [{ day: '', open: '', close: '' }],
    facilities: [],
    membership_charges: { monthly: '', yearly: '', family: '' },
    description: '',
    ratings: []
  });

  const facilityOptions = [
    "Cardio Equipment", "Weightlifting", "Personal Training", "Swimming Pool",
    "Yoga Studio", "Sauna", "CrossFit", "Zumba", "Martial Arts"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleOperationHoursChange = (index, field, value) => {
    setFormData(prev => {
      const updatedHours = [...prev.operation_hours];
      updatedHours[index][field] = value;
      return { ...prev, operation_hours: updatedHours };
    });
  };

  const addOperationHour = () => {
    setFormData(prev => ({
      ...prev,
      operation_hours: [...prev.operation_hours, { day: '', open: '', close: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Please login to register a gym.');

      const response = await axios.post(
        `${API_BASE_URL}/gyms/register`,
        { ...formData, owner: user._id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.status === 201) navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-gray-900 to-black">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <FaDumbbell className="text-white text-5xl mb-4" />
              <h2 className="text-3xl font-bold text-white">Register Your Gym</h2>
              <p className="mt-2 text-gray-200">Provide details to list your gym</p>
            </div>
          </div>
          <div className="p-8 lg:p-12">
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Gym Name" className="w-full px-4 py-3 border rounded-xl" required />
              
              {/* Address Fields */}
              {Object.keys(formData.address).map((key) => (
                <input key={key} type="text" name={key} value={formData.address[key]} onChange={handleAddressChange} placeholder={key} className="w-full px-4 py-3 border rounded-xl" required />
              ))}

              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact Number" className="w-full px-4 py-3 border rounded-xl" required />

              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Gym Description" className="w-full px-4 py-3 border rounded-xl"></textarea>

              {/* Facilities */}
              <div>
                <h3 className="text-lg font-semibold">Select Facilities</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {facilityOptions.map(facility => (
                    <div key={facility} className="flex items-center">
                      <input type="checkbox" onChange={() => handleFacilityChange(facility)} checked={formData.facilities.includes(facility)} />
                      <span className="ml-2">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Membership Charges */}
              {Object.keys(formData.membership_charges).map((key) => (
                <input key={key} type="number" name={key} value={formData.membership_charges[key]} onChange={(e) => setFormData(prev => ({
                  ...prev,
                  membership_charges: { ...prev.membership_charges, [key]: e.target.value }
                }))} placeholder={`${key} Fee`} className="w-full px-4 py-3 border rounded-xl" required />
              ))}

              <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded-xl">
                {loading ? 'Registering...' : 'Register Gym'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GymRegistration;
