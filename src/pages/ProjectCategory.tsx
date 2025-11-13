import BannerComponent from "../components/Common/BannerComponent";
import CardArea from "../components/Common/CardArea";
import { useParams } from "react-router-dom";
import {
  getCategoryData,
} from "../utils/helper";
import { commerical, plots, residential } from "../constants/projectTypes";
import type { BannerType } from "../types/banner.types";


const ProjectCategory = () => {
  const { category } = useParams();

  // Ensure category is correctly compared as a string
  const CategoryWiseProjects =category ? getCategoryData(category) : [];

  // Get dynamic banner type based on category
  function getBannerType(): BannerType {
    switch (category) {
      case commerical:
        return 'commercialBanner';
      case residential:
        return 'residentialBanner';
      case plots:
        return 'plotBanner';
      default:
        return 'commercialBanner';
    }
  }

  return (
    <section className="sm:mb-20 mb-10">
      <BannerComponent bannerType={getBannerType()} />
      <div className="container-base">
        {CategoryWiseProjects.length > 0 && (
          <CardArea
            section={
              category === commerical
                ? "Commerical Projects"
                : category === residential
                ? "Residential Projects"
                : "Plots"
            }
            // title={
            //   category === commerical
            //     ? ""
            //     : category === residential
            //     ? ""
            //     : "Plots"
            // }
            data={CategoryWiseProjects}
          />
        )}
      </div>
    </section>
  );
};

export default ProjectCategory;
