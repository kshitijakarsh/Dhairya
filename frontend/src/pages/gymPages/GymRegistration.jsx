import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { FaDumbbell, FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const GymRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    owner: user?.id || '',
    address: { street: '', city: '', state: '', zip: '', country: 'India' },
    phone: '',
    operation_hours: [{ day: 'Monday', open: '06:00', close: '22:00' }],
    facilities: [],
    membership_charges: { monthly: '', half_yearly: '', yearly: '' },
    description: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const facilityOptions = [
    "Cardio Equipment", "Weightlifting", "Personal Training", "Swimming Pool",
    "Yoga Studio", "Sauna", "CrossFit", "Zumba", "Martial Arts", "Locker Room",
    "Shower", "Parking", "Cafe", "Pro Shop", "Child Care"
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Gym name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Gym name must be at least 3 characters';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number';
    }

    // Address validation
    if (!formData.address.street || formData.address.street.length < 3) {
      newErrors['address.street'] = 'Street address must be at least 3 characters';
    }
    if (!formData.address.city || formData.address.city.length < 2) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.state || formData.address.state.length < 2) {
      newErrors['address.state'] = 'State is required';
    }
    if (!/^\d{6}$/.test(formData.address.zip)) {
      newErrors['address.zip'] = 'Enter a valid 6-digit PIN code';
    }

    // Operation hours validation
    if (formData.operation_hours.length === 0) {
      newErrors.operation_hours = 'At least one operation hour is required';
    } else {
      const uniqueDays = new Set(formData.operation_hours.map(h => h.day));
      if (uniqueDays.size !== formData.operation_hours.length) {
        newErrors.operation_hours = 'Each day can only be selected once';
      }
    }

    // Facilities validation
    if (formData.facilities.length === 0) {
      newErrors.facilities = 'Select at least one facility';
    }

    // Membership charges validation
    const charges = formData.membership_charges;
    if (!charges.monthly || charges.monthly <= 0) {
      newErrors['membership_charges.monthly'] = 'Enter a valid monthly charge';
    }
    if (!charges.half_yearly || charges.half_yearly <= 0) {
      newErrors['membership_charges.half_yearly'] = 'Enter a valid half yearly charge';
    }
    if (!charges.yearly || charges.yearly <= 0) {   
      newErrors['membership_charges.yearly'] = 'Enter a valid yearly charge';
    }

    // Description validation
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    // Image validation
    if (images.length > 5) {
      newErrors.images = 'Maximum 5 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
    // Clear error when user starts typing
    if (errors[`address.${name}`]) {
      setErrors(prev => ({ ...prev, [`address.${name}`]: '' }));
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
    if (errors.facilities) {
      setErrors(prev => ({ ...prev, facilities: '' }));
    }
  };

  const handleOperationHoursChange = (index, field, value) => {
    setFormData(prev => {
      const updatedHours = [...prev.operation_hours];
      updatedHours[index][field] = value;
      return { ...prev, operation_hours: updatedHours };
    });
    if (errors.operation_hours) {
      setErrors(prev => ({ ...prev, operation_hours: '' }));
    }
  };

  const addOperationHour = () => {
    setFormData(prev => ({
      ...prev,
      operation_hours: [
        ...prev.operation_hours,
        { day: daysOfWeek.find(day => !prev.operation_hours.find(h => h.day === day)) || daysOfWeek[0],
          open: '06:00',
          close: '22:00'
        }
      ]
    }));
  };

  const removeOperationHour = (index) => {
    setFormData(prev => ({
      ...prev,
      operation_hours: prev.operation_hours.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 5 - images.length;
    
    if (availableSlots <= 0) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);
    const newImages = [];
    const newPreviews = [];

    filesToAdd.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (files.length > availableSlots) {
      toast.error(`Only ${availableSlots} more images can be added`);
    }

    setImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error('Please login to register a gym.');

      const formPayload = new FormData();
      
      // Append structured data
      formPayload.append('name', formData.name);
      formPayload.append('owner', formData.owner);
      formPayload.append('phone', formData.phone);
      formPayload.append('address', JSON.stringify(formData.address));
      formPayload.append('operation_hours', JSON.stringify(formData.operation_hours));
      formPayload.append('facilities', JSON.stringify(formData.facilities));
      formPayload.append('membership_charges', JSON.stringify({
        monthly: Number(formData.membership_charges.monthly),
        half_yearly: Number(formData.membership_charges.half_yearly),
        yearly: Number(formData.membership_charges.yearly)
      }));
      formPayload.append('description', formData.description);
      
      // Append images
      images.forEach(image => {
        formPayload.append('images', image);
      });

      // Add logging here
      console.log("📤 Sending registration request with:", {
        formData: {
          ...formData,
          operation_hours: formData.operation_hours,
          facilities: formData.facilities,
          membership_charges: formData.membership_charges
        },
        images: images.map(img => ({
          name: img.name,
          type: img.type,
          size: img.size
        }))
      });

      console.log("📦 FormData contents:");
      for (let [key, value] of formPayload.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `${API_BASE_URL}/owner/register`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Gym registered successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-gray-900 to-black">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <FaDumbbell className="text-white text-5xl mb-4" />
              <h2 className="text-3xl font-bold text-white">Register Your Gym</h2>
              <p className="mt-2 text-gray-200">Provide details to list your gym</p>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Gym Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter gym name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 w-full px-4 py-3 border rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData.address).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData.address[key]}
                      onChange={handleAddressChange}
                      className={`mt-1 w-full px-4 py-3 border rounded-xl ${
                        errors[`address.${key}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={key === 'country'}
                    />
                    {errors[`address.${key}`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`address.${key}`]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`mt-1 w-full px-4 py-3 border rounded-xl ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your gym, its unique features, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={() => handleFacilityChange(facility)}
                        checked={formData.facilities.includes(facility)}
                        className="rounded text-black focus:ring-black"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
                {errors.facilities && (
                  <p className="mt-1 text-sm text-red-500">{errors.facilities}</p>
                )}
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                {formData.operation_hours.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <select
                      value={entry.day}
                      onChange={(e) => handleOperationHoursChange(index, "day", e.target.value)}
                      className="px-3 py-2 border rounded-xl"
                    >
                      {daysOfWeek.map(day => (
                        <option
                          key={day}
                          value={day}
                          disabled={formData.operation_hours.some((h, i) => i !== index && h.day === day)}
                        >
                          {day}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={entry.open}
                      onChange={(e) => handleOperationHoursChange(index, "open", e.target.value)}
                      className="px-3 py-2 border rounded-xl"
                    />
                    <input
                      type="time"
                      value={entry.close}
                      onChange={(e) => handleOperationHoursChange(index, "close", e.target.value)}
                      className="px-3 py-2 border rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeOperationHour(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOperationHour}
                  disabled={formData.operation_hours.length >= 7}
                  className="mt-2 flex items-center space-x-1 text-black hover:text-gray-700 disabled:opacity-50"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Operating Hours</span>
                </button>
                {errors.operation_hours && (
                  <p className="mt-1 text-sm text-red-500">{errors.operation_hours}</p>
                )}
              </div>

              {/* Membership Charges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(formData.membership_charges).map((type) => (
                  <div key={type}>
                    <label className="block text-sm font-medium text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      name={`membership_charges.${type}`}
                      value={formData.membership_charges[type]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        membership_charges: {
                          ...prev.membership_charges,
                          [type]: e.target.value
                        }
                      }))}
                      className={`mt-1 w-full px-4 py-3 border rounded-xl ${
                        errors[`membership_charges.${type}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={`Enter ${type} fee`}
                    />
                    {errors[`membership_charges.${type}`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`membership_charges.${type}`]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Gym Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gym Photos (Maximum 5)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Image previews */}
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${index}`}
                        className="h-32 w-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload button */}
                  <label className={`h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
                    images.length >= 5 ? 
                      'border-gray-300 bg-gray-100 cursor-not-allowed' : 
                      'border-gray-300 hover:border-black'
                  } transition-colors`}>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                      disabled={images.length >= 5}
                    />
                    <div className="text-center">
                      <FaImage className={`mx-auto mb-1 ${images.length >= 5 ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-xs ${images.length >= 5 ? 'text-gray-400' : 'text-gray-600'}`}>
                        {images.length >= 5 ? 'Maximum 5 images' : `Upload Images (${images.length}/5)`}
                      </span>
                    </div>
                  </label>
                </div>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
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
