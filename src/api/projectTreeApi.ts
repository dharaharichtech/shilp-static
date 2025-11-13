import { apiClient } from './apiClient';

// API Project Tree Data Type (matches backend response structure)
export interface ApiProjectTreeData {
  imageMetadata: {
    uploadedAt: string;
    filename: string;
    originalName: string;
    size: number;
  };
  _id: string;
  no: number;
  year: number;
  title: string;
  location: string;
  image: string;
  typeofproject: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProjectTreeApiResponse {
  success: boolean;
  data: ApiProjectTreeData[];
}

// Frontend Project Tree Data Type
export interface ProjectTreeData {
  id: string;
  no: number;
  year: string;
  title: string;
  location: string;
  type: string;
  image: string;
  alt: string;
}

// Transform API project tree data to frontend format
export const transformProjectTreeData = (apiProject: ApiProjectTreeData): ProjectTreeData => {
  return {
    id: apiProject._id,
    no: apiProject.no,
    year: apiProject.year.toString(),
    title: apiProject.title,
    location: apiProject.location,
    type: capitalizeProjectType(apiProject.typeofproject),
    image: apiProject.image,
    alt: `${apiProject.title} - ${apiProject.location}`
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

// Group projects by year
export const groupProjectsByYear = (projects: ProjectTreeData[]): { [year: string]: ProjectTreeData[] } => {
  return projects.reduce((grouped, project) => {
    const year = project.year;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(project);
    return grouped;
  }, {} as { [year: string]: ProjectTreeData[] });
};

// Project Tree API service
export const projectTreeApi = {
  /**
   * Get all project tree data
   */
  async getProjectTree(): Promise<ProjectTreeApiResponse> {
    try {
      const response = await apiClient.get<ProjectTreeApiResponse>('/public/project-tree');
      return response.data;
    } catch (error) {
      console.error('Error fetching project tree:', error);
      throw error;
    }
  },

  /**
   * Get all project tree data with frontend format transformation
   */
  async getProjectTreeTransformed() {
    try {
      const response = await this.getProjectTree();
      if (response.success && response.data) {
        const transformedProjects = response.data.map(transformProjectTreeData);
        
        // Sort by createdAt year (descending) for timeline order
        const sortedProjects = transformedProjects.sort((a, b) => {
          // Get the year from createdAt of original API data
          const aCreatedAt = response.data.find(p => p._id === a.id)?.createdAt;
          const bCreatedAt = response.data.find(p => p._id === b.id)?.createdAt;
          
          if (aCreatedAt && bCreatedAt) {
            const aYear = new Date(aCreatedAt).getFullYear();
            const bYear = new Date(bCreatedAt).getFullYear();
            
            if (aYear !== bYear) {
              return bYear - aYear; // Descending by creation year
            }
            // If same year, sort by creation date (newest first)
            return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
          }
          
          // Fallback to year and number sorting if createdAt not available
          if (a.year !== b.year) {
            return parseInt(b.year) - parseInt(a.year);
          }
          return b.no - a.no;
        });

        return {
          success: true,
          data: sortedProjects,
          groupedByYear: groupProjectsByYear(sortedProjects)
        };
      }
      return response;
    } catch (error) {
      console.error('Error fetching transformed project tree:', error);
      throw error;
    }
  }
};

export default projectTreeApi;