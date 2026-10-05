import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
  CommentResponseDto,
  GetCommentsResponseDto,
} from '../types/api';

export interface CommentService {
  createComment: (data: CreateCommentRequestDto) => Promise<CommentResponseDto>;
  getAllComments: (page?: number, limit?: number) => Promise<GetCommentsResponseDto>;
  getCommentsByArticle: (articleId: string, page?: number, limit?: number) => Promise<GetCommentsResponseDto>;
  getComment: (id: string) => Promise<CommentResponseDto>;
  updateComment: (id: string, data: UpdateCommentRequestDto) => Promise<CommentResponseDto>;
  deleteComment: (id: string) => Promise<void>;
  deleteComments: (ids: string[]) => Promise<{ successCount: number; failedCount: number; failedIds: string[] }>;
}

class CommentServiceImpl implements CommentService {
  async createComment(data: CreateCommentRequestDto): Promise<CommentResponseDto> {
    try {
      const response = await apiClient.post<CommentResponseDto>(
        API_ENDPOINTS.COMMENTS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tạo bình luận thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getAllComments(page: number = 1, limit: number = 10): Promise<GetCommentsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetCommentsResponseDto>(
        `${API_ENDPOINTS.COMMENTS.BASE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách bình luận. Vui lòng thử lại.'
      );
    }
  }

  async getCommentsByArticle(articleId: string, page: number = 1, limit: number = 10): Promise<GetCommentsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<GetCommentsResponseDto>(
        `${API_ENDPOINTS.COMMENTS.BY_ARTICLE(articleId)}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách bình luận. Vui lòng thử lại.'
      );
    }
  }

  async getComment(id: string): Promise<CommentResponseDto> {
    try {
      const response = await apiClient.get<CommentResponseDto>(
        API_ENDPOINTS.COMMENTS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin bình luận. Vui lòng thử lại.'
      );
    }
  }

  async updateComment(id: string, data: UpdateCommentRequestDto): Promise<CommentResponseDto> {
    try {
      const response = await apiClient.put<CommentResponseDto>(
        API_ENDPOINTS.COMMENTS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Cập nhật bình luận thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.COMMENTS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa bình luận thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteComments(ids: string[]): Promise<{ successCount: number; failedCount: number; failedIds: string[] }> {
    try {
      console.log('Calling bulk delete with ids:', ids);
      await apiClient.delete(
        API_ENDPOINTS.COMMENTS.BATCH,
        { body: JSON.stringify({ ids }) }
      );

      return {
        successCount: ids.length,
        failedCount: 0,
        failedIds: [],
      };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Bulk delete comments API error:', apiError);
      throw new Error(
        apiError.message || 'Xóa nhiều bình luận thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const commentService: CommentService = new CommentServiceImpl();

