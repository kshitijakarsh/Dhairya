// API URLs
export const API_BASE_URL = 'https://dhairya-9pat.onrender.com/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  OWNER_DASHBOARD: '/dashboard',
  REGISTER_GYM: '/dashboard/gym/register',
  EDIT_GYM: '/dashboard/gym/edit',
  USER_DASHBOARD: '/user/dashboard',
  PROFILE_SETUP: '/profile/setup',
  SEARCH: '/search',
  GYM_DETAILS: '/gym',
};

// User Roles
export const USER_ROLES = {
  OWNER: 'Owner',
  USER: 'User',
};

// Role Mappings
export const ROLE_MAPPINGS = {
  [USER_ROLES.GYM_OWNER]: 'Owner',
  [USER_ROLES.GYM_GOER]: 'User',
  [USER_ROLES.TRAINER]: 'Trainer',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
};

// API Endpoints
export const ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  VERIFY: '/users/verify',
  REGISTER_GYM: '/gyms/register',
  MY_GYMS: '/gyms/my-gyms',
  GYM: '/gyms',
  SEARCH_GYMS: '/gyms/search',
};

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3,
};

// Feature Flags
export const FEATURES = {
  ENABLE_SEARCH: true,
  ENABLE_NOTIFICATIONS: false,
}; 