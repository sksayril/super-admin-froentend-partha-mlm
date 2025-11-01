import { ApiConfig } from '../types/api';

// API Configuration
export const API_CONFIG: ApiConfig = {
  baseURL: 'http://localhost:3100/api',
  // baseURL: 'https://api.utpfund.live/api',
  timeout: 300000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/super-admin/login',
    LOGOUT: '/admin/super-admin/logout',
    REFRESH: '/admin/super-admin/refresh',
    PROFILE: '/admin/super-admin/profile',
  },
  ADMIN: {
    CREATE: '/admin/create-admin',
    DEPOSIT_REQUESTS: '/admin/deposit-requests',
    RECHARGE_WALLET: '/admin/recharge-admin-wallet',
  },
  USERS: {
    LIST: '/admin/users',
    CREATE: '/admin/users',
    UPDATE: '/admin/users',
    DELETE: '/admin/users',
    GET_BY_ID: '/admin/users',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard/stats',
    ANALYTICS: '/admin/dashboard/analytics',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
