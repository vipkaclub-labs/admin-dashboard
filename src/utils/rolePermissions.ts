import {
  Home,
  Building2 as VenueIcon,
  UserCog,
  Building2,
  Settings,
  User,
  Shield,
  Key,
  MessageSquare,
  Star,
  FileCheck,
  Bell,
  Rss,
  HardDrive,
  Activity,
  FileText,
  CreditCard,
  Wallet,
  Gift,
  BarChart3,
  TrendingUp,
  Calendar,
  LucideIcon
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  translationKey: string; // Key for translation
}

/**
 * All menu items for admin portal
 * Note: label is used as fallback, actual label comes from translations
 * Since this is admin-only portal, no role filtering needed
 */
export const ALL_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Home, translationKey: 'menu.dashboard' },
  { id: 'bookings', label: 'Bookings Management', path: '/dashboard/bookings', icon: Calendar, translationKey: 'menu.bookingsManagement' },
  { id: 'venues', label: 'Venues Management', path: '/dashboard/clubs', icon: VenueIcon, translationKey: 'menu.venuesManagement' },

  { id: 'operators', label: 'Operators Management', path: '/dashboard/karaoke', icon: UserCog, translationKey: 'menu.operatorsManagement' },
  { id: 'provider-accounts', label: 'Provider Accounts Management', path: '/dashboard/massages', icon: Building2, translationKey: 'menu.providerAccountsManagement' },
  { id: 'articles', label: 'Articles Management', path: '/dashboard/articles', icon: FileText, translationKey: 'menu.articlesManagement' },
  { id: 'roles', label: 'Roles Management', path: '/dashboard/roles', icon: Shield, translationKey: 'menu.rolesManagement' },
  { id: 'permissions', label: 'Permissions Management', path: '/dashboard/permissions', icon: Key, translationKey: 'menu.permissionsManagement' },
  { id: 'users', label: 'Users Management', path: '/dashboard/users', icon: User, translationKey: 'menu.usersManagement' },
  { id: 'wallet', label: 'Wallet & Payment', path: '/dashboard/wallet', icon: Wallet, translationKey: 'menu.walletPayment' },
  { id: 'transactions', label: 'Transactions', path: '/dashboard/transactions', icon: CreditCard, translationKey: 'menu.transactions' },
  { id: 'promotions', label: 'Promotions & Bonus', path: '/dashboard/promotions', icon: Gift, translationKey: 'menu.promotionsBonus' },
  { id: 'reports', label: 'Reports & Statistics', path: '/dashboard/reports', icon: BarChart3, translationKey: 'menu.reports' },
  { id: 'analytics', label: 'Performance Analytics', path: '/dashboard/analytics', icon: TrendingUp, translationKey: 'menu.analytics' },
  { id: 'comments', label: 'Comments Management', path: '/dashboard/comments', icon: MessageSquare, translationKey: 'menu.commentsManagement' },
  { id: 'ratings', label: 'Ratings Management', path: '/dashboard/ratings', icon: Star, translationKey: 'menu.ratingsManagement' },
  { id: 'notifications', label: 'Notifications Management', path: '/dashboard/notifications', icon: Bell, translationKey: 'menu.notificationsManagement' },
  { id: 'feeds', label: 'Feeds Management', path: '/dashboard/feeds', icon: Rss, translationKey: 'menu.feedsManagement' },
  { id: 'kyc', label: 'KYC Management', path: '/dashboard/kyc', icon: FileCheck, translationKey: 'menu.kycManagement' },
  { id: 'monitoring', label: 'Monitoring', path: '/dashboard/monitoring', icon: Activity, translationKey: 'menu.monitoring' },
  { id: 'logs', label: 'Audit Logs', path: '/dashboard/audit-logs', icon: FileText, translationKey: 'menu.auditLogs' },
  { id: 'caching', label: 'Caching Management', path: '/dashboard/caching', icon: HardDrive, translationKey: 'menu.cachingManagement' },
  { id: 'system-status', label: 'System Status', path: '/dashboard/system-status', icon: Activity, translationKey: 'menu.systemStatus' },
  { id: 'settings', label: 'System Settings', path: '/dashboard/settings', icon: Settings, translationKey: 'menu.systemSettings' },
];

/**
 * Get all menu items (no role filtering needed for admin-only portal)
 * @param t - Translation function (optional, if not provided, returns items with default labels)
 */
export const getMenuItemsByRole = (_role?: any, t?: (key: string) => string): MenuItem[] => {
  // If translation function is provided, update labels
  if (t) {
    return ALL_MENU_ITEMS.map(item => ({
      ...item,
      label: t(item.translationKey) || item.label
    }));
  }

  return ALL_MENU_ITEMS;
};

/**
 * Check if a path exists in menu items (no role check needed)
 */
export const canAccessPath = (path: string, _role?: any): boolean => {
  const menuItem = ALL_MENU_ITEMS.find(item => item.path === path);
  return !!menuItem;
};
