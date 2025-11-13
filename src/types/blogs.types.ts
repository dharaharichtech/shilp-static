export type BlogPoint = {
  title: string; 
  subtitle: string | string[]; 
  image : string | null;
  child?: any[];
};

export type BlogData = {
    id: number | string;
    image: string;
    alt:string;
    date: string;
    publish:string;
    url:string;
    title: string;
    desc: string;
    points : BlogPoint[];
  };
  

  export type BlogBannerItem = {
    image: string;
    title: string;
  };
  

  export type BlogBannerProps = {
    data: BlogBannerItem[];
  };
  