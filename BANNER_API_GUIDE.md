# Banner API & Context Integration

This documentation explains how to use the Banner API and Context system that has been integrated into your Shilp Static project.

## Overview

The Banner system provides a centralized way to manage and access banner images from your backend API across all pages of your application. It includes:

- **Banner API**: Service functions to fetch banner data from your backend
- **Banner Context**: React Context API to manage banner state globally
- **TypeScript Support**: Full type safety for all banner data and operations
- **Helper Functions**: Easy-to-use utilities for accessing banner URLs and metadata

## Project Structure

```
src/
├── api/
│   ├── bannerApi.ts         # Banner API service functions
│   └── index.ts             # API exports
├── context/
│   ├── BannerContext.tsx    # Banner Context Provider
│   ├── useBanner.ts         # Custom hook and types
│   └── index.ts             # Context exports
├── types/
│   └── banner.types.ts      # TypeScript types for banners
└── components/
    └── Common/
        └── ExampleBannerUsage.tsx  # Example component
```

## API Configuration

The Banner API is configured to connect to your backend API:

```typescript
// Base URL configuration
const API_BASE_URL = 'http://localhost:8081/api';
```

The API fetches banner data from the endpoint: `GET /public/banners`

## Available Banner Types

The system supports the following banner types:

```typescript
export const BANNER_TYPES = {
  HOMEPAGE: 'homepageBanner',
  ABOUT_US: 'aboutUs', 
  COMMERCIAL: 'commercialBanner',
  PLOT: 'plotBanner',
  RESIDENTIAL: 'residentialBanner',
  CONTACT: 'contactBanners',
  CAREER: 'careerBanner',
  OUR_TEAM: 'ourTeamBanner',
  TERMS_CONDITIONS: 'termsConditionsBanner',
  PRIVACY_POLICY: 'privacyPolicyBanner',
  BLOGS_DETAIL: 'blogsDetail',
};
```

## Usage Examples

### 1. Basic Usage in Components

```typescript
import { useBanner, BANNER_TYPES } from '../context';

const MyComponent = () => {
  const { 
    getBanner, 
    getBannerUrl, 
    loading, 
    error 
  } = useBanner();

  // Get banner data
  const homepageBanner = getBanner(BANNER_TYPES.HOMEPAGE);
  
  // Get banner URLs
  const desktopBannerUrl = getBannerUrl(BANNER_TYPES.HOMEPAGE);
  const mobileBannerUrl = getBannerUrl(BANNER_TYPES.HOMEPAGE, true);

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <img 
        src={desktopBannerUrl} 
        alt={homepageBanner.alt}
        className="hidden md:block"
      />
      <img 
        src={mobileBannerUrl} 
        alt={homepageBanner.alt}
        className="block md:hidden"
      />
    </div>
  );
};
```

### 2. Responsive Banner Component

```typescript
import { useBanner, BANNER_TYPES, BannerType } from '../context';

interface ResponsiveBannerProps {
  bannerType: BannerType;
  className?: string;
}

const ResponsiveBanner: React.FC<ResponsiveBannerProps> = ({ 
  bannerType, 
  className = "" 
}) => {
  const { getBanner, getBannerUrl, loading } = useBanner();

  const banner = getBanner(bannerType);
  const desktopUrl = getBannerUrl(bannerType, false);
  const mobileUrl = getBannerUrl(bannerType, true);

  if (loading) return <div className="animate-pulse bg-gray-200 h-64" />;

  return (
    <picture className={className}>
      {mobileUrl && (
        <source media="(max-width: 768px)" srcSet={mobileUrl} />
      )}
      <img 
        src={desktopUrl} 
        alt={banner.alt || `${bannerType} banner`}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </picture>
  );
};

// Usage
<ResponsiveBanner bannerType={BANNER_TYPES.HOMEPAGE} className="hero-banner" />
```

### 3. Banner with Metadata

```typescript
const BannerWithInfo = () => {
  const { getBanner, getBannerMetadata, getBannerUrl } = useBanner();

  const banner = getBanner(BANNER_TYPES.ABOUT_US);
  const metadata = getBannerMetadata(BANNER_TYPES.ABOUT_US);
  const bannerUrl = getBannerUrl(BANNER_TYPES.ABOUT_US);

  return (
    <div>
      <img src={bannerUrl} alt={banner.alt} />
      {metadata && (
        <div className="text-sm text-gray-500 mt-2">
          <p>Uploaded: {new Date(metadata.uploadedAt || '').toLocaleDateString()}</p>
          <p>Size: {Math.round(metadata.size / 1024)} KB</p>
          <p>Original: {metadata.originalName}</p>
        </div>
      )}
    </div>
  );
};
```

## API Functions

### Banner Context Hook

```typescript
const {
  // State
  banners,        // Raw banner data from API
  loading,        // Loading state
  error,          // Error state
  
  // Helper functions
  getBanner,      // Get banner data by type
  getBannerUrl,   // Get banner URL by type (with mobile support)
  getBannerMetadata, // Get banner metadata
  refreshBanners, // Refresh banner data from API
} = useBanner();
```

### Direct API Functions

```typescript
import { getAllBanners, getBannerByType } from '../api';

// Get all banners
const response = await getAllBanners();
if (response.success) {
  console.log(response.data);
}

// Get specific banner
const bannerResponse = await getBannerByType('homepageBanner');
if (bannerResponse.success) {
  console.log(bannerResponse.data);
}
```

## Error Handling

The system provides comprehensive error handling:

```typescript
const MyComponent = () => {
  const { error, refreshBanners } = useBanner();

  if (error) {
    return (
      <div className="error-banner">
        <p>Failed to load banners: {error}</p>
        <button onClick={refreshBanners} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  // Component content...
};
```

## TypeScript Types

All banner data is fully typed:

```typescript
interface Banner {
  banner: string;
  mobilebanner: string;
  alt: string;
  bannerMetadata: BannerMetadata;
  mobilebannerMetadata: BannerMetadata;
}

interface BannerMetadata {
  uploadedAt: string | null;
  filename: string;
  originalName: string;
  size: number;
}
```

## Performance Considerations

- **Lazy Loading**: Use the `loading="lazy"` attribute on banner images
- **Picture Element**: Use `<picture>` for responsive images
- **Caching**: Banner data is cached in React Context until page refresh
- **Error Boundaries**: Wrap banner components in error boundaries for better UX

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure your backend API is running on `localhost:8081`
   - Check CORS settings if running from different domains

2. **Banner Not Loading**
   - Verify the banner type exists in `BANNER_TYPES`
   - Check if banner data exists for the specified type
   - Ensure proper error handling in your components

3. **TypeScript Errors**
   - Make sure you're importing types correctly: `import type { BannerType } from '../context'`
   - Verify all required props are passed to components

### Debug Mode

To debug banner loading, check the browser console for API responses and errors. The system logs detailed information about failed requests.

## Next Steps

1. **Add More Banner Types**: Extend `BANNER_TYPES` as needed
2. **Image Optimization**: Consider adding image compression/optimization
3. **Offline Support**: Add service worker for offline banner caching
4. **Admin Integration**: Create admin interfaces for banner management

This system provides a robust, type-safe, and scalable solution for managing banners across your Shilp Static website.