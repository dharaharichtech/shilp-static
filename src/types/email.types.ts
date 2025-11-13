// Email API types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  company?: string;
}

export interface CareerFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume?: File;
  coverLetter?: string;
  expectedSalary?: string;
  availableDate?: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  propertyType: 'residential' | 'commercial' | 'plot';
  budgetRange?: string;
  location?: string;
  message?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
}

export interface CallbackRequest {
  name: string;
  phone: string;
  preferredTime?: string;
  message?: string;
}