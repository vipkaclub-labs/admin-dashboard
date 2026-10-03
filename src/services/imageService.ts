import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { ImageResponseDto } from '../types/api';

export interface ImageService {
    uploadImage: (file: File, description?: string) => Promise<ImageResponseDto>;
    getImages: (offset: number, limit: number) => Promise<ImageResponseDto[]>;
    getImage: (id: string) => Promise<ImageResponseDto>;
    deleteImage: (id: string) => Promise<void>;
}

class ImageServiceImpl implements ImageService {
    async uploadImage(file: File, description?: string): Promise<ImageResponseDto> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (description) {
                formData.append('description', description);
            }

            // For file uploads, we need to handle differently without JSON content type
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'}${API_ENDPOINTS.IMAGES.BASE}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Upload hình ảnh thất bại');
            }

            const data = await response.json();
            // Handle SuccessResponseDto format
            return data?.success === true && data?.data ? data.data : data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Upload hình ảnh thất bại');
        }
    }

    async getImages(offset: number = 0, limit: number = 10): Promise<ImageResponseDto[]> {
        try {
            const response = await apiClient.get<ImageResponseDto[]>(
                `${API_ENDPOINTS.IMAGES.BASE}?offset=${offset}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Lấy danh sách hình ảnh thất bại');
        }
    }

    async getImage(id: string): Promise<ImageResponseDto> {
        try {
            const response = await apiClient.get<ImageResponseDto>(
                API_ENDPOINTS.IMAGES.BY_ID(id)
            );
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Lấy thông tin hình ảnh thất bại');
        }
    }

    async deleteImage(id: string): Promise<void> {
        try {
            await apiClient.delete(API_ENDPOINTS.IMAGES.BY_ID(id));
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Xóa hình ảnh thất bại');
        }
    }
}

export const imageService: ImageService = new ImageServiceImpl();
