import { useState, useEffect } from 'react';
import { Bell, Moon, Globe, Save, Eye, Shield, Loader2, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { authService } from '../../../services/authService';
import { userService } from '../../../services/userService';

const UserSettings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [disabling2FA, setDisabling2FA] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [active2FAMethod, setActive2FAMethod] = useState<'TOTP' | 'EMAIL' | null>(null);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    appearance: {
      theme: 'light',
      language: language,
    },
    privacy: {
      showEmail: true,
      showPhone: false,
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          appearance: {
            ...prev.appearance,
            ...parsed.appearance,
            language: language, // Always use current language from context
          },
        }));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Check 2FA status from user context (no API call needed)
  useEffect(() => {
    // Get 2FA configs from user context if available
    const twoFaConfigs = (user as any)?.twoFactorConfigs || [];
    const hasActive2FA = twoFaConfigs.some((config: any) => config.isActive === true);
    setTwoFaEnabled(hasActive2FA);

    // Find active 2FA method
    const activeConfig = twoFaConfigs.find((config: any) => config.isActive === true);
    if (activeConfig && activeConfig.type) {
      setActive2FAMethod(activeConfig.type as 'TOTP' | 'EMAIL');
    } else {
      setActive2FAMethod(null);
    }
  }, [user]);

  const handleDisable2FA = async () => {
    if (!user?.id) {
      toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    // Get latest 2FA status to find active method
    let disableType: 'TOTP' | 'EMAIL' = 'TOTP';
    try {
      const userData = await authService.getMe();
      const twoFaConfigs = userData.data?.twoFactorConfigs || userData.twoFactorConfigs || [];
      const activeConfig = twoFaConfigs.find((config: any) => config.isActive === true);

      if (activeConfig && activeConfig.type) {
        disableType = activeConfig.type as 'TOTP' | 'EMAIL';
      } else if (!active2FAMethod) {
        toast.error('Không tìm thấy phương thức 2FA đang kích hoạt.');
        return;
      } else {
        disableType = active2FAMethod;
      }
    } catch (error: any) {
      console.error('Failed to get 2FA methods:', error);
      // Fallback to stored active method
      if (active2FAMethod) {
        disableType = active2FAMethod;
      } else {
        toast.error('Không thể lấy thông tin 2FA. Vui lòng thử lại.');
        return;
      }
    }

    setDisabling2FA(true);
    try {
      await authService.disable2FA({
        userId: user.id,
        type: disableType,
      });
      setTwoFaEnabled(false);
      setActive2FAMethod(null);
      setShowDisable2FAModal(false);
      toast.success('Đã tắt 2FA thành công.');

      // Refresh 2FA status
      const userData = await authService.getMe();
      const twoFaConfigs = userData.data?.twoFactorConfigs || userData.twoFactorConfigs || [];
      const hasActive2FA = twoFaConfigs.some((config: any) => config.isActive === true);
      setTwoFaEnabled(hasActive2FA);
      const activeConfig = twoFaConfigs.find((config: any) => config.isActive === true);
      if (activeConfig && activeConfig.type) {
        setActive2FAMethod(activeConfig.type as 'TOTP' | 'EMAIL');
      } else {
        setActive2FAMethod(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Tắt 2FA thất bại. Vui lòng thử lại.');
    } finally {
      setDisabling2FA(false);
    }
  };

  const handleNotificationChange = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications],
      },
    }));
  };

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        language: lang,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));

      if (user?.id) {
        try {
          await userService.updateUser(user.id, {
            name: user.name || user.displayName,
          });
        } catch (apiErr) {
          console.warn('Could not sync user profile to backend:', apiErr);
        }
      }

      toast.success(t('common.save') + ' ' + t('common.success'));
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('common.settings')}</h1>
        <p className="text-gray-500 text-sm">{t('pages.userSettings.description')}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">{t('pages.userSettings.notifications')}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('pages.userSettings.emailNotifications')}</p>
                <p className="text-sm text-gray-500">{t('pages.userSettings.emailNotificationsDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('pages.userSettings.pushNotifications')}</p>
                <p className="text-sm text-gray-500">{t('pages.userSettings.pushNotificationsDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('pages.userSettings.smsNotifications')}</p>
                <p className="text-sm text-gray-500">{t('pages.userSettings.smsNotificationsDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">{t('pages.userSettings.appearance')}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('pages.userSettings.language')}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={settings.appearance.language}
                  onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'vi')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('pages.userSettings.theme')}</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`p-4 border-2 rounded-lg text-center ${settings.appearance.theme === 'light'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, theme: 'light' } }))}
                >
                  <div className="w-full h-12 bg-white border border-gray-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">{t('pages.userSettings.light')}</p>
                </button>
                <button
                  className={`p-4 border-2 rounded-lg text-center ${settings.appearance.theme === 'dark'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, theme: 'dark' } }))}
                >
                  <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                  <p className="text-sm font-medium">{t('pages.userSettings.dark')}</p>
                </button>
                <button
                  className={`p-4 border-2 rounded-lg text-center ${settings.appearance.theme === 'auto'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSettings((prev) => ({ ...prev, appearance: { ...prev.appearance, theme: 'auto' } }))}
                >
                  <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">{t('pages.userSettings.auto')}</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">{t('pages.userSettings.privacy')}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('pages.userSettings.showEmail')}</p>
                <p className="text-sm text-gray-500">{t('pages.userSettings.showEmailDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, showEmail: !prev.privacy.showEmail },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{t('pages.userSettings.showPhone')}</p>
                <p className="text-sm text-gray-500">{t('pages.userSettings.showPhoneDesc')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showPhone}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, showPhone: !prev.privacy.showPhone },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings - 2FA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">2FA Status</p>
                <p className="text-sm text-gray-500">
                  {twoFaEnabled
                    ? 'Two-factor authentication is currently enabled for your account.'
                    : 'Two-factor authentication is currently disabled.'}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${twoFaEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {twoFaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {twoFaEnabled && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDisable2FAModal(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Disable 2FA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Disable 2FA Confirmation Modal */}
        {showDisable2FAModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Modal Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <button
                  onClick={() => setShowDisable2FAModal(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={disabling2FA}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">2FA Status</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Two-factor authentication is currently enabled for your account.
                  </p>
                  <div className="flex items-center justify-center mb-6">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      Enabled
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> Disabling 2FA will reduce the security of your account.
                    You will no longer be required to provide a second authentication factor when logging in.
                  </p>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to disable two-factor authentication?
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDisable2FAModal(false)}
                  disabled={disabling2FA}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable2FA}
                  disabled={disabling2FA}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  {disabling2FA && <Loader2 className="w-4 h-4 animate-spin" />}
                  {disabling2FA ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;





