import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Maximize2, Mail, Bell, Power, X, Globe, List, User, Settings, HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getSupportedLanguages, getLanguageName } from '../utils/translations';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // Close profile menu before logout
    setIsProfileMenuOpen(false);
    setIsLoggingOut(true);

    try {
      // Call logout function from AuthContext to clear localStorage
      await logout();

      // Show success message
      toast.success(t('common.logoutSuccess') || 'Đăng xuất thành công!');

      // Small delay to show success message before redirect
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect to login page
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still redirect to login page even if there's an error
      router.replace('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    const displayName = user?.displayName || user?.name || user?.username || '';
    if (displayName) {
      const parts = displayName.trim().split(' ');
      if (parts.length >= 2) {
        // Take first letter of first word and first letter of last word
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      // If single word, take first 2 characters
      return displayName.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    return user?.displayName || user?.name || user?.email || 'User';
  };

  const getHeaderTitle = () => {
    return t('header.adminPortal') || 'Admin Portal';
  };

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
    const messages: Record<string, string> = {
      en: 'Language changed to English',
      vi: 'Đã chuyển sang Tiếng Việt',
    };
    toast.success(messages[lang] || 'Language changed');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-200 shadow-sm bg-white flex items-center justify-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVN7Nb-a5GICVEgGOvVnh0FvL-b74WfoE8Dg&s"
              alt="KaKa Club Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-purple-700 leading-tight">
              KaKa Club
            </span>
            <span className="text-xs font-medium text-gray-500">
              {getHeaderTitle()}
            </span>
          </div>
        </div>

        {/* Search + Sidebar toggle */}
        <div className="flex items-center gap-2 ml-4 flex-1">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Toggle sidebar"
          >
            <List className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 flex-1 min-w-[220px]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-gradient-to-br from-purple-400 to-purple-500">
              {getUserInitials()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{getDisplayName()}</span>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-purple-400 to-purple-500">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push('/dashboard/profile');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t('header.myProfile')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push('/dashboard/user-settings');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t('common.settings')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push('/dashboard/help-support');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t('header.helpSupport')}</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                        <span className="font-medium">{t('common.loggingOut') || 'Đang đăng xuất...'}</span>
                      </>
                    ) : (
                      <>
                        <Power className="w-5 h-5 text-red-600" />
                        <span className="font-medium">{t('common.logout')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-2 hover:bg-gray-100 rounded-lg relative"
          title={t('common.fullscreen')}
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            title={t('common.messages')}
          >
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>

          {/* Messages Dropdown */}
          {isMessagesOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMessagesOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{t('common.messages')}</h3>
                  <button
                    onClick={() => setIsMessagesOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample Messages */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold text-sm">U</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">User Name</p>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">New message about your recent activity...</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">A</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Admin</p>
                          <span className="text-xs text-gray-500">5h ago</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">System notification regarding your account...</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold text-sm">S</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Support</p>
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">Response to your support ticket...</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                    {t('common.viewAll')} {t('common.messages')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            title={t('common.notifications')}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{t('common.notifications')}</h3>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample Notifications */}
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Alert</p>
                          <span className="text-xs text-gray-500">1m ago</span>
                        </div>
                        <p className="text-sm text-gray-600">System maintenance scheduled for tonight at 2 AM</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold text-lg">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Success</p>
                          <span className="text-xs text-gray-500">30m ago</span>
                        </div>
                        <p className="text-sm text-gray-600">New operator account created successfully</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-600 font-semibold text-lg">!</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Warning</p>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <p className="text-sm text-gray-600">High transaction volume detected</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-lg">i</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">Info</p>
                          <span className="text-xs text-gray-500">1d ago</span>
                        </div>
                        <p className="text-sm text-gray-600">Weekly report is ready for review</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                    {t('common.viewAll')} {t('common.notifications')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
            title={t('common.language')}
          >
            <Globe className="w-5 h-5 text-gray-600" />
          </button>

          {/* Language Dropdown */}
          {isLanguageMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLanguageMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  {getSupportedLanguages().map((lang) => {
                    const langName = getLanguageName(lang.code, language);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm rounded-lg flex items-center justify-between ${language === lang.code
                          ? 'bg-purple-50 text-purple-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span>{langName}</span>
                        {language === lang.code && (
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

