import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  Photo,
  PhotosResponse,
  StatsSummary,
  AuthResponse,
  UploadResponse,
  DuplicatesResponse,
  BlurryPhotosResponse,
  ScreenshotsResponse,
  FavoriteResponse,
  TagsResponse,
  PhotoFilters
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response: AxiosResponse<{ user: User }> = await this.api.get('/auth/me');
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<{ message: string; user: User }> {
    const response: AxiosResponse<{ message: string; user: User }> = await this.api.put('/auth/me', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete('/auth/me', {
      data: { password },
    });
    return response.data;
  }

  // Photo endpoints
  async uploadPhotos(files: File[], onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    const response: AxiosResponse<UploadResponse> = await this.api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async getPhotos(filters: PhotoFilters = {}): Promise<PhotosResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response: AxiosResponse<PhotosResponse> = await this.api.get(`/photos?${params.toString()}`);
    return response.data;
  }

  async getPhoto(id: string): Promise<{ photo: Photo }> {
    const response: AxiosResponse<{ photo: Photo }> = await this.api.get(`/photos/${id}`);
    return response.data;
  }

  async deletePhoto(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete(`/photos/${id}`);
    return response.data;
  }

  async restorePhoto(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.put(`/photos/${id}/restore`);
    return response.data;
  }

  async permanentDeletePhoto(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete(`/photos/${id}/permanent`);
    return response.data;
  }

  async findDuplicates(): Promise<DuplicatesResponse> {
    const response: AxiosResponse<DuplicatesResponse> = await this.api.post('/photos/duplicates');
    return response.data;
  }

  async findBlurryPhotos(threshold?: number): Promise<BlurryPhotosResponse> {
    const response: AxiosResponse<BlurryPhotosResponse> = await this.api.post('/photos/blurry', {
      threshold,
    });
    return response.data;
  }

  async findScreenshots(): Promise<ScreenshotsResponse> {
    const response: AxiosResponse<ScreenshotsResponse> = await this.api.get('/photos/screenshots');
    return response.data;
  }

  async toggleFavorite(id: string): Promise<FavoriteResponse> {
    const response: AxiosResponse<FavoriteResponse> = await this.api.put(`/photos/${id}/favorite`);
    return response.data;
  }

  async updateTags(id: string, tags: string[]): Promise<TagsResponse> {
    const response: AxiosResponse<TagsResponse> = await this.api.put(`/photos/${id}/tags`, {
      tags,
    });
    return response.data;
  }

  async getStats(): Promise<StatsSummary> {
    const response: AxiosResponse<StatsSummary> = await this.api.get('/photos/stats/summary');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response: AxiosResponse<{ status: string; timestamp: string; uptime: number }> = await this.api.get('/health');
    return response.data;
  }

  // Utility methods
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

const apiService = new ApiService();
export default apiService; 