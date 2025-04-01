import { create, StateCreator } from 'zustand';
import { images } from '@/lib/api';

interface ImageAnalysis {
  clothingType: string;
  colors: string[];
  patterns: string;
  style: string;
}

interface UploadedImage {
  image_id: number;
  image_url: string;
  analysis: ImageAnalysis;
  color_palette: Array<{
    rgb: number[];
    hex: string;
    percentage: number;
    name: string;
  }>;
}

interface ImageUploadState {
  images: UploadedImage[];
  isLoading: boolean;
  error: string | null;
  uploadImage: (file: File, userId: number) => Promise<void>;
  getUserImages: (userId: number) => Promise<void>;
  deleteImage: (imageId: number) => Promise<void>;
}

const useImageUpload = create<ImageUploadState>((set: StateCreator<ImageUploadState>) => ({
  images: [],
  isLoading: false,
  error: null,

  uploadImage: async (file: File, userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', userId.toString());

      const response = await images.upload(formData);
      set((state: ImageUploadState) => ({
        images: [response, ...state.images],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to upload image',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserImages: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await images.getUserImages(userId);
      set({ images: response, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch images',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteImage: async (imageId: number) => {
    set({ isLoading: true, error: null });
    try {
      await images.deleteImage(imageId);
      set((state: ImageUploadState) => ({
        images: state.images.filter((img: UploadedImage) => img.image_id !== imageId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete image',
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useImageUpload; 