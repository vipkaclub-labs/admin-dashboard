import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  CreateDocumentRequestDto,
  UpdateDocumentRequestDto,
  DocumentResponseDto,
  GetDocumentsResponseDto,
  VerifyDocumentRequestDto,
  VerifyDocumentResponseDto,
} from '../types/api';

export interface DocumentService {
  uploadDocument: (data: CreateDocumentRequestDto) => Promise<DocumentResponseDto>;
  getDocuments: (page?: number, limit?: number, userId?: string, status?: string) => Promise<GetDocumentsResponseDto>;
  getDocument: (id: string) => Promise<DocumentResponseDto>;
  updateDocument: (id: string, data: UpdateDocumentRequestDto) => Promise<DocumentResponseDto>;
  deleteDocument: (id: string) => Promise<void>;
  deleteDocuments: (ids: string[]) => Promise<void>;
  verifyDocument: (id: string, data: VerifyDocumentRequestDto) => Promise<VerifyDocumentResponseDto>;
}

class DocumentServiceImpl implements DocumentService {
  async uploadDocument(data: CreateDocumentRequestDto): Promise<DocumentResponseDto> {
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      if (data.userId) {
        formData.append('userId', data.userId);
      }
      if (data.description) {
        formData.append('description', data.description);
      }

      // Handle file upload
      if (data.file instanceof File) {
        formData.append('file', data.file);
      } else if (typeof data.file === 'string') {
        // If it's a base64 string, convert it to a blob
        const byteCharacters = atob(data.file.split(',')[1] || data.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        formData.append('file', blob);
      }

      const response = await apiClient.post<DocumentResponseDto>(
        API_ENDPOINTS.DOCUMENTS.BASE,
        formData
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tải lên tài liệu KYC thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getDocuments(page: number = 1, limit: number = 10, userId?: string, status?: string): Promise<GetDocumentsResponseDto> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (userId) {
        params.append('userId', userId);
      }
      if (status) {
        params.append('status', status);
      }

      const response = await apiClient.get<GetDocumentsResponseDto>(
        `${API_ENDPOINTS.DOCUMENTS.BASE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy danh sách tài liệu KYC. Vui lòng thử lại.'
      );
    }
  }

  async getDocument(id: string): Promise<DocumentResponseDto> {
    try {
      const response = await apiClient.get<DocumentResponseDto>(
        API_ENDPOINTS.DOCUMENTS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể lấy thông tin tài liệu KYC. Vui lòng thử lại.'
      );
    }
  }

  async updateDocument(id: string, data: UpdateDocumentRequestDto): Promise<DocumentResponseDto> {
    try {
      const response = await apiClient.put<DocumentResponseDto>(
        API_ENDPOINTS.DOCUMENTS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Cập nhật tài liệu KYC thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa tài liệu KYC thất bại. Vui lòng thử lại.'
      );
    }
  }

  async deleteDocuments(ids: string[]): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DOCUMENTS.BATCH, {
        body: JSON.stringify({ ids }),
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xóa nhiều tài liệu KYC thất bại. Vui lòng thử lại.'
      );
    }
  }

  async verifyDocument(id: string, data: VerifyDocumentRequestDto): Promise<VerifyDocumentResponseDto> {
    try {
      const response = await apiClient.post<VerifyDocumentResponseDto>(
        API_ENDPOINTS.DOCUMENTS.VERIFY(id),
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xác thực tài liệu KYC thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const documentService: DocumentService = new DocumentServiceImpl();

