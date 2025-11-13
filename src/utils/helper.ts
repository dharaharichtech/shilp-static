import { blogData } from "../assets/data/blogData";
import { projectData } from "../assets/data/projectData";
import { BlogData } from "../types/blogs.types";
import { ProjectDataTypes } from "../types/projectDataTypes.types";
import { blogApi } from "../api/blogApi";
import { imageUtils } from "./imageUtils";

// Updated function to use API instead of static data
export const getBlogData = async (blogUrl: string) => {
  try {
    // First try to fetch from API
    const response = await blogApi.getBlogBySlugTransformed(blogUrl);
    
    if (response.success && response.data) {
      const blogWithImage = {
        ...response.data,
        image: imageUtils.getImageUrl(response.data.image)
      } as BlogData;
      
      return { blogDetails: blogWithImage };
    }
    
    // Fallback to static data if API fails
    const foundBlog = blogData.find((blog: BlogData) => blog.url === blogUrl);
    
    if (foundBlog) {
      return { blogDetails: foundBlog };
    }
    
    return { error: `Blog "${blogUrl}" not found` };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    
    // Fallback to static data on error
    const foundBlog = blogData.find((blog: BlogData) => blog.url === blogUrl);
    
    if (foundBlog) {
      return { blogDetails: foundBlog };
    }
    
    return { error: `Blog "${blogUrl}" not found` };
  }
};

// Legacy function for backward compatibility
export const getBlogDataStatic = (blogId: string) => {
  const foundBlog = blogData.find((blog: BlogData) => blog.url === blogId);

  if (!blogId) {
    return { error: `blog "${blogId}" not found` };
  }

  return { blogDetails: foundBlog };
};

// For both completed and ongoing projects
export const getCategoryData = (category: string) => {
  const projectCategory: ProjectDataTypes | undefined = projectData.find(
    (project: ProjectDataTypes) => project.category === category
  );
  if (projectCategory) {
    return [
      ...projectCategory.projects,
    ];
  }
  return [];
};


// Fetch project details for a single project
export const fetchProjectDetails = async (category: string, url: string) => {
  try {
    const projectCategory = projectData.find(
      (item: ProjectDataTypes) => item.category === category
    );

    if (!projectCategory) {
      return { error: `Category "${category}" not found` };
    }

    // Find project by URL string instead of ID
    const foundProject = projectCategory.projects.find(
      (project: ProjectDataTypes) => project.url === url
    );

    if (!foundProject) {
      return {
        error: `Project with URL "${url}" not found in ${category} category`,
      };
    }

    return { projectDetails: foundProject };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
};

