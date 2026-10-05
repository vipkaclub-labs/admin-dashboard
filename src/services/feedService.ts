import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  CreateFeedRequestDto,
  UpdateFeedRequestDto,
  FeedResponseDto,
  GetFeedsResponseDto,
} from '../types/api';

export interface FeedService {
  createFeed: (data: CreateFeedRequestDto) => Promise<FeedResponseDto>;
  getFeeds: (page?: number, limit?: number) => Promise<GetFeedsResponseDto>;
  getFeed: (id: string) => Promise<FeedResponseDto>;
  updateFeed: (id: string, data: UpdateFeedRequestDto) => Promise<FeedResponseDto>;
  deleteFeed: (id: string) => Promise<void>;
  deleteFeeds: (ids: string[]) => Promise<void>;
}

class FeedServiceImpl implements FeedService {
  async createFeed(data: CreateFeedRequestDto): Promise<FeedResponseDto> {
    try {
      const response = await apiClient.post<FeedResponseDto>(
        API_ENDPOINTS.FEEDS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tạo feed thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getFeeds(page: number = 1, limit: number = 10): Promise<GetFeedsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetFeedsResponseDto>(
        `${API_ENDPOINTS.FEEDS.BASE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách feeds. Vui lòng thử lại.'
      );
    }
  }

  async getFeed(id: string): Promise<FeedResponseDto> {
    try {
      const response = await apiClient.get<FeedResponseDto>(
        API_ENDPOINTS.FEEDS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin feed. Vui lòng thử lại.'
      );
    }
  }

  async updateFeed(id: string, data: UpdateFeedRequestDto): Promise<FeedResponseDto> {
    try {
      const response = await apiClient.put<FeedResponseDto>(
        API_ENDPOINTS.FEEDS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Cập nhật feed thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteFeed(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.FEEDS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa feed thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteFeeds(ids: string[]): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.FEEDS.BATCH, {
        body: JSON.stringify({ ids }),
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa nhiều feed thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const feedService: FeedService = new FeedServiceImpl();


