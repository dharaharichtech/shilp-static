import { useState, useEffect } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import BannerComponent from "../components/Common/BannerComponent";
import Title from "../components/Common/Title";
import { GoDotFill } from "react-icons/go";
import { projectTreeApi, ProjectTreeData } from "../api/projectTreeApi";
import { imageUtils } from "../utils/imageUtils";
import LoaderWithStyles from "../components/Loader/Loader";

const ProjectTree = () => {
  const [projects, setProjects] = useState<ProjectTreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectTreeApi.getProjectTreeTransformed();
        
        if (response.success && response.data) {
          // The API response is already transformed, just add image URLs
          const projectsWithImages = response.data.map(project => ({
            ...project,
            image: imageUtils.getImageUrl(project.image)
          })) as ProjectTreeData[];
          
          setProjects(projectsWithImages);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Group projects into rows of exactly 3 projects each (chronological order)
  const groupProjectsIntoRows = (projects: ProjectTreeData[]): ProjectTreeData[][] => {
    // Sort all projects by year (descending) then by number (descending) for chronological order
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      return b.no - a.no;
    });

    // Group into rows of exactly 3 projects each
    const rows: ProjectTreeData[][] = [];
    for (let i = 0; i < sortedProjects.length; i += 3) {
      rows.push(sortedProjects.slice(i, i + 3));
    }
    
    return rows;
  };

  const renderDesktopItem = (item: ProjectTreeData) => {
    return (
      <div className="hidden lg:flex items-center justify-between p-5 lg:w-[250px] xl:w-[290px] h-[150px] bg-white transition-all duration-300 hover:shadow-lg rounded-lg">
        <div className="flex flex-col items-start space-y-2 w-[70%]">
          {/* Year Badge */}
          <div className="border rounded-[20px] py-1 px-4 flex items-center gap-2 w-[100px] h-[30px] text-center justify-center">
            <GoDotFill />
            <span className="w-full h-full flex items-center justify-center">{item.year}</span>
          </div>

          {/* Title */}
          <div className="w-full h-[24px] flex items-center">
            <h2 className="text-sm xl:text-base text-left truncate">{item.title}</h2>
          </div>

          {/* Location */}
          <div className="w-full h-[24px] flex items-center">
            <span className="text-sm text-gray-500 text-left truncate">{item.location}</span>
          </div>

          {/* Type */}
          <div className="w-full h-[24px] flex items-center">
            <span className="text-sm truncate">{item.type}</span>
          </div>
        </div>

        {/* Image */}
        <div className="w-[70px] h-[70px] flex-shrink-0">
          <img 
            src={item.image} 
            loading="lazy" 
            className="w-full h-full border rounded-full object-cover" 
            alt={item.alt}
            onError={(e) => {
              // Fallback to hide image on error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  };

  const renderMobileTimelineItem = (item: ProjectTreeData) => (
    <TimelineItem key={item.id}>
      <TimelineSeparator>
        <TimelineDot
          style={{ borderRadius: "4px", width: "10px", height: "10px" }}
        />
        <div className="w-10 border-top absolute" />
        <TimelineConnector className="timeline-connector" />
      </TimelineSeparator>
      <TimelineContent>
        <div className="bg-white transition-all duration-300 hover:shadow-lg rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <span className="inline-block border rounded-[20px] px-4 py-1 text-sm w-[70px]">
                {item.year}
              </span>
              <h2 className="text-lg font-medium">{item.title}</h2>
              <span className="text-sm text-gray-500">{item.location}</span>
              <span className="text-sm">{item.type}</span>
            </div>
            <img
              src={item.image}
              className="w-16 h-16 border rounded-full object-cover"
              alt={item.alt}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );

  if (loading) {
    return (
      <section className="project-tree overflow-hidden">
        <BannerComponent bannerType="projectTreeBanner" />
        <div className="container-base top-spacing space-y-6" style={{ marginLeft: "20px" }}>
          <Title text="Explore" />
          <h2 className="text-3xl">Our Project Tree</h2>
        </div>
        <div className="bg-[#f6f6f6] flex justify-center items-center min-h-[400px] top-spacing">
          <LoaderWithStyles />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="project-tree overflow-hidden">
        <BannerComponent bannerType="projectTreeBanner" />
        <div className="container-base top-spacing space-y-6" style={{ marginLeft: "20px" }}>
          <Title text="Explore" />
          <h2 className="text-3xl">Our Project Tree</h2>
        </div>
        <div className="bg-[#f6f6f6] flex justify-center items-center min-h-[400px] top-spacing">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  const projectRows = groupProjectsIntoRows(projects);

  return (
    <section className="project-tree overflow-hidden">
      <BannerComponent bannerType="projectTreeBanner" />
      <div className="container-base top-spacing space-y-6" style={{ marginLeft: "20px" }}>
        <Title text="Explore" />
        <h2 className="text-3xl">Our Project Tree</h2>
      </div>

      {/* Desktop View */}
      <div className="bg-[#f6f6f6] hidden lg:block top-spacing">
        <div className="mapWrapper pb-20">
          {projectRows.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((item) => (
                <div key={item.id} className="itemBar">
                  <div className="itemInfo">{renderDesktopItem(item)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden block px-4 py-8 bg-[#f6f6f6] top-spacing">
        <Timeline>
          {projects.map((item) => renderMobileTimelineItem(item))}
        </Timeline>
      </div>
    </section>
  );
};

export default ProjectTree;