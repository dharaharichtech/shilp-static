import { useContext } from 'react';
import BannerContext from './BannerContext';
import type { BannersData, Banner, BannerType, BannerMetadata } from '../types/banner.types';

// Context type definition
export interface BannerContextType {
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

// Custom hook to use Banner Context
export const useBanner = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};

// Export banner types constants
export { BANNER_TYPES } from '../types/banner.types';
export type { BannerType, Banner, BannersData, BannerMetadata } from '../types/banner.types';