import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  CreateRatingRequestDto,
  UpdateRatingRequestDto,
  RatingResponseDto,
  GetRatingsResponseDto,
} from '../types/api';

export interface RatingService {
  createRating: (data: CreateRatingRequestDto) => Promise<RatingResponseDto>;
  getAllRatings: (page?: number, limit?: number) => Promise<GetRatingsResponseDto>;
  getRatingsByArticle: (articleId: string, page?: number, limit?: number) => Promise<GetRatingsResponseDto>;
  getRatingsByUser: (userId: string, page?: number, limit?: number) => Promise<GetRatingsResponseDto>;
  getRating: (id: string) => Promise<RatingResponseDto>;
  updateRating: (id: string, data: UpdateRatingRequestDto) => Promise<RatingResponseDto>;
  deleteRating: (id: string) => Promise<void>;
  deleteRatings: (ids: string[]) => Promise<void>;
}

class RatingServiceImpl implements RatingService {
  async createRating(data: CreateRatingRequestDto): Promise<RatingResponseDto> {
    try {
      const response = await apiClient.post<RatingResponseDto>(
        API_ENDPOINTS.RATINGS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tạo đánh giá thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getAllRatings(page: number = 1, limit: number = 10): Promise<GetRatingsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetRatingsResponseDto>(
        `${API_ENDPOINTS.RATINGS.BASE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách đánh giá. Vui lòng thử lại.'
      );
    }
  }

  async getRatingsByArticle(articleId: string, page: number = 1, limit: number = 10): Promise<GetRatingsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetRatingsResponseDto>(
        `${API_ENDPOINTS.RATINGS.BY_ARTICLE(articleId)}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách đánh giá theo bài viết. Vui lòng thử lại.'
      );
    }
  }

  async getRatingsByUser(userId: string, page: number = 1, limit: number = 10): Promise<GetRatingsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetRatingsResponseDto>(
        `${API_ENDPOINTS.RATINGS.BY_USER(userId)}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách đánh giá theo người dùng. Vui lòng thử lại.'
      );
    }
  }

  async getRating(id: string): Promise<RatingResponseDto> {
    try {
      const response = await apiClient.get<RatingResponseDto>(
        API_ENDPOINTS.RATINGS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin đánh giá. Vui lòng thử lại.'
      );
    }
  }

  async updateRating(id: string, data: UpdateRatingRequestDto): Promise<RatingResponseDto> {
    try {
      const response = await apiClient.put<RatingResponseDto>(
        API_ENDPOINTS.RATINGS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Cập nhật đánh giá thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteRating(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.RATINGS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa đánh giá thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteRatings(ids: string[]): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.RATINGS.BATCH, { body: JSON.stringify({ ids }) });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa nhiều đánh giá thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const ratingService: RatingService = new RatingServiceImpl();



