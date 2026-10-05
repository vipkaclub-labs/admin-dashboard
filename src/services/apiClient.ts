import { API_CONFIG } from '../config/api';
import { ErrorResponseDto } from '../types/api';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  error?: {
    code?: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Handle token expiration - clear storage and redirect to login
   */
  private handleTokenExpiration() {
    // Clear all auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    
    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken') || localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const url = `${this.baseURL}${endpoint}`;

    // Check if Content-Type should be included
    // If headers are provided and don't have Content-Type, and body is empty, don't add it
    const providedHeaders = options.headers as HeadersInit | undefined;
    const hasContentType = providedHeaders && 'Content-Type' in providedHeaders;
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const hasBody = options.body !== undefined && options.body !== '';
    
    const defaultHeaders: HeadersInit = {
      Accept: 'application/json',
      // Only add Content-Type if body exists, is not FormData, and Content-Type is not explicitly provided
      ...(hasBody && !hasContentType && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    };

    // Add Authorization header if token exists
    const token = this.getAccessToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Get cookies from document if available
    const cookies = typeof document !== 'undefined' ? document.cookie : '';

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...providedHeaders,
        ...(cookies ? { Cookie: cookies } : {}),
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        this.handleTokenExpiration();
        throw {
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          status: 401,
        } as ApiError;
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      let data: any;
      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle ErrorResponseDto format
        if (data?.success === false && data?.error) {
          const errorResponse = data as ErrorResponseDto;
          const error: ApiError = {
            message: errorResponse.message || `HTTP error! status: ${response.status}`,
            status: response.status,
            error: errorResponse.error,
            errors: errorResponse.error.details?.reduce((acc: Record<string, string[]>, detail: { field?: string; message: string }) => {
              if (detail.field) {
                acc[detail.field] = [detail.message];
              }
              return acc;
            }, {} as Record<string, string[]>),
          };
          throw error;
        }
        
        // Fallback for other error formats
        const error: ApiError = {
          message: data?.message || data?.error?.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          errors: data?.errors,
          error: data?.error,
        };
        throw error;
      }

      // Handle SuccessResponseDto format - extract data field if present
      let responseData = data;
      if (data?.success === true && data?.data !== undefined) {
        responseData = data.data;
      }

      return {
        data: responseData,
        status: response.status,
        message: data?.message,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout. Please try again.',
          status: 408,
        } as ApiError;
      }

      if (error.status) {
        throw error as ApiError;
      }

      throw {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    let requestBody: any;
    
    if (isFormData) {
      requestBody = body;
    } else if (body === '') {
      requestBody = '';
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }
    
    const customHeaders: HeadersInit = {};
    if (body === '') {
      customHeaders['Accept'] = 'application/json';
    }
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: requestBody,
      headers: body === '' ? { ...customHeaders, ...options?.headers } : options?.headers,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    let requestBody: any;

    if (isFormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: requestBody,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    let requestBody: any;

    if (isFormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: requestBody,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

