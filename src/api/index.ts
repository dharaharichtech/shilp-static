// API Export Index
// This file provides easy access to all API functions

// Banner API
export * from './bannerApi';
export { default as bannerApi } from './bannerApi';

// Email API  
export * from './emailApi';
export { default as emailApi } from './emailApi';

// Image API
export * from './imageApi';
export { default as imageApi } from './imageApi';

// API Client Configuration
export { apiClient, envConfig } from './apiClient';

// Types
export type { Banner, BlogsDetailBanner, BannerType, BannersData } from '../types/banner.types';
export type {
  ContactFormData,
  CareerFormData,
  EnquiryFormData,
  EmailResponse,
  NewsletterSubscription,
  CallbackRequest,
} from '../types/email.types';
export type { ApiResponse, ApiError, EnvConfig } from '../types/api.types';

// Usage examples:
// import { bannerApi, emailApi, imageApi } from '../api';
// import { sendContactForm, getBannerByType, uploadImage } from '../api';
// import type { ContactFormData, BannerType, ImageUploadResponse } from '../api';