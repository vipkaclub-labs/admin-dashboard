import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Setup2FA from './Setup2FA';

const Login = () => {
  const { isAuthenticated, mustSetup2fa, setMustSetup2fa, fetchUserInfo, login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin@vipka.club');
  const [password, setPassword] = useState('be12345678@Ab');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !mustSetup2fa) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, mustSetup2fa, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Vui lòng nhập email/tên đăng nhập và mật khẩu');
      setLoading(false);
      return;
    }

    try {
      // Call API login through AuthContext
      const result = await login({
        email: usernameOrEmail.trim(),
        password: password.trim(),
      });

      // If 2FA is required, Setup2FA component will be shown automatically
      if (result.requires2FA) {
        // Don't navigate, Setup2FA component will handle the flow
        return;
      }

      // Login successful, fetch user info to get complete profile
      await fetchUserInfo();

      toast.success('Đăng nhập thành công!');
      router.replace('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handle2FAComplete = async () => {
    // After 2FA setup is complete (including recovery codes saved), fetch user info and complete the login process
    try {
      // Token should already be in localStorage from Setup2FA/Verify2FA
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy access token. Vui lòng đăng nhập lại.');
        return;
      }

      // Fetch user info using the token
      await fetchUserInfo();
      setMustSetup2fa(false);

      // Navigate to dashboard - success message is already shown in RecoveryCodesModal
      router.replace('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Không thể lấy thông tin người dùng. Vui lòng thử lại.');
    }
  };

  const handle2FACancel = () => {
    // Cancel 2FA setup - logout user
    setMustSetup2fa(false);
    // Clear token and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.info('Thiết lập 2FA đã bị hủy. Vui lòng đăng nhập lại.');
  };

  return (
    <>
      {mustSetup2fa && (
        <Setup2FA onComplete={handle2FAComplete} onCancel={handle2FACancel} />
      )}
      <div className="min-h-screen bg-[#0d0f12] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.25),rgba(0,0,0,0))] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-amber-500/20 overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-stone-900 to-stone-950 text-center border-b border-amber-500/20">
            <div className="w-20 h-20 mx-auto mb-3 p-1.5 rounded-2xl bg-stone-900 border border-amber-400/40 shadow-lg shadow-amber-500/10 flex items-center justify-center">
              <img
                src="/vipka-logo.svg"
                alt="VIPKA Club Logo"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <h1 className="text-2xl font-black tracking-wide bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              VIPKA CLUB
            </h1>
            <p className="text-xs font-semibold text-amber-200/80 tracking-widest uppercase mt-1">
              Admin Management Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.emailOrUsername')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={t('common.emailOrUsername')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                {t('common.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-stone-950 py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin text-stone-950" />}
              {loading ? t('common.loggingIn') : t('common.login')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

