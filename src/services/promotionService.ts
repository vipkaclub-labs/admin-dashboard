import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface PromotionItem {
  id: string;
  name: string;
  type: string;
  bonus: string;
  maxBonus: number;
  status: 'active' | 'upcoming' | 'expired' | 'paused';
  participants: number;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetPromotionsParams {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPromotionsResponse {
  items: PromotionItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePromotionDto {
  name: string;
  type: string;
  bonus: string;
  maxBonus: number;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface UpdatePromotionDto {
  name?: string;
  type?: string;
  bonus?: string;
  maxBonus?: number;
  status?: 'active' | 'upcoming' | 'expired' | 'paused';
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface PromotionService {
  getPromotions: (params?: GetPromotionsParams) => Promise<PaginatedPromotionsResponse>;
  getPromotion: (id: string) => Promise<PromotionItem>;
  createPromotion: (data: CreatePromotionDto) => Promise<PromotionItem>;
  updatePromotion: (id: string, data: UpdatePromotionDto) => Promise<PromotionItem>;
  updateStatus: (id: string, status: 'active' | 'upcoming' | 'expired' | 'paused') => Promise<PromotionItem>;
  deletePromotion: (id: string) => Promise<void>;
}

class PromotionServiceImpl implements PromotionService {
  async getPromotions(params?: GetPromotionsParams): Promise<PaginatedPromotionsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const qs = searchParams.toString();
      const endpoint = qs ? `${API_ENDPOINTS.PROMOTIONS.BASE}?${qs}` : API_ENDPOINTS.PROMOTIONS.BASE;
      const response = await apiClient.get<any>(endpoint);
      const data = response.data;

      return {
        items: data?.items || (Array.isArray(data) ? data : []),
        total: data?.total || 0,
        page: data?.page || params?.page || 1,
        limit: data?.limit || params?.limit || 20,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Không thể lấy danh sách khuyến mãi.');
    }
  }

  async getPromotion(id: string): Promise<PromotionItem> {
    try {
      const response = await apiClient.get<PromotionItem>(API_ENDPOINTS.PROMOTIONS.BY_ID(id));
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Không thể lấy chi tiết khuyến mãi.');
    }
  }

  async createPromotion(data: CreatePromotionDto): Promise<PromotionItem> {
    try {
      const response = await apiClient.post<PromotionItem>(API_ENDPOINTS.PROMOTIONS.BASE, data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Tạo khuyến mãi thất bại.');
    }
  }

  async updatePromotion(id: string, data: UpdatePromotionDto): Promise<PromotionItem> {
    try {
      const response = await apiClient.put<PromotionItem>(API_ENDPOINTS.PROMOTIONS.BY_ID(id), data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Cập nhật khuyến mãi thất bại.');
    }
  }

  async updateStatus(id: string, status: 'active' | 'upcoming' | 'expired' | 'paused'): Promise<PromotionItem> {
    try {
      const response = await apiClient.patch<PromotionItem>(API_ENDPOINTS.PROMOTIONS.STATUS(id), { status });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Thay đổi trạng thái khuyến mãi thất bại.');
    }
  }

  async deletePromotion(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PROMOTIONS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Xóa khuyến mãi thất bại.');
    }
  }
}

export const promotionService: PromotionService = new PromotionServiceImpl();
