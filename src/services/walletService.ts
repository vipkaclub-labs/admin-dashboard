import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { UpdateBalanceDto, BalanceResponse, SuccessResponseDto } from '../types/api';

export interface WalletTransactionItem {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: string;
  amount: number;
  status: string;
  referenceId?: string | null;
  description?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name?: string;
    username?: string;
    email?: string;
  };
}

export interface GetAllTransactionsParams {
  userId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactionsResponse {
  items: WalletTransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface WalletService {
  getBalance: (userId: string) => Promise<BalanceResponse>;
  creditBalance: (data: UpdateBalanceDto) => Promise<SuccessResponseDto>;
  debitBalance: (data: UpdateBalanceDto) => Promise<SuccessResponseDto>;
  getAllTransactions: (params?: GetAllTransactionsParams) => Promise<PaginatedTransactionsResponse>;
}

class WalletServiceImpl implements WalletService {
  async getBalance(userId: string): Promise<BalanceResponse> {
    try {
      const response = await apiClient.get<BalanceResponse>(
        `${API_ENDPOINTS.WALLET.BALANCE}?user_id=${encodeURIComponent(userId)}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy số dư. Vui lòng thử lại.'
      );
    }
  }

  async creditBalance(data: UpdateBalanceDto): Promise<SuccessResponseDto> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.WALLET.CREDIT_BALANCE,
        data
      );
      return { success: true, data: response.data || {}, message: response.message };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Nạp tiền thất bại. Vui lòng thử lại.'
      );
    }
  }

  async debitBalance(data: UpdateBalanceDto): Promise<SuccessResponseDto> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.WALLET.DEBIT_BALANCE,
        data
      );
      return { success: true, data: response.data || {}, message: response.message };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Trừ tiền thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getAllTransactions(params?: GetAllTransactionsParams): Promise<PaginatedTransactionsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.userId) searchParams.append('userId', params.userId);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const qs = searchParams.toString();
      const endpoint = qs ? `${API_ENDPOINTS.WALLET.TRANSACTIONS}?${qs}` : API_ENDPOINTS.WALLET.TRANSACTIONS;
      const response = await apiClient.get<any>(endpoint);
      const data = response.data;
      return {
        items: data?.transactions || data?.items || (Array.isArray(data) ? data : []),
        total: data?.total || 0,
        page: data?.page || params?.page || 1,
        limit: data?.limit || params?.limit || 10,
        totalPages: data?.totalPages || Math.ceil((data?.total || 0) / (params?.limit || 10)),
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách giao dịch. Vui lòng thử lại.'
      );
    }
  }
}

export const walletService: WalletService = new WalletServiceImpl();
