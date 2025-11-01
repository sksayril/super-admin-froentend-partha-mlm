// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Admin Creation Types
export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface CreateAdminResponse {
  admin: User;
}

// User Management Types
export interface UserWithDetails extends User {
  _id?: string; // MongoDB ID
  originalPassword?: string;
  referralCode?: string;
  wallets?: {
    mainWallet: number;
    benefitWallet: number;
    withdrawalWallet: number;
  };
  totalEarnings?: number;
  totalWithdrawals?: number;
  totalReferrals?: number;
  directReferrals?: any[];
  referredBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
  } | null;
  adminId?: string | null;
  updatedAt?: string;
  __v?: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export interface PaginationInfo {
  current: string | number;
  pages: number;
  total: number;
}

export interface UserListResponse {
  users: UserWithDetails[];
  pagination: PaginationInfo;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Payment Request Types
export interface DepositRequestUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
}

export interface DepositRequestAdmin {
  name: string;
  email: string;
}

export interface WalletUpdates {
  mainWalletAmount: number;
  benefitWalletAmount: number;
  totalAmount: number;
  formatted: {
    mainWallet: string;
    benefitWallet: string;
    total: string;
  };
}

export interface DepositRequest {
  id: string;
  user: DepositRequestUser;
  amount: number;
  formattedAmount: string;
  transactionId: string;
  paymentMethod: string;
  paymentScreenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  admin: DepositRequestAdmin;
  approvedBy: DepositRequestAdmin | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  walletUpdates: WalletUpdates;
  notes: string | null;
  createdAt: string;
  formattedDate: string;
}

export interface DepositRequestSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAmount: number;
}

export interface DepositRequestListParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
  userId?: string;
}

export interface DepositRequestListResponse {
  depositRequests: DepositRequest[];
  pagination: PaginationInfo;
  summary: DepositRequestSummary;
}

export interface ApproveDepositRequestRequest {
  notes?: string;
}

export interface RejectDepositRequestRequest {
  rejectionReason: string;
}

export interface ApproveDepositRequestResponse {
  depositRequest: DepositRequest;
  user: {
    id: string;
    name: string;
    email: string;
    wallets: {
      mainWallet: number;
      benefitWallet: number;
      withdrawalWallet: number;
    };
  };
}

export interface RejectDepositRequestResponse {
  depositRequest: DepositRequest;
}

// Admin Wallet Recharge Types
export interface RechargeAdminWalletRequest {
  adminId: string;
  amount: number;
  walletType: 'mainWallet' | 'benefitWallet' | 'withdrawalWallet';
  description?: string;
}

export interface RechargeAdminWalletResponse {
  admin: {
    id: string;
    name: string;
    email: string;
    walletType: string;
    amountRecharged: number;
    balanceBefore: number;
    balanceAfter: number;
  };
}

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}
