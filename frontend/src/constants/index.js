// API URLs
export const API_BASE_URL = 'http://localhost:3000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_GYM: '/register-gym',
};

// User Roles
export const USER_ROLES = {
  GYM_OWNER: 'gym_owner',
  GYM_GOER: 'gym_goer',
  TRAINER: 'trainer',
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
};

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3,
};

// Feature Flags
export const FEATURES = {
  ENABLE_SEARCH: false,
  ENABLE_NOTIFICATIONS: false,
}; 