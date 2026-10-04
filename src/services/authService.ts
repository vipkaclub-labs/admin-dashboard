import { apiClient, ApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  LoginDto,
  RegisterDto,
  AccountResponseDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SuccessResponseDto,
} from '../types/api';

export interface LoginRequest {
  emailOrUsername?: string;
  usernameOrEmail?: string; // For backward compatibility - will be mapped to emailOrUsername
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: string;
    refreshTokenExpiresAt?: string;
    user?: AccountResponseDto;
    userId?: string;
    username?: string;
    displayName?: string;
    role?: string;
    mustSetup2fa?: boolean;
    mustChangePassword?: boolean;
    [key: string]: any;
  };
  // Fallback for different API response formats (top-level fields)
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AccountResponseDto;
  userId?: string;
  username?: string;
  displayName?: string;
  role?: string;
  mustSetup2fa?: boolean;
  mustChangePassword?: boolean;
  [key: string]: any; // For any additional fields from API
}

export interface UserMeRole {
  id: string;
  name: string;
}

export interface TwoFactorConfig {
  id: string;
  type: 'TOTP' | 'EMAIL';
  isActive: boolean;
  email: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserMeData extends AccountResponseDto {
  // Additional fields that might be present
  providerId?: string | null;
  operatorId?: string | null;
  roles?: UserMeRole[];
  twoFactorConfigs?: TwoFactorConfig[];
  [key: string]: any; // For any additional fields from API
}

export interface UserMeResponse extends AccountResponseDto {
  success?: boolean;
  message?: string;
  data?: UserMeData;
  // Fallback for direct data response
  roles?: UserMeRole[];
  [key: string]: any; // For any additional fields from API
}

export interface Setup2FARequest {
  userId: string;
  type: 'TOTP' | 'EMAIL';
}

export interface Setup2FATOTPResponse {
  qrCode?: string;
  qrCodeUrl?: string;
  secret?: string;
  secretKey?: string;
  backupCodes?: string[];
  data?: {
    qrCode?: string;
    qrCodeUrl?: string;
    secret?: string;
    secretKey?: string;
    backupCodes?: string[];
    config?: {
      id?: string;
      userId?: string;
      type?: string;
      isActive?: boolean;
      secret?: string;
    };
  };
  [key: string]: any;
}

export interface Setup2FAEmailResponse {
  message?: string;
  [key: string]: any;
}

export interface Verify2FARequest {
  userId: string;
  code: string;
  type: 'TOTP' | 'EMAIL';
}

export interface Verify2FAResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface Disable2FARequest {
  userId: string;
  type: 'TOTP' | 'EMAIL';
}

export interface Disable2FAResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  oldPassword?: string; // For backward compatibility - will be mapped to currentPassword
  newPassword: string;
  confirmNewPassword?: string; // Optional - will default to newPassword if not provided
}

export interface ChangePasswordResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface ForgotPasswordRequest extends ForgotPasswordDto {}

export interface ResetPasswordRequest extends ResetPasswordDto {}

export interface RegisterRequest extends RegisterDto {}

export interface RecoveryCodesResponse {
  success?: boolean;
  message?: string;
  data?: {
    codes?: string[];
    recoveryCodes?: string;
  };
  codes?: string[];
  recoveryCodes?: string;
  [key: string]: any;
}

export interface UpdateProfileRequest {
  name?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  username?: string;
}

export interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  data?: AccountResponseDto;
  [key: string]: any;
}

export interface AuthService {
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  adminLogin: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<SuccessResponseDto>;
  getMe: () => Promise<UserMeResponse>;
  updateProfile: (data: UpdateProfileRequest) => Promise<UpdateProfileResponse>;
  logout: () => Promise<SuccessResponseDto>;
  refreshTokens: (refreshToken: string) => Promise<SuccessResponseDto<{ accessToken: string; refreshToken: string }>>;
  changePassword: (request: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<SuccessResponseDto>;
  resetPassword: (request: ResetPasswordRequest) => Promise<SuccessResponseDto>;
  setup2FATOTP: (userId: string) => Promise<Setup2FATOTPResponse>;
  regenerate2FATOTP: (userId: string) => Promise<Setup2FATOTPResponse>;
  setup2FAEmail: (userId: string) => Promise<Setup2FAEmailResponse>;
  verify2FA: (request: Verify2FARequest) => Promise<Verify2FAResponse>;
  disable2FA: (request: Disable2FARequest) => Promise<Disable2FAResponse>;
  getRecoveryCodes: () => Promise<RecoveryCodesResponse>;
}

class AuthServiceImpl implements AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Map usernameOrEmail to emailOrUsername for backward compatibility
      const emailOrUsername = credentials.emailOrUsername || credentials.usernameOrEmail;
      if (!emailOrUsername) {
        throw new Error('Email hoặc tên đăng nhập là bắt buộc');
      }
      
      const loginDto: LoginDto = {
        emailOrUsername,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
        twoFactorCode: credentials.twoFactorCode,
      };
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        loginDto
      );
      // The apiClient already extracts the data field from SuccessResponseDto
      // So response.data is the actual response data object
      const responseData = response.data || {};
      return {
        success: true,
        message: response.message,
        data: responseData,
        // Spread data fields to top level for backward compatibility with AuthContext
        ...responseData,
      } as LoginResponse;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      );
    }
  }

  async adminLogin(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Map usernameOrEmail to emailOrUsername for backward compatibility
      const emailOrUsername = credentials.emailOrUsername || credentials.usernameOrEmail;
      if (!emailOrUsername) {
        throw new Error('Email hoặc tên đăng nhập là bắt buộc');
      }
      
      const loginDto: LoginDto = {
        emailOrUsername,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
        twoFactorCode: credentials.twoFactorCode,
      };
      const response = await apiClient.post<any>(
        API_ENDPOINTS.ADMIN.LOGIN,
        loginDto
      );
      // The apiClient already extracts the data field from SuccessResponseDto
      // So response.data is the actual response data object
      const responseData = response.data || {};
      return {
        success: true,
        message: response.message,
        data: responseData,
        // Spread data fields to top level for backward compatibility with AuthContext
        ...responseData,
      } as LoginResponse;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đăng nhập admin thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      );
    }
  }

  async register(data: RegisterRequest): Promise<SuccessResponseDto> {
    try {
      const response = await apiClient.post<SuccessResponseDto>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
    }
  }

  async logout(): Promise<SuccessResponseDto> {
    try {
      // Call logout API endpoint to invalidate token on server
      // POST /auth/logout with empty body and Authorization header
      // Headers: Accept: application/json, Authorization: Bearer <token>
      // Body: empty string ''
      console.log('Calling logout API:', API_ENDPOINTS.AUTH.LOGOUT);
      const response = await apiClient.post<SuccessResponseDto>(
        API_ENDPOINTS.AUTH.LOGOUT,
        '' // Empty body as per API specification
      );
      
      console.log('Logout API response:', response);
      
      // API returns SuccessResponseDto, apiClient extracts the data field
      // Return success response
      return {
        success: true,
        data: response.data || {},
        message: response.message || 'Đăng xuất thành công',
      };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Logout API error:', apiError);
      // Don't throw error - let the caller handle clearing local storage
      // This allows logout to complete even if API call fails
      throw new Error(
        apiError.message || 'Đăng xuất thất bại. Vui lòng thử lại.'
      );
    }
  }

  async refreshTokens(refreshToken: string): Promise<SuccessResponseDto<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<SuccessResponseDto<{ accessToken: string; refreshToken: string }>>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Làm mới token thất bại. Vui lòng đăng nhập lại.'
      );
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<SuccessResponseDto> {
    try {
      const response = await apiClient.post<SuccessResponseDto>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        request
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.'
      );
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<SuccessResponseDto> {
    try {
      const response = await apiClient.post<SuccessResponseDto>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        request
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getMe(): Promise<UserMeResponse> {
    try {
      // GET /auth/me with Authorization header
      // Headers: Accept: application/json, Authorization: Bearer <token>
      console.log('Fetching user profile from:', API_ENDPOINTS.AUTH.ME);
      const response = await apiClient.get<UserMeResponse | AccountResponseDto>(
        API_ENDPOINTS.AUTH.ME
      );
      
      console.log('API Response from /auth/me:', response);
      
      // API may return SuccessResponseDto format: { success: true, data: AccountResponseDto }
      // or direct AccountResponseDto format
      // apiClient already extracts the data field if it's SuccessResponseDto
      const accountData = response.data as AccountResponseDto | UserMeData;
      
      console.log('Processed account data:', accountData);
      
      // Check if response already has UserMeResponse structure
      if ('roles' in accountData || 'twoFactorConfigs' in accountData || 'providerId' in accountData) {
        const result = {
          ...accountData,
          data: accountData as UserMeData,
          success: true,
        } as UserMeResponse;
        console.log('Returning UserMeResponse with roles/configs:', result);
        return result;
      }
      
      // Return with data fields spread to top level for backward compatibility
      const result = {
        ...accountData,
        data: accountData as UserMeData,
        success: true,
      } as UserMeResponse;
      console.log('Returning UserMeResponse (standard):', result);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error fetching user profile:', apiError);
      throw new Error(
        apiError.message || 'Không thể lấy thông tin người dùng. Vui lòng thử lại.'
      );
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      // First get current user info to get the user ID
      const currentUser = await this.getMe();
      const userId = currentUser.data?.id || currentUser.id;
      
      if (!userId) {
        throw new Error('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      }

      console.log('Updating profile for user:', userId, 'with data:', data);
      
      // Use userService to update user profile
      // Import userService at the top if not already imported
      const { userService } = await import('./userService');
      
      // Map displayName to name if needed
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.displayName) updateData.name = data.displayName; // API might use 'name' field
      if (data.email) updateData.email = data.email;
      if (data.username) updateData.username = data.username;
      // Note: phone might not be in UpdateUserRequestDto, but we'll try
      if (data.phone !== undefined) (updateData as any).phone = data.phone;

      const response = await userService.updateUser(userId, updateData);
      
      console.log('Profile update response:', response);
      
      return {
        success: true,
        message: 'Cập nhật hồ sơ thành công',
        data: response as any,
      };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error updating profile:', apiError);
      throw new Error(
        apiError.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.'
      );
    }
  }

  async setup2FATOTP(userId: string): Promise<Setup2FATOTPResponse> {
    try {
      const response = await apiClient.post<Setup2FATOTPResponse>(
        API_ENDPOINTS.AUTH.SETUP_2FA,
        {
          userId,
          type: 'TOTP',
        }
      );
      // Handle both direct response and nested data structure
      const responseData = (response.data && typeof response.data === 'object') ? response.data : {};
      return {
        ...responseData,
        qrCode: responseData.qrCode || responseData.data?.qrCode,
        qrCodeUrl: responseData.qrCodeUrl || responseData.data?.qrCodeUrl,
        secret: responseData.secret || responseData.secretKey || responseData.data?.secret || responseData.data?.secretKey || responseData.data?.config?.secret,
        backupCodes: responseData.backupCodes || responseData.data?.backupCodes,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể thiết lập Authenticator App. Vui lòng thử lại.'
      );
    }
  }

  async regenerate2FATOTP(userId: string): Promise<Setup2FATOTPResponse> {
    try {
      const response = await apiClient.post<Setup2FATOTPResponse>(
        API_ENDPOINTS.AUTH.REGENERATE_2FA,
        {
          userId,
          type: 'TOTP',
        }
      );
      // Handle both direct response and nested data structure
      const responseData = (response.data && typeof response.data === 'object') ? response.data : {};
      console.log('Raw Regenerate API Response:', responseData);
      
      // Extract qrCodeUrl and secret from various possible response structures
      const result = {
        ...responseData,
        qrCode: responseData?.qrCode || responseData?.data?.qrCode || responseData?.qrCodeUrl || responseData?.qr_code,
        qrCodeUrl: responseData?.qrCodeUrl || responseData?.qrCode || responseData?.data?.qrCodeUrl || responseData?.data?.qrCode,
        secret: responseData?.secret || responseData?.secretKey || responseData?.data?.secret || responseData?.data?.secretKey || responseData?.data?.config?.secret || responseData?.secret_key,
        backupCodes: responseData?.backupCodes || responseData?.data?.backupCodes || responseData?.backup_codes,
      };
      
      console.log('Processed Regenerate Response:', result);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể tạo lại QR code. Vui lòng thử lại.'
      );
    }
  }

  async setup2FAEmail(userId: string): Promise<Setup2FAEmailResponse> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.SETUP_2FA,
        {
          userId,
          type: 'EMAIL',
        }
      );
      const responseData = (response.data && typeof response.data === 'object') ? response.data : {};
      return {
        success: true,
        message: response.message,
        ...responseData,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Không thể thiết lập Email OTP. Vui lòng thử lại.'
      );
    }
  }

  async verify2FA(request: Verify2FARequest): Promise<Verify2FAResponse> {
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.VERIFY_2FA,
        request
      );
      const responseData = (response.data && typeof response.data === 'object') ? response.data : {};
      return {
        success: true,
        message: response.message || 'Xác thực 2FA thành công',
        ...responseData,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Xác thực 2FA thất bại. Vui lòng thử lại.'
      );
    }
  }

  async disable2FA(request: Disable2FARequest): Promise<Disable2FAResponse> {
    try {
      const endpoint = `${API_ENDPOINTS.AUTH.DISABLE_2FA}?userId=${encodeURIComponent(request.userId)}&type=${request.type}`;
      const response = await apiClient.delete<any>(endpoint);
      const responseData = (response.data && typeof response.data === 'object') ? response.data : {};
      return {
        success: true,
        message: response.message || 'Tắt 2FA thành công',
        ...responseData,
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Tắt 2FA thất bại. Vui lòng thử lại.'
      );
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      // Map oldPassword to currentPassword for backward compatibility
      const currentPassword = request.currentPassword || request.oldPassword;
      if (!currentPassword) {
        throw new Error('Mật khẩu hiện tại là bắt buộc');
      }
      
      const changePasswordDto: ChangePasswordDto = {
        currentPassword,
        newPassword: request.newPassword,
        confirmNewPassword: request.confirmNewPassword || request.newPassword, // Use newPassword as confirm if not provided
      };
      const response = await apiClient.post<SuccessResponseDto>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        changePasswordDto
      );
      // API returns SuccessResponseDto, apiClient extracts the data field
      // response.data is the extracted data (which should be SuccessResponseDto structure or empty object)
      // But since the API endpoint returns SuccessResponseDto with empty data, we construct response
      return {
        success: true,
        message: response.message || 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
      );
    }
  }

  async getRecoveryCodes(): Promise<RecoveryCodesResponse> {
    try {
      const response = await apiClient.get<RecoveryCodesResponse>(
        API_ENDPOINTS.AUTH.RECOVERY_CODES
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.message || 'Lấy recovery codes thất bại. Vui lòng thử lại.'
      );
    }
  }
}

export const authService: AuthService = new AuthServiceImpl();

