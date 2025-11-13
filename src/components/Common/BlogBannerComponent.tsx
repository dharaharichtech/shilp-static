import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { bannerApi } from '../../api/bannerApi';
import { imageUtils } from '../../utils/imageUtils';
import type { BlogsDetailBanner } from '../../types/banner.types';

interface BlogBannerComponentProps {
  className?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  overlayOpacity?: number;
  customTitle?: string;
  customSubtitle?: string;
}

const BlogBannerComponent: React.FC<BlogBannerComponentProps> = ({
  className = '',
  showTitle = true,
  showSubtitle = true,
  titleVariant = 'h2',
  overlayOpacity = 0.5,
  customTitle,
  customSubtitle,
}) => {
  const [bannerData, setBannerData] = useState<BlogsDetailBanner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getBlogImage = (banner: BlogsDetailBanner): string => {
    const imagePath = banner.image || '';
    return imageUtils.getImageUrl(imagePath);
  };

  const getMobileBlogImage = (banner: BlogsDetailBanner): string => {
    const imagePath = banner.mobileimage || '';
    return imageUtils.getImageUrl(imagePath);
  };

  const getBlogTitle = (banner: BlogsDetailBanner): string => {
    if (customTitle) return customTitle;
    return banner.title || 'Blog Details';
  };

  const getBlogDescription = (banner: BlogsDetailBanner): string => {
    if (customSubtitle) return customSubtitle;
    return banner.description || 'Read our latest insights';
  };

  useEffect(() => {
    const fetchBlogBanner = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bannerApi.getBannerByType('blogsDetail');
        
        if (response.success && response.data) {
          setBannerData(response.data as BlogsDetailBanner);
        } else {
          setError('Blog banner not found');
        }
      } catch (err) {
        console.error('❌ Error loading blog banner:', err);
        setError('Failed to load blog banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogBanner();
  }, []);

  if (loading) {
    return (
      <Box
        className={`blog-banner-loading ${className}`}
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
          }}
        />

        {/* Loading overlay */}
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
            Loading Blog Banner...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !bannerData) {
    return (
      <Box
        sx={{
          height: {
            xs: '100dvh', // Mobile: dynamic viewport height
            md: '100vh',  // Desktop: standard viewport height
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
        }}
        className={className}
      >
        <Typography variant="h4" gutterBottom>
          Blog Details
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Blog banner content will appear here
        </Typography>
      </Box>
    );
  }

  const blogImageUrl = getBlogImage(bannerData);
  const mobileBlogImageUrl = getMobileBlogImage(bannerData);
  const blogTitle = getBlogTitle(bannerData);
  const blogDescription = getBlogDescription(bannerData);

  // Use desktop image as primary, mobile as fallback for small screens
  const desktopImageUrl = blogImageUrl || imageUtils.getFallbackImageUrl('banner');
  const mobileImageUrl = mobileBlogImageUrl || blogImageUrl || imageUtils.getFallbackImageUrl('banner');

  return (
    <Box
      sx={{
        height: {
          xs: '100dvh', // Mobile: dynamic viewport height
          md: '100vh',  // Desktop: standard viewport height
        },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // Desktop image
        backgroundImage: `url(${desktopImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Mobile responsive image
        '@media (max-width: 768px)': {
          backgroundImage: `url(${mobileImageUrl})`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1,
        },
      }}
      className={className}
    >
      {/* Content overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          maxWidth: '90%',
          px: { xs: 2, sm: 4 },
        }}
      >
        {showTitle && blogTitle && (
          <Typography
            variant={titleVariant}
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: showSubtitle && blogDescription ? 2 : 0,
              fontSize: {
                xs: titleVariant === 'h1' ? '2rem' : '1.5rem',
                sm: titleVariant === 'h1' ? '2.5rem' : '2rem',
                md: titleVariant === 'h1' ? '3rem' : '2.5rem',
              },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {blogTitle}
          </Typography>
        )}

        {showSubtitle && blogDescription && (
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 300,
              opacity: 0.9,
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.5rem',
              },
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {blogDescription}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BlogBannerComponent;