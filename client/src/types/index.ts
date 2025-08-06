export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  storageUsed: number;
  storageLimit: number;
  lastLogin: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  autoDeleteDuplicates: boolean;
  qualityThreshold: number;
  language: string;
}

export interface Photo {
  _id: string;
  user: string;
  originalName: string;
  filename: string;
  path: string;
  thumbnailPath?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  hash: string;
  perceptualHash?: string;
  metadata?: PhotoMetadata;
  analysis: PhotoAnalysis;
  status: 'active' | 'trash' | 'deleted';
  tags: string[];
  favorite: boolean;
  views: number;
  duplicateGroup?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  thumbnailUrl: string;
  formattedSize: string;
  resolution: string;
}

export interface PhotoMetadata {
  camera?: string;
  dateTaken?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
}

export interface PhotoAnalysis {
  isDuplicate: boolean;
  isBlurry: boolean;
  isScreenshot: boolean;
  quality?: number;
  brightness?: number;
  contrast?: number;
  sharpness?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PhotosResponse {
  photos: Photo[];
  pagination: PaginationInfo;
}

export interface StatsSummary {
  totalPhotos: number;
  duplicatePhotos: number;
  blurryPhotos: number;
  screenshotPhotos: number;
  favoritePhotos: number;
  storageUsed: number;
  storageLimit: number;
  storagePercentage: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: any[];
}

export interface UploadResponse {
  message: string;
  uploaded: number;
  errors?: Array<{
    filename: string;
    error: string;
  }>;
  photos: Photo[];
}

export interface DuplicatesResponse {
  message: string;
  duplicates: Photo[];
}

export interface BlurryPhotosResponse {
  message: string;
  blurryPhotos: Photo[];
}

export interface ScreenshotsResponse {
  message: string;
  screenshots: Photo[];
}

export interface FavoriteResponse {
  message: string;
  favorite: boolean;
}

export interface TagsResponse {
  message: string;
  tags: string[];
}

export interface PhotoFilters {
  status?: 'active' | 'trash' | 'deleted';
  sort?: 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc' | 'name-asc' | 'name-desc';
  filter?: 'all' | 'duplicates' | 'blurry' | 'screenshots' | 'favorites';
  page?: number;
  limit?: number;
}

export interface TinderCard {
  photo: Photo;
  index: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
} 