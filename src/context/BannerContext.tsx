import { createContext, useState, useEffect, ReactNode } from 'react';
import { getAllBanners, getBannerUrl, getBannerMetadata } from '../api/bannerApi';
import type { BannersData, Banner, BannerType, BannerMetadata } from '../types/banner.types';

// Context type definition
interface BannerContextType {
  // State
  banners: BannersData | {};
  loading: boolean;
  error: string | null;
  
  // Helper functions
  getBanner: (bannerType: BannerType) => Banner;
  getBannerUrl: (bannerType: BannerType, isMobile?: boolean) => string;
  getBannerMetadata: (bannerType: BannerType, isMobile?: boolean) => BannerMetadata | null;
  refreshBanners: () => Promise<void>;
}

// Create Banner Context
const BannerContext = createContext<BannerContextType | undefined>(undefined);

// Banner Provider Props
interface BannerProviderProps {
  children: ReactNode;
}

// Banner Provider Component
export const BannerProvider = ({ children }: BannerProviderProps) => {
  const [banners, setBanners] = useState<BannersData | {}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllBanners();
        
        if (response.success && response.data) {
          setBanners(response.data);
        } else {
          setError(response.error || 'Unknown error occurred');
          console.error('Failed to fetch banners:', response.error);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Banner fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Helper function to get banner data for a specific page
  const getBanner = (bannerType: BannerType): Banner => {
    const bannersData = banners as BannersData;
    if (!bannersData || !bannersData[bannerType]) {
      return {
        banner: '',
        mobilebanner: '',
        alt: '',
        bannerMetadata: {
          uploadedAt: null,
          filename: '',
          originalName: '',
          size: 0,
        },
        mobilebannerMetadata: {
          uploadedAt: null,
          filename: '',
          originalName: '',
          size: 0,
        },
      };
    }
    
    return bannersData[bannerType] as Banner;
  };

  // Helper function to get banner URL
  const getBannerUrlHelper = (bannerType: BannerType, isMobile: boolean = false): string => {
    const banner = getBanner(bannerType);
    return getBannerUrl(banner, isMobile);
  };

  // Helper function to get banner metadata
  const getBannerMetadataHelper = (bannerType: BannerType, isMobile: boolean = false): BannerMetadata | null => {
    const banner = getBanner(bannerType);
    return getBannerMetadata(banner, isMobile);
  };

  // Function to refresh banners (useful for admin updates)
  const refreshBanners = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllBanners();
      
      if (response.success && response.data) {
        setBanners(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Banner refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: BannerContextType = {
    // State
    banners,
    loading,
    error,
    
    // Helper functions
    getBanner,
    getBannerUrl: getBannerUrlHelper,
    getBannerMetadata: getBannerMetadataHelper,
    refreshBanners,
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};

export default BannerContext;