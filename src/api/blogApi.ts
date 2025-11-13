import { apiClient } from './apiClient';

// API Blog Data Type (matches backend response structure)
export interface ApiBlogPoint {
  title: string;
  subtitle: string;
  image: string;
  child: any[];
}

export interface ApiBlogData {
  _id: string;
  title: string;
  description: string;
  publish: string;
  date: string;
  url: string;
  image: string;
  alt: string;
  points: ApiBlogPoint[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogsApiResponse {
  success: boolean;
  data: ApiBlogData[];
}

export interface SingleBlogApiResponse {
  success: boolean;
  data: ApiBlogData;
}

// Transform API blog data to frontend format
export const transformBlogData = (apiBlog: ApiBlogData) => {
  return {
    id: apiBlog._id,
    image: apiBlog.image,
    alt: apiBlog.alt,
    date: apiBlog.date,
    publish: apiBlog.publish,
    url: apiBlog.url,
    title: apiBlog.title,
    desc: apiBlog.description, // Map description to desc
    points: apiBlog.points.map(point => ({
      title: point.title,
      subtitle: point.subtitle,
      image: point.image || null
    }))
  };
};

// Blog API service
export const blogApi = {
  /**
   * Get all blogs
   */
  async getAllBlogs(): Promise<BlogsApiResponse> {
    try {
      const response = await apiClient.get<BlogsApiResponse>('/public/blogs');
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  /**
   * Get blog by slug/url
   */
  async getBlogBySlug(slug: string): Promise<SingleBlogApiResponse> {
    try {
      const response = await apiClient.get<SingleBlogApiResponse>(`/public/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  /**
   * Get all blogs with frontend format transformation
   */
  async getAllBlogsTransformed() {
    try {
      const response = await this.getAllBlogs();
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.map(transformBlogData)
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching transformed blogs:', error);
      throw error;
    }
  },

  /**
   * Get blog by slug with frontend format transformation
   */
  async getBlogBySlugTransformed(slug: string) {
    try {
      const response = await this.getBlogBySlug(slug);
      if (response.success && response.data) {
        return {
          success: true,
          data: transformBlogData(response.data)
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching transformed blog by slug:', error);
      throw error;
    }
  }
};

export default blogApi;