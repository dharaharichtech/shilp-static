import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { bannerApi } from '../../api/bannerApi';
import { imageUtils } from '../../utils/imageUtils';
import type { Banner, BannerType } from '../../types/banner.types';

interface BannerComponentProps {
  bannerType: BannerType;
  className?: string;
}

const BannerComponent: React.FC<BannerComponentProps> = ({
  bannerType,
  className = '',
}) => {
  const [bannerData, setBannerData] = useState<Banner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imagePreloaded, setImagePreloaded] = useState<boolean>(false);

  // Preload images for faster display
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!src) {
        resolve();
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        setImagePreloaded(true);
        resolve();
      };
      img.onerror = () => reject();
      img.src = src;
    });
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bannerApi.getBannerByType(bannerType);
        
        if (response.success && response.data) {
          setBannerData(response.data);
          
          // Enhanced image preloading with dynamic URLs
          const desktopImageUrl = response.data.banner ? imageUtils.getImageUrl(response.data.banner) : '';
          const mobileImageUrl = response.data.mobilebanner ? imageUtils.getImageUrl(response.data.mobilebanner) : '';
          
          // Log dynamic URLs for debugging
          console.log('🖼️ Dynamic Image URLs:', {
            desktop: desktopImageUrl,
            mobile: mobileImageUrl,
            baseUrl: imageUtils.getDynamicImageBaseUrl()
          });
          
          // Enhanced preloading with retry mechanism  
          Promise.all([
            imageUtils.preloadImage(response.data.banner),
            imageUtils.preloadImage(response.data.mobilebanner)
          ]).catch(() => {
            console.warn('Some banner images failed to preload');
          });
          
        } else {
          setError(response.error || 'Banner not found');
        }
      } catch (err) {
        console.error('Error fetching banner:', err);
        setError('Failed to load banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerType]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (loading) {
    return (
      <Box
        className={`banner-loading ${className}`}
        sx={{
          position: 'relative',
          width: '100%',
          height: {
            xs: '100dvh',
            sm: '100vh',
          },
          overflow: 'hidden',
        }}
      >
        {/* Desktop Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
            },
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            },
          }}
        />

        {/* Mobile Skeleton */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            display: {
              xs: 'block',
              sm: 'none',
            },
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            },
          }}
        />

        {/* Loading overlay with pulse animation */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#666',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              animation: 'pulse 1.5s ease-in-out infinite',
              mb: 2,
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(0.95)',
                  opacity: 0.7,
                },
                '70%': {
                  transform: 'scale(1.05)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'scale(0.95)',
                  opacity: 0.7,
                },
              },
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontWeight: 500,
              animation: 'fadeInOut 2s ease-in-out infinite',
              '@keyframes fadeInOut': {
                '0%, 100%': { opacity: 0.5 },
                '50%': { opacity: 1 },
              },
            }}
          >
            Loading Banner...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className={`banner-error ${className}`}
        sx={{
          position: 'relative',
          width: '100%',
          height: {
            xs: '100dvh',
            sm: '100vh',
          },
          overflow: 'hidden',
        }}
      >
        {/* Error state skeleton background */}
        <Skeleton
          variant="rectangular"
          animation="pulse"
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            opacity: 0.7,
          }}
        />
        
        {/* Error message overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            px: 2,
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#ffebee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              border: '2px solid #ffcdd2',
            }}
          >
            <Typography variant="h4" color="#f44336">
              ⚠️
            </Typography>
          </Box>
          <Typography variant="h6" color="#f44336" sx={{ mb: 1, fontWeight: 600 }}>
            Failed to Load Banner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!bannerData) {
    return null;
  }

  // Enhanced image attributes with dynamic URLs and optimal loading
  const desktopImageUrl = bannerData.banner ? imageUtils.getImageUrl(bannerData.banner) : '';
  const mobileImageUrl = bannerData.mobilebanner ? imageUtils.getImageUrl(bannerData.mobilebanner) : '';
  
  // Get optimal loading settings based on network
  const loadingConfig = imageUtils.getLoadingConfig('critical');
  
  // Log dynamic configuration for debugging
  console.log('🌐 Banner Image Loading:', {
    desktop: desktopImageUrl,
    mobile: mobileImageUrl,
    loadingConfig,
    dynamicBaseUrl: imageUtils.getDynamicImageBaseUrl()
  });

  return (
    <Box
      className={`banner-wrapper ${className}`}
      sx={{
        position: 'relative',
        width: '100%',
        height: {
          xs: '100dvh',
          sm: '100vh',
        },
        overflow: 'hidden',
      }}
    >
      {/* Image loading skeleton overlay */}
      {imageLoading && !imageError && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: '#f0f0f0',
          }}
        />
      )}

      {/* Desktop Banner - Enhanced with dynamic loading */}
      <Box
        component="img"
        src={desktopImageUrl}
        alt={bannerData.alt || "Banner"}
        loading={loadingConfig.loading}
        fetchPriority={loadingConfig.fetchPriority}
        decoding={loadingConfig.decoding}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: imageLoading && !imagePreloaded ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease',
          transform: imagePreloaded ? 'scale(1)' : 'scale(1.01)',
          contentVisibility: 'auto',
          containIntrinsicSize: '1920px 1080px',
          filter: imageLoading && !imagePreloaded ? 'blur(1px)' : 'none',
        }}
      />

      {/* Mobile Banner - Enhanced with dynamic loading */}
      <Box
        component="img"
        src={mobileImageUrl || desktopImageUrl}
        alt={bannerData.alt || "Mobile Banner"}
        loading={loadingConfig.loading}
        fetchPriority={loadingConfig.fetchPriority}
        decoding={loadingConfig.decoding}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sx={{
          display: {
            xs: 'block',
            sm: 'none',
          },
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: imageLoading && !imagePreloaded ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease',
          transform: imagePreloaded ? 'scale(1)' : 'scale(1.01)',
          contentVisibility: 'auto',
          containIntrinsicSize: '768px 1024px',
          filter: imageLoading && !imagePreloaded ? 'blur(1px)' : 'none',
        }}
      />

      {/* Error fallback */}
      {imageError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            📸
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Image not available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BannerComponent;