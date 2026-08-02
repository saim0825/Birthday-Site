export interface WebsiteSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  metaTitle: string;
  metaDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  copyrightText: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpFrom: string;
  // Typography sizes
  sectionHeadingFontSize?: string;
  bodyTextFontSize?: string;
  // Photo gallery options
  galleryPhotoAspect?: string;
  galleryPhotoFit?: string;
  galleryPhotoHeight?: string;
}

export interface HeroSectionConfig {
  headline: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  heroBgImage: string;
  badgeText: string;
  ratingText: string;
  wishesCreatedCount: string;
  lovedByCount: string;
  customerAvatars: string[];
  showHeroSection: boolean;
  showBadge: boolean;
  showRating: boolean;
  showAvatars: boolean;
  // Typography sizes
  headlineFontSize?: string;
  subheadingFontSize?: string;
  badgeFontSize?: string;
  buttonFontSize?: string;
  // Photo placement and size
  heroPhotoPlacement?: "background" | "side-by-side" | "photo-top";
  heroPhotoPosition?: string;
  heroPhotoFit?: string;
  heroPhotoSize?: string;
  heroPhotoHeight?: string;
  heroPhotoOpacity?: number;
}

export interface ThemeTemplateItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  priceType: "free" | "premium";
  buttonText: string;
  buttonLink: string;
  tags: string[];
  status: "published" | "hidden" | "draft";
  orderIndex: number;
}

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  folder: "Hero" | "Gallery" | "Templates" | "Avatars" | "General";
  fileSize: string;
  fileType: string;
  uploadedAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  orderIndex: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  isDefault: boolean;
  autoplay: boolean;
  defaultVolume: number;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  customerImage: string;
  rating: number;
  reviewText: string;
  status: "approved" | "pending" | "hidden";
  createdAt: string;
}

export interface WishRecord {
  id: string;
  recipientName: string;
  senderName: string;
  templateId: string;
  message: string;
  viewsCount: number;
  createdAt: string;
  status: "active" | "archived";
}

export interface AnalyticsStats {
  visitorsCount: number;
  pageViewsCount: number;
  templatesCreatedCount: number;
  totalWishesCount: number;
  downloadsCount: number;
}
