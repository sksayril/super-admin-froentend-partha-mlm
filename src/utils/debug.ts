// Debug utility for development

export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export const debugAuth = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH DEBUG] ${message}`, data);
  }
};

export const debugAPI = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API DEBUG] ${message}`, data);
  }
};
