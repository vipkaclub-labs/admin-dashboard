import { useState, useEffect } from 'react';
import { Loader2, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

interface TwoFAModalProps {
  onComplete: () => void;
  onCancel: () => void;
}

const TwoFAModal = ({ onComplete, onCancel }: TwoFAModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [regenerateCooldown, setRegenerateCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Timer for regenerate cooldown
  useEffect(() => {
    if (regenerateCooldown > 0) {
      const timer = setTimeout(() => {
        setRegenerateCooldown(regenerateCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [regenerateCooldown]);

  // Load QR code on mount
  useEffect(() => {
    if (user?.id) {
      const loadQRCode = async () => {
        const userId = user.id;
        if (!userId) {
          setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          return;
        }

        setLoading(true);
        setErrorMessage(null);
        setVerifyError(null);
        try {
          const response = await authService.setup2FATOTP(userId);
          console.log('Setup 2FA Response:', response);
          
          // Handle response - check for qrCodeUrl and secret in various possible locations
          const qrCodeValue = response.qrCodeUrl || response.qrCode || response.data?.qrCodeUrl || response.data?.qrCode;
          const secretValue = response.secret || response.secretKey || response.data?.secret || response.data?.secretKey || response.data?.config?.secret;
          
          if (qrCodeValue) {
            setQrCode(qrCodeValue);
          }
          if (secretValue) {
            setSecret(secretValue);
          }
          
          // If we have secret but no qrCode, we can generate QR code from secret
          if (!qrCodeValue && secretValue) {
            console.log('No QR code URL, will generate from secret');
          }
        } catch (error: any) {
          setErrorMessage(error.message || 'Không thể thiết lập Authenticator App. Vui lòng thử lại.');
          toast.error(error.message || 'Không thể thiết lập Authenticator App. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      };
      loadQRCode();
    }
  }, [user?.id]);

  const handleRegenerate = async () => {
    if (regenerateCooldown > 0) {
      return;
    }

    if (!user?.id) {
      setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    setVerifyError(null);
    // Clear verification code when regenerating
    setVerificationCode('');
    try {
      // Step 1: Call regenerate-secret API
      await authService.regenerate2FATOTP(user.id);
      
      // Step 2: Call setup API to get new QR code
      const response = await authService.setup2FATOTP(user.id);
      console.log('Setup 2FA Response after regenerate:', response);
      
      // Handle response - check for qrCodeUrl and secret in various possible locations
      const qrCodeValue = response.qrCodeUrl || response.qrCode || response.data?.qrCodeUrl || response.data?.qrCode;
      const secretValue = response.secret || response.secretKey || response.data?.secret || response.data?.secretKey || response.data?.config?.secret;
      
      if (qrCodeValue) {
        setQrCode(qrCodeValue);
      }
      if (secretValue) {
        setSecret(secretValue);
      }
      toast.success('QR code đã được tạo lại.');
    } catch (error: any) {
      const errorMsg = error.message || 'Không thể tạo lại QR code. Vui lòng thử lại.';
      setErrorMessage(errorMsg);
      // If error says "too many requests", set cooldown
      if (errorMsg.toLowerCase().includes('too many') || errorMsg.toLowerCase().includes('wait')) {
        setRegenerateCooldown(300); // 5 minutes
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast.success('Đã sao chép mã key!');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

    if (!user?.id) {
      setVerifyError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    try {
      const response = await authService.verify2FA({
        userId: user.id,
        code: verificationCode,
        type: 'TOTP',
      });
      
      if (response && response.success !== false) {
        // 2FA setup successful - complete the flow
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
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-500/20 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="w-12 h-12 mx-auto mb-2 p-1 rounded-xl bg-stone-900 border border-amber-400/40 shadow flex items-center justify-center">
            <img src="/vipka-logo.svg" alt="VIPKA Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-amber-900 text-center tracking-wide">
            SET UP YOUR AUTHENTICATOR APP
          </h2>
          <p className="text-sm text-gray-600 text-center mt-1">
            Scan the QR code with your Authenticator app, then enter the 6-digit code it generates
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Loading State */}
          {loading && !qrCode && !secret && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <span className="ml-3 text-gray-600">Đang tải QR code...</span>
            </div>
          )}

          {/* QR Code - Step 1 */}
          {(qrCode || secret) && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="p-4 bg-white border-2 border-amber-200/80 rounded-xl shadow-sm">
                  {qrCode && (qrCode.startsWith('data:') || qrCode.startsWith('http')) ? (
                    // If API returns QR code URL/data URL, use it
                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                  ) : secret ? (
                    // Generate QR code from secret (fallback)
                    <QRCode
                      value={`otpauth://totp/${user?.email || user?.username || 'Account'}:${user?.email || user?.username || 'Account'}?secret=${secret}&issuer=${encodeURIComponent('VIPKA Club Admin')}`}
                      size={256}
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center text-gray-400">
                      Đang tải QR code...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manual Key - Step 2 */}
          {secret && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-700">
                  If you cannot scan the QR code, enter the key manually:
                </p>
                <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
                  <code className="flex-1 text-sm font-mono text-gray-900 break-all">{secret}</code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-2 hover:bg-amber-100/60 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-amber-700" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Show message if no secret available */}
          {!secret && !loading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 italic">
                  Secret key không có sẵn. Vui lòng quét QR code để thiết lập.
                </p>
              </div>
            </div>
          )}

          {/* Regenerate Button - Step 3 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div className="flex-1 space-y-2">
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={loading || regenerateCooldown > 0}
                className="w-full px-4 py-2 border-2 border-amber-500 text-amber-700 bg-white rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                REGENERATE
              </button>
              {regenerateCooldown > 0 && (
                <div className="space-y-2">
                  <p className="text-center text-sm text-gray-600">
                    {formatTimer(regenerateCooldown)}
                  </p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      You've requested too many times. Please wait {Math.ceil(regenerateCooldown / 60)} minutes before trying again
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message for Regenerate */}
          {errorMessage && regenerateCooldown === 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Verification Code Input - Step 4 & 5 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mt-1">
              <span className="text-white text-xs font-bold">4</span>
            </div>
            <div className="flex-1 space-y-2">
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-lg tracking-widest font-mono"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">5</span>
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
                <p className="text-sm text-red-600">{verifyError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Step 6 */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">6</span>
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
};

export default TwoFAModal;

