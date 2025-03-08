import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const roles = [
  {
    id: 'gym_owner',
    title: 'Gym Owner',
    description: 'Manage your gym, track memberships, and grow your business',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'gym_goer',
    title: 'Gym Goer',
    description: 'Track your workouts, set goals, and monitor your progress',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'trainer',
    title: 'Gym Trainer',
    description: 'Manage clients, create workout plans, and track progress',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registeredUser = await register(formData);
      console.log(registeredUser);
      
      
      if (registeredUser.role === 'User') {
        navigate('/profile/setup');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
          step === 1 ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500'
        }`}>
          1
        </div>
        <div className={`w-16 h-0.5 transition-colors duration-300 ${
          step === 2 ? 'bg-black' : 'bg-gray-300'
        }`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
          step === 2 ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-500'
        }`}>
          2
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 transform transition-all duration-300 hover:scale-105">
              Welcome to Dhairya
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-black hover:text-gray-900 border-b-2 border-transparent hover:border-black transition-all duration-300">
                sign in to your account
              </Link>
            </p>
          </div>

          {getStepIndicator()}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-4"
            >
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className={`transition-all duration-500 transform ${step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 hidden'}`}>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900">Choose your role</h3>
              <p className="mt-1 text-sm text-gray-500">Select how you'll be using Dhairya</p>
            </div>
            <div className="grid gap-4">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group p-6 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none bg-gray-50 hover:bg-white relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  <div className="flex items-start space-x-4 relative">
                    <div className="flex-shrink-0 text-black transform transition-transform group-hover:scale-110 p-2 bg-white rounded-lg group-hover:bg-gray-50">
                      {role.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{role.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-500 transform ${step === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'}`}>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 text-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 text-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      required
                      className="block w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 text-sm pr-10"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-black transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-black transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to role selection
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white py-3 px-6 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:bg-gray-800"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
