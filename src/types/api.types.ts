import { AxiosRequestConfig } from 'axios';

// Extend axios request config to include metadata
export interface ApiRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Environment configuration
// Environment configuration
export interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  EMAIL_API_URL: string;
  IMAGE_BASE_URL: string;
  IMAGE_UPLOAD_URL: string;
  IMAGE_FOLDER_PATH: string;
  NODE_ENV: string;
  APP_NAME: string;
  APP_VERSION: string;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
}

// Error response structure
export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  url?: string;
}