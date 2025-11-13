import { envConfig } from '../api/apiClient';
import { 
  buildImageUrl, 
  imageLoadingConfig, 
  preloadImageWithRetry, 
  getOptimalImageSettings,
  DYNAMIC_IMAGE_BASE_URL 
} from './dynamicConfig';

// Enhanced image utility functions with dynamic support
export const imageUtils = {
  // Get full image URL from relative path or filename with dynamic support
  getImageUrl: (imagePath: string | undefined | null): string => {
    if (!imagePath) {
      return '';
    }

    // Use dynamic URL builder
    return buildImageUrl(imagePath);
  },

  // Get dynamic image base URL
  getDynamicImageBaseUrl: (): string => {
    return DYNAMIC_IMAGE_BASE_URL;
  },

  // Legacy method for backward compatibility
  getLegacyImageUrl: (imagePath: string | undefined | null): string => {
    if (!imagePath) {
      return '';
    }

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If starts with /, treat as absolute path from image base URL
    if (imagePath.startsWith('/')) {
      return `${envConfig.IMAGE_BASE_URL}${imagePath}`;
    }

    // Otherwise, treat as relative path within uploads folder
    return `${envConfig.IMAGE_BASE_URL}${envConfig.IMAGE_FOLDER_PATH}/${imagePath}`;
  },

  // Get mobile image URL
  getMobileImageUrl: (imagePath: string | undefined | null): string => {
    return imageUtils.getImageUrl(imagePath);
  },

  // Get optimized image URL with query parameters
  getOptimizedImageUrl: (
    imagePath: string | undefined | null,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    }
  ): string => {
    const baseUrl = imageUtils.getImageUrl(imagePath);
    
    if (!baseUrl || !options) {
      return baseUrl;
    }

    const params = new URLSearchParams();
    
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('f', options.format);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  // Check if image exists (returns a promise)
  checkImageExists: async (imagePath: string): Promise<boolean> => {
    try {
      const url = imageUtils.getImageUrl(imagePath);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Error checking image existence:', error);
      return false;
    }
  },

  // Get image upload URL
  getUploadUrl: (): string => {
    return envConfig.IMAGE_UPLOAD_URL;
  },

  // Validate image file
  validateImageFile: (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!envConfig.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${envConfig.ALLOWED_FILE_TYPES.join(', ')}`,
      };
    }

    // Check file size
    if (file.size > envConfig.MAX_FILE_SIZE) {
      const maxSizeMB = Math.round(envConfig.MAX_FILE_SIZE / (1024 * 1024));
      return {
        valid: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  },

  // Get fallback image URL
  getFallbackImageUrl: (type: 'banner' | 'placeholder' | 'avatar' = 'placeholder'): string => {
    const fallbacks = {
      banner: '/images/fallback-banner.jpg',
      placeholder: '/images/placeholder.jpg',
      avatar: '/images/default-avatar.jpg',
    };

    return buildImageUrl(fallbacks[type]);
  },

  // Enhanced image loading utilities
  
  // Get optimal image settings based on network
  getOptimalImageSettings: () => {
    return getOptimalImageSettings();
  },

  // Get loading configuration for images
  getLoadingConfig: (priority: 'critical' | 'normal' | 'background' = 'normal') => {
    switch (priority) {
      case 'critical':
        return imageLoadingConfig.critical;
      case 'background':
        return imageLoadingConfig.background;
      default:
        return imageLoadingConfig.defaults;
    }
  },

  // Preload single image with retry
  preloadImage: async (imagePath: string | undefined | null): Promise<void> => {
    if (!imagePath) return;
    const fullUrl = imageUtils.getImageUrl(imagePath);
    return preloadImageWithRetry(fullUrl);
  },

  // Enhanced image element attributes
  getImageAttributes: (
    imagePath: string | undefined | null,
    options: {
      alt: string;
      priority?: 'critical' | 'normal' | 'background';
      loading?: 'lazy' | 'eager';
      fetchPriority?: 'high' | 'low' | 'auto';
    }
  ) => {
    const url = imageUtils.getImageUrl(imagePath);
    const loadingConfig = options.priority 
      ? imageUtils.getLoadingConfig(options.priority)
      : imageLoadingConfig.defaults;
    
    return {
      src: url,
      alt: options.alt,
      loading: options.loading || loadingConfig.loading,
      fetchPriority: options.fetchPriority || loadingConfig.fetchPriority,
      decoding: loadingConfig.decoding,
      style: {
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 200px' // Helps with layout shift
      }
    };
  },

  // Network-aware image quality
  getNetworkAwareQuality: (): number => {
    const settings = getOptimalImageSettings();
    return settings.quality === 'low' ? 60 : 85;
  },

  // Check if image should load immediately
  shouldEagerLoad: (isAboveFold: boolean = false, isCritical: boolean = false): boolean => {
    return isAboveFold || isCritical;
  }
};

export default imageUtils;