import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  CreateNotificationRequestDto,
  UpdateNotificationRequestDto,
  NotificationResponseDto,
  GetNotificationsResponseDto,
} from '../types/api';

export interface NotificationService {
  createNotification: (data: CreateNotificationRequestDto) => Promise<NotificationResponseDto>;
  getNotifications: (page?: number, limit?: number) => Promise<GetNotificationsResponseDto>;
  getNotification: (id: string) => Promise<NotificationResponseDto>;
  updateNotification: (id: string, data: UpdateNotificationRequestDto) => Promise<NotificationResponseDto>;
  deleteNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<NotificationResponseDto>;
  markAsUnread: (id: string) => Promise<NotificationResponseDto>;
  archiveNotification: (id: string) => Promise<NotificationResponseDto>;
  deleteNotifications: (ids: string[]) => Promise<void>;
}

class NotificationServiceImpl implements NotificationService {
  async createNotification(data: CreateNotificationRequestDto): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.post<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tạo thông báo thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getNotifications(page: number = 1, limit: number = 10): Promise<GetNotificationsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetNotificationsResponseDto>(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}?${params.toString()}`
      );
      // API returns { success, data: { items, total, page, limit, totalPages }, message }
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách thông báo. Vui lòng thử lại.'
      );
    }
  }

  async getNotification(id: string): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.get<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin thông báo. Vui lòng thử lại.'
      );
    }
  }

  async updateNotification(id: string, data: UpdateNotificationRequestDto): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.put<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Cập nhật thông báo thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa thông báo thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteNotifications(ids: string[]): Promise<void> {
    try {
      const results = await Promise.allSettled(
        ids.map(id => this.deleteNotification(id))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length === ids.length && ids.length > 0) {
        throw new Error('Xóa các thông báo thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa thông báo thất bại. Vui lòng thử lại.'
      );
    }
  }

  async markAsRead(id: string): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.patch<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đánh dấu đã đọc thất bại. Vui lòng thử lại.'
      );
    }
  }

  async markAsUnread(id: string): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.patch<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_UNREAD(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đánh dấu chưa đọc thất bại. Vui lòng thử lại.'
      );
    }
  }

  async archiveNotification(id: string): Promise<NotificationResponseDto> {
    try {
      const response = await apiClient.patch<NotificationResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS.ARCHIVE(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Lưu trữ thông báo thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const notificationService: NotificationService = new NotificationServiceImpl();


