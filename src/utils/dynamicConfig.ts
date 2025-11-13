// Dynamic API Configuration for Development
export const getDynamicConfig = () => {
  // Get current hostname/IP for dynamic development
  const hostname = window.location.hostname;
  const isDevelopment = import.meta.env.DEV;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Base configurations
  const configs = {
    development: {
      // Use current hostname for API if not localhost
      apiBaseUrl: isLocalhost 
        ? import.meta.env.VITE_API_BASE_URL 
        : `http://${hostname}:8081/api`,
      imageBaseUrl: isLocalhost 
        ? import.meta.env.VITE_IMAGE_BASE_URL 
        : `http://${hostname}:8081`,
      emailApiUrl: isLocalhost 
        ? import.meta.env.VITE_EMAIL_API_URL 
        : `http://${hostname}:8081/api`,
    },
    production: {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL,
      emailApiUrl: import.meta.env.VITE_EMAIL_API_URL,
    }
  };

  const config = isDevelopment ? configs.development : configs.production;
  
  console.log('🌐 Dynamic Config:', {
    hostname,
    isDevelopment,
    isLocalhost,
    config
  });

  return config;
};

// Export dynamic URLs
export const DYNAMIC_API_BASE_URL = getDynamicConfig().apiBaseUrl;
export const DYNAMIC_IMAGE_BASE_URL = getDynamicConfig().imageBaseUrl;
export const DYNAMIC_EMAIL_API_URL = getDynamicConfig().emailApiUrl;

// Image loading optimization utilities
export const imageLoadingConfig = {
  // Image loading strategies
  strategies: {
    LAZY: 'lazy',
    EAGER: 'eager',
    AUTO: 'auto'
  },
  
  // Image fetch priorities
  priorities: {
    HIGH: 'high',
    LOW: 'low',
    AUTO: 'auto'
  },
  
  // Default image settings for better loading
  defaults: {
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const,
    decoding: 'async' as const,
  },

  // Critical images settings (above fold)
  critical: {
    loading: 'eager' as const,
    fetchPriority: 'high' as const,
    decoding: 'async' as const,
  },

  // Background images settings  
  background: {
    loading: 'lazy' as const,
    fetchPriority: 'low' as const,
    decoding: 'async' as const,
  }
};

// Dynamic image URL builder
export const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If already full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath;
  }
  
  // Build dynamic URL
  const baseUrl = DYNAMIC_IMAGE_BASE_URL;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};

// Image preloading with retry logic
export const preloadImageWithRetry = (src: string, retries: number = 3): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const attemptLoad = (attempt: number) => {
      img.onload = () => {
        console.log(`✅ Image preloaded: ${src}`);
        resolve();
      };
      
      img.onerror = () => {
        if (attempt < retries) {
          console.warn(`⚠️ Image load failed (attempt ${attempt}/${retries}): ${src}`);
          setTimeout(() => attemptLoad(attempt + 1), 1000 * attempt); // Progressive delay
        } else {
          console.error(`❌ Image load failed after ${retries} attempts: ${src}`);
          reject(new Error(`Failed to load image: ${src}`));
        }
      };
      
      img.src = src;
    };
    
    attemptLoad(1);
  });
};

// Batch image preloading
export const preloadImages = async (imageUrls: string[]): Promise<void> => {
  const preloadPromises = imageUrls.map(url => 
    preloadImageWithRetry(buildImageUrl(url)).catch(error => {
      console.warn(`Failed to preload image: ${url}`, error);
      return null; // Don't fail the entire batch
    })
  );
  
  await Promise.allSettled(preloadPromises);
  console.log(`📷 Batch preloaded ${imageUrls.length} images`);
};

// Dynamic network-aware image loading
export const getOptimalImageSettings = () => {
  // Check for network connection info if available
  const connection = (navigator as any).connection;
  
  if (connection) {
    const { effectiveType, downlink, rtt } = connection;
    
    // Slow network detection
    const isSlowNetwork = effectiveType === 'slow-2g' || 
                         effectiveType === '2g' || 
                         downlink < 1 || 
                         rtt > 1000;
    
    if (isSlowNetwork) {
      return {
        loading: 'lazy' as const,
        fetchPriority: 'low' as const,
        quality: 'low',
        format: 'webp'
      };
    }
  }
  
  // Default settings for good networks
  return {
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const,
    quality: 'high',
    format: 'webp'
  };
};

export default {
  getDynamicConfig,
  DYNAMIC_API_BASE_URL,
  DYNAMIC_IMAGE_BASE_URL,
  DYNAMIC_EMAIL_API_URL,
  imageLoadingConfig,
  buildImageUrl,
  preloadImageWithRetry,
  preloadImages,
  getOptimalImageSettings
};