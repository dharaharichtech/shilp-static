# Environment Variables

## Overview
This project uses Vite environment variables for configuration. All environment variables must be prefixed with `VITE_` to be accessible in the frontend.

## Files
- `.env` - Development environment variables
- `.env.production` - Production environment variables

## Available Variables

### API Configuration
- `VITE_API_BASE_URL` - Base URL for the main API (default: http://localhost:8081/api)
- `VITE_API_TIMEOUT` - API request timeout in milliseconds (default: 10000)

### Email Configuration
- `VITE_EMAIL_API_URL` - URL for email API endpoints (default: http://localhost:8081/api)

### App Configuration
- `VITE_APP_NAME` - Application name (default: Shilp Group)
- `VITE_APP_VERSION` - Application version (default: 1.0.0)
- `VITE_NODE_ENV` - Environment type (development/production)

### File Upload Settings
- `VITE_MAX_FILE_SIZE` - Maximum file size in bytes (default: 5MB)
- `VITE_ALLOWED_FILE_TYPES` - Comma-separated list of allowed MIME types

## Usage in Code

```typescript
// Accessing environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;
const NODE_ENV = import.meta.env.VITE_NODE_ENV;

// Example usage
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(API_TIMEOUT) || 10000,
});
```

## Notes
- Environment variables are loaded at build time
- All VITE_ prefixed variables are publicly accessible in the client
- Never put sensitive data (API keys, secrets) in these files
- Add `.env.local` to `.gitignore` for local-only environment variables