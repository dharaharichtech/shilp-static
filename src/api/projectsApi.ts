import { apiClient } from './apiClient';

// API Project Data Type (matches backend response structure)
export interface ApiProjectData {
  _id: string;
  projectTitle: string;
  slug: string;
  brochure?: string;
  projectState: 'completed' | 'on-going';
  projectType: 'residential' | 'commercial' | 'plot';
  shortAddress: string;
  projectStatusPercentage: number;
  aboutUsDetail: {
    description1: string;
    description2: string;
    description3: string;
    description4: string;
    image: {
      url: string;
      alt: string;
    };
  };
  floorPlans: Array<{
    title: string;
    image: string;
    alt: string;
    _id: string;
  }>;
  projectImages: Array<{
    image: string;
    alt: string;
    _id: string;
  }>;
  amenities: Array<{
    title: string;
    svgOrImage: string;
    alt: string;
    _id: string;
  }>;
  youtubeUrl: string;
  updatedImagesTitle: string;
  updatedImages: Array<{
    image: string;
    alt: string;
    _id: string;
  }>;
  locationTitle: string;
  locationTitleText: string;
  locationArea: string;
  number1: string;
  number2: string;
  email1: string;
  email2: string;
  mapIframeUrl: string;
  cardImage: string;
  cardLocation: string;
  cardAreaFt: string;
  cardProjectType: string;
  cardHouse: string;
  reraNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bannerSection?: {
    desktopBannerImage: string;
    mobileBannerImage: string;
    alt: string;
  };
}

export interface ProjectsApiResponse {
  success: boolean;
  data: ApiProjectData[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Frontend Project Data Type (for CardArea component)
export interface ProjectCardData {
  id: string;
  title: string;
  slug: string;
  image: string;
  location: string;
  areaFt: string;
  projectType: 'residential' | 'commercial' | 'plot';
  house: string;
  state: 'completed' | 'on-going';
  statusPercentage: number;
  alt: string;
}

// Transform API project data to card format (for CardArea component)
export const transformProjectToCard = (apiProject: ApiProjectData): ProjectCardData => {
  return {
    id: apiProject._id,
    title: apiProject.projectTitle,
    slug: apiProject.slug,
    image: apiProject.cardImage,
    location: apiProject.cardLocation,
    areaFt: apiProject.cardAreaFt,
    projectType: apiProject.projectType,
    house: apiProject.cardHouse,
    state: apiProject.projectState,
    statusPercentage: apiProject.projectStatusPercentage,
    alt: `${apiProject.projectTitle} - ${apiProject.shortAddress}`,
  };
};

// Helper function to capitalize project type
const capitalizeProjectType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'residential':
      return 'Residential';
    case 'commercial':
      return 'Commercial';
    case 'plot':
      return 'Plot';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

// Projects API service
export const projectsApi = {
  /**
   * Get all projects
   */
  async getAllProjects(): Promise<ProjectsApiResponse> {
    try {
      const response = await apiClient.get<ProjectsApiResponse>('/public/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Get project by slug
   */
  async getProjectBySlug(slug: string): Promise<{ success: boolean; data?: ApiProjectData }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: ApiProjectData }>(`/public/projects/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      throw error;
    }
  },

  /**
   * Get all projects transformed for CardArea component
   */
  async getAllProjectsForCards() {
    try {
      const response = await this.getAllProjects();
      if (response.success && response.data) {
        const transformedProjects = response.data.map(transformProjectToCard);
        
        // Sort by creation date (newest first)
        const sortedProjects = transformedProjects.sort((a, b) => 
          new Date(response.data.find(p => p._id === b.id)?.createdAt || '').getTime() - 
          new Date(response.data.find(p => p._id === a.id)?.createdAt || '').getTime()
        );

        return {
          success: true,
          data: sortedProjects,
          pagination: response.pagination,
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching projects for cards:', error);
      throw error;
    }
  },

  /**
   * Get projects by type for CardArea component
   */
  async getProjectsByType(type: 'residential' | 'commercial' | 'plot') {
    try {
      const response = await this.getAllProjectsForCards();
      if (response.success && response.data) {
        const filteredProjects = response.data.filter(project => project.projectType === type);
        return {
          success: true,
          data: filteredProjects,
          pagination: response.pagination,
        };
      }
      return response;
    } catch (error) {
      console.error(`Error fetching ${type} projects:`, error);
      throw error;
    }
  },

  /**
   * Get project by slug with full details
   */
  async getProjectBySlugDetailed(slug: string) {
    try {
      const response = await this.getProjectBySlug(slug);
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching detailed project by slug:', error);
      throw error;
    }
  }
};

export default projectsApi;