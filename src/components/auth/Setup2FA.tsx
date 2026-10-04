import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import TwoFAModal from './TwoFAModal';

interface Setup2FAProps {
  onComplete: () => void;
  onCancel: () => void;
}

type TwoFAMethod = 'TOTP' | 'EMAIL';

const Setup2FA = ({ onComplete, onCancel }: Setup2FAProps) => {
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>('TOTP');
  const [showAuthenticatorSetup, setShowAuthenticatorSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);


  const handleSetup = async () => {
    console.log('handleSetup called, selectedMethod:', selectedMethod);
    setLoading(true);
    setVerifyError(null);
    try {
      if (selectedMethod === 'TOTP') {
        // Get userId from localStorage or user context
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id;

        if (!userId) {
          toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        // Call setup API to get QR code immediately
        try {
          await authService.setup2FATOTP(userId);
          // Show TwoFAModal which will display the QR code
          setShowAuthenticatorSetup(true);
        } catch (error: any) {
          toast.error(error.message || 'Không thể thiết lập Authenticator App. Vui lòng thử lại.');
        }
      } else {
        // Email OTP flow
        // Get userId from localStorage or user context
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id;

        if (!userId) {
          toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        console.log('Setting up Email OTP with userId:', userId);
        try {
          await authService.setup2FAEmail(userId);
          console.log('Email OTP setup successful, showing verification modal');
          setShowEmailVerification(true);
          // Set resend cooldown to 60 seconds
          setResendCooldown(60);
          toast.success('Mã xác thực đã được gửi đến email của bạn.');
        } catch (error: any) {
          console.error('Email OTP setup error:', error);
          toast.error(error.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
          // Still show the verification modal even if API fails (user can resend)
          console.log('Showing verification modal despite error');
          setShowEmailVerification(true);
          setResendCooldown(60);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể thiết lập 2FA. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      return;
    }

    // Get userId from localStorage or user context
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

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

    // Get userId from localStorage or user context
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

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

      if (response && response.success !== false) {
        // Show success message modal instead of recovery codes modal
        setSetupComplete(true);
      } else {
        setVerifyError(response?.message || 'The code you entered is incorrect or expired. Please try again.');
      }
    } catch (error: any) {
      setVerifyError(error.message || 'The code you entered is incorrect or expired. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  // Auto redirect to dashboard after setup complete
  useEffect(() => {
    if (setupComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500); // Wait 1.5 seconds before redirecting
      return () => clearTimeout(timer);
    }
  }, [setupComplete, onComplete]);

  if (setupComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thiết lập thành công!</h2>
            <p className="text-gray-600">2FA đã được kích hoạt cho tài khoản của bạn.</p>
            <p className="text-sm text-gray-500 mt-2">Đang chuyển đến Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Email OTP Verification View
  if (showEmailVerification && selectedMethod === 'EMAIL') {
    return (
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-500/20 max-w-lg w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-amber-50/50 to-white">
            <div className="w-12 h-12 mx-auto mb-2 p-1 rounded-xl bg-stone-900 border border-amber-400/40 shadow flex items-center justify-center">
              <img src="/vipka-logo.svg" alt="VIPKA Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-black text-amber-900 text-center tracking-wide">
              VERIFY YOUR EMAIL
            </h2>
            <p className="text-sm text-gray-600 text-center mt-1">
              We've sent a verification code to your email. Enter the code below to activate two-factor authentication.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Verification Code Input - Step 1 & 2 */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="flex-1">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-lg tracking-widest font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleVerify}
                        disabled={verifying || !verificationCode.trim() || verificationCode.length !== 6}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                      >
                        {verifying && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                        VERIFY
                      </button>
                    </div>
                  </div>
                  {verifyError && (
                    <p className="text-sm text-red-600 mt-2">{verifyError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-sm text-gray-600">
              Make sure to check your spam or promotions folder
            </p>

            {/* Resend Code Section - Step 4 & 3 */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-700 mb-3">
                    {resendCooldown > 0 ? (
                      <span>
                        Didn't receive the code? Request a new one in 60 seconds ({resendCooldown} seconds left)
                      </span>
                    ) : (
                      <span>Didn't receive the code?</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading || resendCooldown > 0}
                      className="flex-1 px-4 py-2 border-2 border-amber-500 text-amber-700 bg-white rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                      RESEND CODE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Step 5 */}
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">5</span>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading || verifying}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticator App Setup View
  if (showAuthenticatorSetup && selectedMethod === 'TOTP') {
    return <TwoFAModal onComplete={onComplete} onCancel={onCancel} />;
  }

  // Method Selection View
  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-500/20 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-b from-amber-50/50 to-white border-b border-gray-100">
          <div className="w-12 h-12 mx-auto mb-2 p-1 rounded-xl bg-stone-900 border border-amber-400/40 shadow flex items-center justify-center">
            <img src="/vipka-logo.svg" alt="VIPKA Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-amber-900 text-center tracking-wide">
            SET UP TWO-FACTOR AUTHENTICATION
          </h2>
          <p className="text-sm text-gray-600 text-center mt-1">
            To keep your account secure, 2FA is required. Choose your preferred method below.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Method Selection - Step 1 */}
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div className="flex-1 space-y-3">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all bg-white hover:bg-amber-50/40"
                style={{ borderColor: selectedMethod === 'TOTP' ? '#d97706' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="2faMethod"
                  value="TOTP"
                  checked={selectedMethod === 'TOTP'}
                  onChange={() => {
                    setSelectedMethod('TOTP');
                    setShowAuthenticatorSetup(false);
                    setShowEmailVerification(false);
                    setVerifyError(null);
                  }}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-gray-900 font-semibold">Authenticator App</span>
              </label>

              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all bg-white hover:bg-amber-50/40"
                style={{ borderColor: selectedMethod === 'EMAIL' ? '#d97706' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="2faMethod"
                  value="EMAIL"
                  checked={selectedMethod === 'EMAIL'}
                  onChange={() => {
                    setSelectedMethod('EMAIL');
                    setShowAuthenticatorSetup(false);
                    setShowEmailVerification(false);
                    setVerifyError(null);
                  }}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-gray-900 font-semibold">Email OTP</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-3">
          {/* Primary Button - Step 2 */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <button
              type="button"
              onClick={handleSetup}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              {selectedMethod === 'TOTP' ? 'SET UP WITH AUTHENTICATOR APP' : 'SET UP WITH EMAIL OTP'}
            </button>
          </div>

          {/* Cancel Button - Step 3 */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;

