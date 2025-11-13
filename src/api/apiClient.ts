/// <reference types="vite/client" />
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { EnvConfig } from '../types/api.types';
import { getDynamicConfig } from '../utils/dynamicConfig';

// Get dynamic configuration
const dynamicConfig = getDynamicConfig();

// Environment configuration with dynamic support
export const envConfig: EnvConfig = {
  API_BASE_URL: dynamicConfig.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  EMAIL_API_URL: dynamicConfig.emailApiUrl || import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:8081/api',
  IMAGE_BASE_URL: dynamicConfig.imageBaseUrl || import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8081',
  IMAGE_UPLOAD_URL: (dynamicConfig.imageBaseUrl || import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8081') + '/api/upload',
  IMAGE_FOLDER_PATH: import.meta.env.VITE_IMAGE_FOLDER_PATH || '/uploads',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Shilp Group',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(','),
};

// Extend axios request config for metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: envConfig.API_BASE_URL,
  timeout: envConfig.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens and metadata
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add auth token if available (uncomment when auth is implemented)
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers = config.headers || {};
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Add timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (envConfig.NODE_ENV === 'development') {
      const config = response.config as ExtendedAxiosRequestConfig;
      const endTime = new Date();
      const startTime = config.metadata?.startTime;
      if (startTime) {
        const duration = endTime.getTime() - startTime.getTime();
        console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`);
      }
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('🌐 API Network Error:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    } else {
      // Something else happened
      console.error('⚠️ API Configuration Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export API base URL
export const { API_BASE_URL } = envConfig;

export default apiClient;