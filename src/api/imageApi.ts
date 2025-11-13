import { apiClient } from './apiClient';
import { imageUtils } from '../utils/imageUtils';
import type { ApiResponse } from '../types/api.types';

// Image upload types
export interface ImageUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  path: string;
  url: string;
  uploadedAt: string;
}

export interface MultipleImageUploadResponse {
  images: ImageUploadResponse[];
  totalCount: number;
}

// Image API functions
export const imageApi = {
  // Single image upload
  uploadImage: async (file: File, folder?: string): Promise<ApiResponse<ImageUploadResponse>> => {
    try {
      // Validate file first
      const validation = imageUtils.validateImageFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'Invalid file',
          data: null,
        };
      }

      const formData = new FormData();
      formData.append('image', file);
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: 'Image uploaded successfully',
      };
    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to upload image',
        data: null,
      };
    }
  },

  // Multiple images upload
  uploadMultipleImages: async (files: File[], folder?: string): Promise<ApiResponse<MultipleImageUploadResponse>> => {
    try {
      // Validate all files first
      for (const file of files) {
        const validation = imageUtils.validateImageFile(file);
        if (!validation.valid) {
          return {
            success: false,
            error: `File ${file.name}: ${validation.error}`,
            data: null,
          };
        }
      }

      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append(`images`, file);
      });
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await apiClient.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: `${files.length} images uploaded successfully`,
      };
    } catch (error: any) {
      console.error('❌ Error uploading multiple images:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to upload images',
        data: null,
      };
    }
  },

  // Delete image
  deleteImage: async (filename: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.delete(`/upload/image/${encodeURIComponent(filename)}`);

      return {
        success: true,
        data: response.data.data,
        message: 'Image deleted successfully',
      };
    } catch (error: any) {
      console.error('❌ Error deleting image:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete image',
        data: null,
      };
    }
  },

  // Get image info
  getImageInfo: async (filename: string): Promise<ApiResponse<ImageUploadResponse>> => {
    try {
      const response = await apiClient.get(`/upload/image/${encodeURIComponent(filename)}/info`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('❌ Error getting image info:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get image info',
        data: null,
      };
    }
  },

  // Get all images in a folder
  getImagesInFolder: async (folder: string): Promise<ApiResponse<ImageUploadResponse[]>> => {
    try {
      const response = await apiClient.get(`/upload/folder/${encodeURIComponent(folder)}`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('❌ Error getting images in folder:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get images',
        data: null,
      };
    }
  },
};

// Export individual functions for convenience
export const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo,
  getImagesInFolder,
} = imageApi;

export default imageApi;