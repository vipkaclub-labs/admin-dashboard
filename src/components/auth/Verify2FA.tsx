import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// We need to access setToken from AuthContext, but it's not exposed
// So we'll update token via localStorage and let fetchUserInfo handle it

interface Verify2FAProps {
  onComplete: () => void;
  onCancel: () => void;
}

type TwoFAMethod = 'TOTP' | 'EMAIL';

const Verify2FA = ({ onComplete, onCancel }: Verify2FAProps) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>('TOTP');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto send email OTP if method is EMAIL
  useEffect(() => {
    if (selectedMethod === 'EMAIL') {
      handleResendCode();
    }
  }, [selectedMethod]);

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      return;
    }

    // Get userId from localStorage (saved during login) or user context
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : user;
    let userId = currentUser?.id;

    // If userId not found in user object, try to get from token payload or login response
    if (!userId) {
      // Try to decode token to get userId (fallback)
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.uid || payload.userId || payload.sub;
        } catch (e) {
          // Ignore decode errors
        }
      }
    }

    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setLoading(true);
    setVerifyError(null);
    try {
      await authService.setup2FAEmail(userId);
      setResendCooldown(60);
      toast.success('Mã xác thực mới đã được gửi đến email của bạn.');
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi lại mã xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setVerifyError('Vui lòng nhập mã xác thực');
      return;
    }

    if (verificationCode.length !== 6) {
      setVerifyError('Mã xác thực phải có 6 chữ số');
      return;
    }

    // Get userId from localStorage (saved during login) or user context
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : user;
    let userId = currentUser?.id;

    // If userId not found in user object, try to get from token payload or login response
    if (!userId) {
      // Try to decode token to get userId (fallback)
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.uid || payload.userId || payload.sub;
        } catch (e) {
          // Ignore decode errors
        }
      }
    }

    if (!userId) {
      setVerifyError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    try {
      const response = await authService.verify2FA({
        userId,
        code: verificationCode,
        type: selectedMethod,
      });
      
      // Check if verification was successful
      if (response && response.success !== false && !response.message?.toLowerCase().includes('incorrect') && !response.message?.toLowerCase().includes('expired')) {
        // After successful 2FA verification, API may return accessToken or token was saved during initial login
        const newToken = response.accessToken || response.token || localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!newToken) {
          setVerifyError('Không nhận được access token từ server. Vui lòng thử lại.');
          return;
        }
        
        // Save token after successful verification
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('token', newToken);
        
        // Save refresh token if provided
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
        // Clear pending login email
        localStorage.removeItem('pendingLoginEmail');
        
        // Note: Token is saved to localStorage, fetchUserInfo in handle2FAComplete
        // will read it and update AuthContext state
        
        toast.success('Xác thực 2FA thành công!');
        onComplete();
      } else {
        setVerifyError(response?.message || 'The code you entered is incorrect or expired. Please try again.');
      }
    } catch (error: any) {
      setVerifyError(error.message || 'The code you entered is incorrect or expired. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center" style={{ color: '#1e3a8a' }}>
            VERIFY TWO-FACTOR AUTHENTICATION
          </h2>
          <p className="text-sm text-gray-700 text-center mt-2">
            Please enter the 6-digit code from your authenticator app or email to complete login.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose verification method:
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors bg-white hover:bg-gray-50"
                style={{ borderColor: selectedMethod === 'TOTP' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="verifyMethod"
                  value="TOTP"
                  checked={selectedMethod === 'TOTP'}
                  onChange={() => {
                    setSelectedMethod('TOTP');
                    setVerificationCode('');
                    setVerifyError(null);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900 font-medium">Authenticator App</span>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors bg-white hover:bg-gray-50"
                style={{ borderColor: selectedMethod === 'EMAIL' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="verifyMethod"
                  value="EMAIL"
                  checked={selectedMethod === 'EMAIL'}
                  onChange={() => {
                    setSelectedMethod('EMAIL');
                    setVerificationCode('');
                    setVerifyError(null);
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900 font-medium">Email OTP</span>
              </label>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
              ENTER THE 6-DIGIT CODE
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setVerifyError(null);
                }}
                placeholder="000000"
                maxLength={6}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !verificationCode.trim() || verificationCode.length !== 6}
                className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                style={{ backgroundColor: '#60A5FA' }}
                onMouseEnter={(e) => {
                  if (!verifying && verificationCode.trim() && verificationCode.length === 6) {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!verifying && verificationCode.trim() && verificationCode.length === 6) {
                    e.currentTarget.style.backgroundColor = '#60A5FA';
                  }
                }}
              >
                {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
                VERIFY
              </button>
            </div>
            {verifyError && (
              <p className="text-sm text-red-600">{verifyError}</p>
            )}
          </div>

          {/* Resend Code Section (for Email OTP) */}
          {selectedMethod === 'EMAIL' && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {resendCooldown > 0 ? (
                  <span>
                    Didn't receive the code? Request a new one in 60 seconds ({resendCooldown} seconds left)
                  </span>
                ) : (
                  <span>Didn't receive the code?</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading || resendCooldown > 0}
                className="w-full px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                style={{ backgroundColor: '#60A5FA' }}
                onMouseEnter={(e) => {
                  if (!loading && resendCooldown === 0) {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && resendCooldown === 0) {
                    e.currentTarget.style.backgroundColor = '#60A5FA';
                  }
                }}
              >
                RESEND CODE
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || verifying}
            className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;

