import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Maximize2, Mail, Bell, Power, X, Globe, List, User, Settings, HelpCircle, Loader2, MessageSquare, CheckCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getSupportedLanguages, getLanguageName } from '../utils/translations';
import { notificationService } from '../services/notificationService';
import { chatService } from '../services/chatService';
import { NotificationResponseDto, ChatRoomResponseDto } from '../types/api';

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

  // Live Notifications State
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Live Messages / Chat State
  const [chatRooms, setChatRooms] = useState<ChatRoomResponseDto[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const res = await notificationService.getNotifications(1, 5);
      const items = res?.data?.items || (res as any)?.items || [];
      setNotifications(items);
      setUnreadNotificationCount(items.filter((n: any) => n.status === 'UNREAD').length);
    } catch (err) {
      console.warn('Could not fetch notifications for header:', err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const fetchChatRooms = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await chatService.getChatRooms({ page: 1, limit: 5 });
      const items = (res as any)?.data?.items || (res as any)?.items || (res as any)?.data || [];
      if (Array.isArray(items)) {
        setChatRooms(items);
      }
    } catch (err) {
      console.warn('Could not fetch chat rooms for header:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchChatRooms();
  }, [fetchNotifications, fetchChatRooms]);

  const handleNotificationClick = async (notif: NotificationResponseDto) => {
    if (notif.status === 'UNREAD') {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, status: 'READ' as any } : n))
        );
        setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Optimistic update even on network glitch
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, status: 'READ' as any } : n))
        );
        setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
      }
    }
    setIsNotificationsOpen(false);
    router.push('/dashboard/notifications');
  };

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Vừa xong';
      if (minutes < 60) return `${minutes}m trước`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h trước`;
      const days = Math.floor(hours / 24);
      return `${days}d trước`;
    } catch {
      return dateStr;
    }
  };

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
    <header className="bg-white/90 backdrop-blur-md border-b border-amber-200/50 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xs transition-all">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/50 shadow-sm bg-stone-950 flex items-center justify-center p-0.5 relative group cursor-pointer hover:border-amber-400 transition-all">
            <img
              src="/vipka-logo.svg"
              alt="VIPKA Club Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider font-display bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
              VIPKA Club
            </span>
            <span className="text-[10px] font-bold text-amber-700/90 tracking-widest uppercase">
              {getHeaderTitle()}
            </span>
          </div>
        </div>

        {/* Search + Sidebar toggle */}
        <div className="flex items-center gap-3 ml-4 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-xl transition-colors border border-transparent hover:border-amber-200/60"
            title="Toggle sidebar"
          >
            <List className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 bg-stone-50/90 hover:bg-stone-50 border border-stone-200/80 focus-within:border-amber-500/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 rounded-xl px-3.5 py-2 flex-1 transition-all shadow-2xs">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              className="bg-transparent border-none outline-none text-sm text-stone-800 placeholder-stone-400 flex-1"
            />
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-semibold bg-white border border-stone-200 px-1.5 py-0.5 rounded-md text-stone-400 shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-amber-50/60 rounded-xl px-2.5 py-1.5 border border-transparent hover:border-amber-200/60 transition-all"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-950 text-sm font-black bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-xs ring-2 ring-amber-400/30">
              {getUserInitials()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-stone-800 leading-tight">{getDisplayName()}</span>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                VIP Admin
              </span>
            </div>
            <svg className="w-4 h-4 text-stone-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-amber-200/60 z-50 overflow-hidden animate-scale-in">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-b from-amber-50/40 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-stone-950 font-black bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-xs ring-2 ring-amber-400/30">
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
          className="p-2 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-xl transition-all border border-transparent hover:border-amber-200/60 relative"
          title={t('common.fullscreen')}
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            className="p-2 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-xl transition-all border border-transparent hover:border-amber-200/60 relative"
            title={t('common.messages')}
          >
            <Mail className="w-5 h-5" />
            {chatRooms.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Messages Dropdown */}
          {isMessagesOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMessagesOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-stone-900/10 border border-amber-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <h3 className="font-semibold text-stone-900 text-sm">{t('common.messages')}</h3>
                    {chatRooms.length > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                        {chatRooms.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMessagesOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    </div>
                  ) : chatRooms.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      Không có tin nhắn mới
                    </div>
                  ) : (
                    chatRooms.slice(0, 5).map((room, idx) => (
                      <div
                        key={room.id || idx}
                        onClick={() => {
                          setIsMessagesOpen(false);
                          router.push('/dashboard/alerts');
                        }}
                        className="p-3.5 hover:bg-amber-50/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/20 text-xs uppercase">
                            {room.name ? room.name[0] : 'C'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs font-semibold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                                {room.name || 'Phòng hội thoại'}
                              </p>
                              <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                                {formatRelativeTime(room.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 truncate">
                              {room.participants?.length ? `${room.participants.length} thành viên tham gia` : 'Bấm để xem chi tiết...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2.5 border-t border-amber-100 bg-stone-50/50 text-center">
                  <button
                    onClick={() => {
                      setIsMessagesOpen(false);
                      router.push('/dashboard/alerts');
                    }}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium py-1 px-3 rounded-lg hover:bg-amber-100/50 transition-all"
                  >
                    {t('common.viewAll')} {t('common.messages')} →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-xl transition-all border border-transparent hover:border-amber-200/60 relative"
            title={t('common.notifications')}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] text-white font-bold rounded-full ring-2 ring-white flex items-center justify-center">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            ) : null}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-stone-900/10 border border-amber-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <h3 className="font-semibold text-stone-900 text-sm">{t('common.notifications')}</h3>
                    {unreadNotificationCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                        {unreadNotificationCount} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {loadingNotifications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      Chưa có thông báo nào
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => {
                      const isUnread = notif.status === 'UNREAD';
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 transition-colors cursor-pointer group ${
                            isUnread ? 'bg-amber-50/40 hover:bg-amber-100/50' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isUnread
                                  ? 'bg-rose-100 text-rose-600'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <p
                                  className={`text-xs truncate transition-colors ${
                                    isUnread
                                      ? 'font-bold text-stone-900 group-hover:text-amber-800'
                                      : 'font-medium text-stone-600'
                                  }`}
                                >
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                                  {formatRelativeTime(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0"></span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-2.5 border-t border-amber-100 bg-stone-50/50 text-center">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      router.push('/dashboard/notifications');
                    }}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium py-1 px-3 rounded-lg hover:bg-amber-100/50 transition-all"
                  >
                    {t('common.viewAll')} {t('common.notifications')} →
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
            className="p-2 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-xl transition-all border border-transparent hover:border-amber-200/60 relative"
            title={t('common.language')}
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Language Dropdown */}
          {/* Language Dropdown */}
          {isLanguageMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLanguageMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-stone-900/10 border border-amber-200/80 z-50 max-h-80 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 mb-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {t('common.language')}
                </div>
                <div className="space-y-1">
                  {getSupportedLanguages().map((lang) => {
                    const langName = getLanguageName(lang.code, language);
                    const isCurrent = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-3 py-2 text-left text-xs rounded-xl flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-900 font-semibold border border-amber-300/40 shadow-sm'
                            : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-900'
                        }`}
                      >
                        <span>{langName}</span>
                        {isCurrent && (
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
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
