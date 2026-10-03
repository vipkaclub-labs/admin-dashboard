import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface AuditLogItem {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface GetAuditLogsParams {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogsResponse {
  logs: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface AuditLogService {
  getAuditLogs: (params?: GetAuditLogsParams) => Promise<PaginatedAuditLogsResponse>;
}

class AuditLogServiceImpl implements AuditLogService {
  async getAuditLogs(params?: GetAuditLogsParams): Promise<PaginatedAuditLogsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.userId) searchParams.append('userId', params.userId);
      if (params?.action) searchParams.append('action', params.action);
      if (params?.resourceType) searchParams.append('resourceType', params.resourceType);
      if (params?.resourceId) searchParams.append('resourceId', params.resourceId);
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const qs = searchParams.toString();
      const endpoint = qs ? `${API_ENDPOINTS.AUDIT_LOGS.BASE}?${qs}` : API_ENDPOINTS.AUDIT_LOGS.BASE;
      const response = await apiClient.get<any>(endpoint);
      const data = response.data;
      return {
        logs: data?.logs || data?.items || (Array.isArray(data) ? data : []),
        total: data?.total || 0,
        page: data?.page || params?.page || 1,
        limit: data?.limit || params?.limit || 10,
        totalPages: data?.totalPages || Math.ceil((data?.total || 0) / (params?.limit || 10)),
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể tải nhật ký hoạt động. Vui lòng thử lại.'
      );
    }
  }
}

export const auditLogService: AuditLogService = new AuditLogServiceImpl();
