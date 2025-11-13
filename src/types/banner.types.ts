// Banner types based on the API response
export interface BannerMetadata {
  uploadedAt: string | null;
  filename: string;
  originalName: string;
  size: number;
}

export interface Banner {
  banner: string;
  mobilebanner: string;
  alt: string;
  bannerMetadata: BannerMetadata;
  mobilebannerMetadata: BannerMetadata;
}

export interface BlogsDetailBanner extends Banner {
  image: string;
  mobileimage: string;
  title: string;
  description: string;
  imageMetadata: BannerMetadata;
  mobileimageMetadata: BannerMetadata;
}

export interface BannersData {
  _id: string;
  homepageBanner: Banner;
  aboutUs: Banner;
  commercialBanner: Banner;
  plotBanner: Banner;
  residentialBanner: Banner;
  contactBanners: Banner;
  careerBanner: Banner;
  ourTeamBanner: Banner;
  termsConditionsBanner: Banner;
  privacyPolicyBanner: Banner;
  projectTreeBanner: Banner;
  blogsDetail: BlogsDetailBanner;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export type BannerType = keyof Omit<BannersData, '_id' | 'documentId' | 'createdAt' | 'updatedAt' | '__v'>;

export const BANNER_TYPES = {
  HOMEPAGE: 'homepageBanner' as const,
  ABOUT_US: 'aboutUs' as const,
  COMMERCIAL: 'commercialBanner' as const,
  PLOT: 'plotBanner' as const,
  RESIDENTIAL: 'residentialBanner' as const,
  CONTACT: 'contactBanners' as const,
  CAREER: 'careerBanner' as const,
  OUR_TEAM: 'ourTeamBanner' as const,
  TERMS_CONDITIONS: 'termsConditionsBanner' as const,
  PRIVACY_POLICY: 'privacyPolicyBanner' as const,
  PROJECT_TREE: 'projectTreeBanner' as const,
  BLOGS_DETAIL: 'blogsDetail' as const,
} as const;