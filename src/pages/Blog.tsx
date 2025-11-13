import { useState, useEffect } from "react";
import { blogData } from "../assets/data/blogData";
import BlogCard from "../components/Common/BlogCard";
import BlogBannerComponent from "../components/Common/BlogBannerComponent";
import { blogApi } from "../api/blogApi";
import { BlogData } from "../types/blogs.types";
import { imageUtils } from "../utils/imageUtils";
import LoaderWithStyles from "../components/Loader/Loader";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogData[]>(blogData); // Default to static data
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getAllBlogsTransformed();
        
        if (response.success && response.data) {
          // Use the already transformed data from API
          const blogsWithImages = response.data.map(blog => ({
            ...blog,
            image: imageUtils.getImageUrl(blog.image)
          })) as BlogData[];
          setBlogs(blogsWithImages);
        }
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        // Keep using static data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <BlogBannerComponent 
        showTitle={true}
        showSubtitle={true}
        titleVariant="h1"
        overlayOpacity={0.4}
      />
      <div className="container mx-auto px-5 md:px-20 my-10 sm:my-20">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoaderWithStyles />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5 sm:mt-10">
            {[...blogs].reverse().map((blog, index) => (
              <BlogCard className="py-4" data={blog} key={index} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
