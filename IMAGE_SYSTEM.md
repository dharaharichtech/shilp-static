# Image Management System

This document explains how to use the image upload and display system in the Shilp Static project.

## Environment Variables

The system uses the following environment variables for image handling:

```bash
# Image Configuration
VITE_IMAGE_BASE_URL=http://localhost:8081          # Base URL for image server
VITE_IMAGE_UPLOAD_URL=http://localhost:8081/api/upload  # Upload endpoint
VITE_IMAGE_FOLDER_PATH=/uploads                    # Default upload folder
```

## Image Utils

The `imageUtils` provides helper functions for image handling:

### Get Image URL

```typescript
import { imageUtils } from '../utils/imageUtils';

// Convert relative path to full URL
const imageUrl = imageUtils.getImageUrl('banner/homepage.jpg');
// Result: http://localhost:8081/uploads/banner/homepage.jpg

// Handle full URLs (returns as is)
const fullUrl = imageUtils.getImageUrl('https://example.com/image.jpg');
// Result: https://example.com/image.jpg
```

### Responsive Images

```typescript
// Get optimized image with query parameters
const optimizedUrl = imageUtils.getOptimizedImageUrl('banner/hero.jpg', {
  width: 1200,
  height: 600,
  quality: 85,
  format: 'webp'
});
// Result: http://localhost:8081/uploads/banner/hero.jpg?w=1200&h=600&q=85&f=webp
```

### File Validation

```typescript
const validation = imageUtils.validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

## Image Upload API

### Single Image Upload

```typescript
import { imageApi } from '../api';

const uploadImage = async (file: File) => {
  const result = await imageApi.uploadImage(file, 'banners');
  
  if (result.success) {
    console.log('Image uploaded:', result.data?.url);
    // Use the uploaded image URL
    const imageUrl = result.data?.url;
  } else {
    console.error('Upload failed:', result.error);
  }
};
```

### Multiple Images Upload

```typescript
import { imageApi } from '../api';

const uploadMultipleImages = async (files: File[]) => {
  const result = await imageApi.uploadMultipleImages(files, 'gallery');
  
  if (result.success) {
    result.data?.images.forEach(image => {
      console.log('Image uploaded:', image.url);
    });
  }
};
```

## Banner Component with Images

The `BannerComponent` automatically handles image URLs:

```tsx
import BannerComponent from '../components/Common/BannerComponent';

// Basic usage - automatically loads from API
<BannerComponent bannerType="homepageBanner" />

// Custom banner with manual image URL
<BannerComponent 
  bannerType="customBanner"
  customImage="banners/special-offer.jpg"
  height="50vh"
/>
```

## Banner API Response Structure

The banner API returns images in this format:

```typescript
interface Banner {
  banner: string;          // Desktop image filename/path
  mobilebanner: string;    // Mobile image filename/path  
  alt: string;            // Alt text
  bannerMetadata: {
    uploadedAt: string;
    filename: string;
    originalName: string;
    size: number;
  };
}
```

## Image Display Logic

The system automatically:

1. **Converts relative paths to full URLs** using environment configuration
2. **Handles responsive images** - uses mobile images on small screens
3. **Provides fallbacks** when images are missing
4. **Validates file uploads** before sending to server

## Example Implementation

### Form with Image Upload

```tsx
import React, { useState } from 'react';
import { imageApi, imageUtils } from '../api';

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validation = imageUtils.validateImageFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      } else {
        alert(validation.error);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const result = await imageApi.uploadImage(selectedFile, 'user-uploads');
      
      if (result.success && result.data) {
        setUploadedImageUrl(result.data.url);
        alert('Image uploaded successfully!');
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileSelect} />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      
      {uploadedImageUrl && (
        <img 
          src={uploadedImageUrl} 
          alt="Uploaded" 
          style={{ maxWidth: '300px', marginTop: '20px' }}
        />
      )}
    </div>
  );
};
```

## Best Practices

1. **Always validate files** before uploading
2. **Use appropriate folder organization** when uploading
3. **Provide alt text** for accessibility
4. **Use responsive images** for better performance
5. **Handle loading and error states** in UI components
6. **Optimize images** using query parameters when needed

## File Size and Type Limits

- **Max file size**: 5MB (configurable via `VITE_MAX_FILE_SIZE`)
- **Allowed types**: JPEG, JPG, PNG, WebP (configurable via `VITE_ALLOWED_FILE_TYPES`)

## Error Handling

All image functions return a standardized response:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}
```

Always check the `success` property before using the data.