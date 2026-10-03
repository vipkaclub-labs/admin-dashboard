import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface PaymentMethodItem {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'gateway';
  status: 'active' | 'inactive';
  dailyLimit: number;
  monthlyLimit: number;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentMethodDto {
  name: string;
  type: 'bank' | 'ewallet' | 'gateway';
  dailyLimit: number;
  monthlyLimit: number;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  instructions?: string;
}

export interface UpdatePaymentMethodDto {
  name?: string;
  type?: 'bank' | 'ewallet' | 'gateway';
  status?: 'active' | 'inactive';
  dailyLimit?: number;
  monthlyLimit?: number;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  instructions?: string;
}

export interface PaginatedPaymentMethodsResponse {
  items: PaymentMethodItem[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentMethodService {
  getPaymentMethods: (params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => Promise<PaginatedPaymentMethodsResponse>;
  getPaymentMethod: (id: string) => Promise<PaymentMethodItem>;
  createPaymentMethod: (data: CreatePaymentMethodDto) => Promise<PaymentMethodItem>;
  updatePaymentMethod: (id: string, data: UpdatePaymentMethodDto) => Promise<PaymentMethodItem>;
  toggleStatus: (id: string) => Promise<PaymentMethodItem>;
  deletePaymentMethod: (id: string) => Promise<boolean>;
}

class PaymentMethodServiceImpl implements PaymentMethodService {
  async getPaymentMethods(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedPaymentMethodsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const qs = searchParams.toString();
      const endpoint = qs
        ? `${API_ENDPOINTS.PAYMENT_METHODS.BASE}?${qs}`
        : API_ENDPOINTS.PAYMENT_METHODS.BASE;

      const response = await apiClient.get<any>(endpoint);
      const data = response.data;

      return {
        items: data?.items || (Array.isArray(data) ? data : []),
        total: data?.total ?? (Array.isArray(data) ? data.length : 0),
        page: data?.page || params?.page || 1,
        limit: data?.limit || params?.limit || 50,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể tải danh sách cổng thanh toán. Vui lòng thử lại.'
      );
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethodItem> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.PAYMENT_METHODS.BY_ID(id));
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin cổng thanh toán. Vui lòng thử lại.'
      );
    }
  }

  async createPaymentMethod(data: CreatePaymentMethodDto): Promise<PaymentMethodItem> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.PAYMENT_METHODS.BASE,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể tạo cổng thanh toán mới. Vui lòng thử lại.'
      );
    }
  }

  async updatePaymentMethod(id: string, data: UpdatePaymentMethodDto): Promise<PaymentMethodItem> {
    try {
      const response = await apiClient.put<any>(
        API_ENDPOINTS.PAYMENT_METHODS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể cập nhật cổng thanh toán. Vui lòng thử lại.'
      );
    }
  }

  async toggleStatus(id: string): Promise<PaymentMethodItem> {
    try {
      const response = await apiClient.patch<any>(
        API_ENDPOINTS.PAYMENT_METHODS.STATUS(id),
        {}
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể thay đổi trạng thái cổng thanh toán. Vui lòng thử lại.'
      );
    }
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      await apiClient.delete<any>(API_ENDPOINTS.PAYMENT_METHODS.BY_ID(id));
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể xóa cổng thanh toán. Vui lòng thử lại.'
      );
    }
  }
}

export const paymentMethodService: PaymentMethodService = new PaymentMethodServiceImpl();
