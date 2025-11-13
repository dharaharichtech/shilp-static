/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  
  // Image Configuration
  readonly VITE_IMAGE_BASE_URL: string;
  readonly VITE_IMAGE_UPLOAD_URL: string;
  readonly VITE_IMAGE_FOLDER_PATH: string;
  
  // Email Configuration
  readonly VITE_EMAIL_API_URL: string;
  
  // Environment
  readonly VITE_NODE_ENV: string;
  
  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  
  // File Upload
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}