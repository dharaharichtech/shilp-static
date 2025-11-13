import { apiClient, API_BASE_URL } from './apiClient';
import type { BannersData, Banner, BlogsDetailBanner, BannerType, ApiResponse, BannerMetadata } from '../types/banner.types';

// Enhanced cache system for better performance
let bannerCache: BannersData | null = null;
let individualBannerCache: Map<BannerType, Banner | BlogsDetailBanner> = new Map();
let cacheTimestamp: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for better performance

// Cache utilities
const isCacheValid = (): boolean => {
  const now = Date.now();
  return bannerCache !== null && (now - cacheTimestamp) < CACHE_DURATION;
};

const updateCache = (data: BannersData): void => {
  bannerCache = data;
  cacheTimestamp = Date.now();
  
  // Update individual cache as well
  Object.entries(data).forEach(([key, value]) => {
    if (key !== '_id' && key !== 'documentId' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
      individualBannerCache.set(key as BannerType, value as Banner | BlogsDetailBanner);
    }
  });
};

// Clear cache manually (useful for updates)
const clearCache = (): void => {
  bannerCache = null;
  individualBannerCache.clear();
  cacheTimestamp = 0;
  console.log('🗑️ Banner cache cleared manually');
};

// Check if data is updated based on timestamp
const isDataUpdated = (serverTimestamp: string): boolean => {
  if (!bannerCache) return true;
  
  const serverUpdateTime = new Date(serverTimestamp).getTime();
  return serverUpdateTime > cacheTimestamp;
};

// Banner API functions
export const bannerApi = {
  // Get all banners with enhanced caching and update detection
  getAllBanners: async (): Promise<ApiResponse<BannersData>> => {
    try {
      // Always check for updates if we have cache
      if (isCacheValid()) {
        // Make a lightweight request to check if data is updated
        try {
          const response = await apiClient.get('/public/banners');
          const data = response.data.data as BannersData;
          
          // Check if server data is newer than cache
          if (data.updatedAt && isDataUpdated(data.updatedAt)) {
            console.log('🔄 Server data updated, refreshing cache');
            updateCache(data);
            return {
              success: true,
              data,
            };
          }
          
          console.log('✅ Banners loaded from cache (data is fresh)');
          return {
            success: true,
            data: bannerCache!,
          };
        } catch (updateCheckError) {
          // If update check fails, fallback to cache
          console.log('⚠️ Update check failed, using cache');
          return {
            success: true,
            data: bannerCache!,
          };
        }
      }

      console.log('🔄 Fetching banners from API (cache expired)');
      const response = await apiClient.get('/public/banners');
      const data = response.data.data as BannersData;
      
      // Update cache
      updateCache(data);
      
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('❌ Error fetching banners:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch banners',
        data: null,
      };
    }
  },

    // Get specific banner type with enhanced caching and update detection
  // Get specific banner type with enhanced caching and update detection
  getBannerByType: async (type: BannerType): Promise<ApiResponse<Banner | BlogsDetailBanner>> => {
    try {
      // Check individual banner cache first
      const cachedBanner = individualBannerCache.get(type);
      if (cachedBanner) {
        // Check if we need to validate freshness for this specific banner
        try {
          // Get fresh data to compare
          const fullDataResponse = await bannerApi.getAllBanners();
          if (fullDataResponse.success && fullDataResponse.data) {
            const freshBanner = fullDataResponse.data[type];
            
            // Quick check: if image paths differ, cache is stale
            if (freshBanner && 
                (freshBanner.banner !== cachedBanner.banner ||
                 freshBanner.mobilebanner !== cachedBanner.mobilebanner)) {
              console.log(`🔄 ${type} banner updated, refreshing individual cache`);
              individualBannerCache.set(type, freshBanner);
              return {
                success: true,
                data: freshBanner,
              };
            }
          }
        } catch (error) {
          console.log(`⚠️ Update check failed for ${type}, using cached version`);
        }
        
        console.log(`✅ ${type} banner loaded from individual cache`);
        return {
          success: true,
          data: cachedBanner,
        };
      }

      // Get from main cache or API
      const response = await bannerApi.getAllBanners();
      
      if (response.success && response.data) {
        const banner = response.data[type];
        if (banner) {
          // Cache this specific banner type
          individualBannerCache.set(type, banner);
          
          console.log(`🔄 ${type} banner cached individually`);
          return {
            success: true,
            data: banner,
          };
        } else {
          return {
            success: false,
            data: null,
            error: `Banner type '${type}' not found`,
          };
        }
      } else {
        return {
          success: false,
          data: null,
          error: response.error || 'Failed to fetch banners',
        };
      }
    } catch (error: any) {
      console.error(`❌ Error fetching ${type} banner:`, error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Force refresh - clear cache and fetch fresh data
  refresh: async (): Promise<ApiResponse<BannersData>> => {
    clearCache();
    return await bannerApi.getAllBanners();
  },

  // Helper function to get banner URL with fallback
  getBannerUrl: (banner: Banner | null | undefined, isMobile: boolean = false): string => {
    if (!banner) return '';
    
    const bannerPath = isMobile ? banner.mobilebanner : banner.banner;
    if (!bannerPath) {
      // Fallback to desktop banner if mobile banner is not available
      return banner.banner || '';
    }
    
    // If the path already includes the domain, return as is
    if (bannerPath.startsWith('http')) {
      return bannerPath;
    }
    
    // Otherwise, prepend the API base URL (remove '/api' suffix for file URLs)
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${bannerPath}`;
  },

  // Helper function to get banner metadata
  getBannerMetadata: (banner: Banner | null | undefined, isMobile: boolean = false): BannerMetadata | null => {
    if (!banner) return null;
    
    return isMobile ? banner.mobilebannerMetadata : banner.bannerMetadata;
  },
};

// Export individual functions for convenience
export const {
  getAllBanners,
  getBannerByType,
  getBannerUrl,
  getBannerMetadata,
  refresh,
} = bannerApi;

// Export cache utility functions
export { clearCache, isDataUpdated };

// Export default
export default bannerApi;