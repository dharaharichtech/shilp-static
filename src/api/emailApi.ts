import { apiClient, envConfig } from './apiClient';
import type { 
  ContactFormData, 
  CareerFormData, 
  EnquiryFormData, 
  EmailResponse, 
  NewsletterSubscription, 
  CallbackRequest 
} from '../types/email.types';

// Email API functions
export const emailApi = {
  // Contact form submission
  sendContactForm: async (formData: ContactFormData): Promise<EmailResponse> => {
    try {
      const response = await apiClient.post('/public/contact', formData);
      
      return {
        success: true,
        message: response.data?.message || 'Message sent successfully!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('❌ Error sending contact form:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Career form submission
  sendCareerForm: async (formData: CareerFormData): Promise<EmailResponse> => {
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'resume' && value instanceof File) {
            uploadData.append('resume', value);
          } else {
            uploadData.append(key, value.toString());
          }
        }
      });

      const response = await apiClient.post('/public/career', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        message: response.data?.message || 'Application submitted successfully!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('❌ Error sending career form:', error);
      return {
        success: false,
        message: 'Failed to submit application. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Property enquiry form
  sendEnquiryForm: async (formData: EnquiryFormData): Promise<EmailResponse> => {
    try {
      const response = await apiClient.post('/public/enquiry', formData);
      
      return {
        success: true,
        message: response.data?.message || 'Enquiry submitted successfully!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('❌ Error sending enquiry form:', error);
      return {
        success: false,
        message: 'Failed to submit enquiry. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Newsletter subscription
  subscribeNewsletter: async (subscriptionData: NewsletterSubscription): Promise<EmailResponse> => {
    try {
      const response = await apiClient.post('/public/newsletter', subscriptionData);
      
      return {
        success: true,
        message: response.data?.message || 'Successfully subscribed to newsletter!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('❌ Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Callback request
  requestCallback: async (callbackData: CallbackRequest): Promise<EmailResponse> => {
    try {
      const response = await apiClient.post('/public/callback', callbackData);
      
      return {
        success: true,
        message: response.data?.message || 'Callback request submitted successfully!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('❌ Error requesting callback:', error);
      return {
        success: false,
        message: 'Failed to submit callback request. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Generic email sender
  sendEmail: async (endpoint: string, data: any): Promise<EmailResponse> => {
    try {
      const response = await apiClient.post(endpoint, data);
      
      return {
        success: true,
        message: response.data?.message || 'Email sent successfully!',
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error(`❌ Error sending email to ${endpoint}:`, error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // File upload validation
  validateFile: (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = envConfig.ALLOWED_FILE_TYPES;
    const maxSize = envConfig.MAX_FILE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  },
};

// Export individual functions for convenience
export const {
  sendContactForm,
  sendCareerForm,
  sendEnquiryForm,
  subscribeNewsletter,
  requestCallback,
  sendEmail,
  validateFile,
} = emailApi;

export default emailApi;