import { ChevronRight } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ALL_MENU_ITEMS } from '../utils/rolePermissions';

interface SidebarMenuProps {
  isCollapsed: boolean;
  onMenuClick: () => void;
}

const SidebarMenu = ({ isCollapsed, onMenuClick }: SidebarMenuProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get user initials from displayName
  const getUserInitials = () => {
    const displayName = user?.displayName || user?.name || user?.username || '';
    if (displayName) {
      const parts = displayName.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Hiển thị TẤT CẢ menu items - không kiểm tra role
  const menuItems = ALL_MENU_ITEMS.map(item => ({
    ...item,
    label: t(item.translationKey) || item.label
  }));

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
      }`}>
      {/* User Profile Section */}
      <div className={`border-b border-gray-200 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full flex items-center justify-center text-white font-semibold ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
            } bg-gradient-to-br from-purple-400 to-purple-500`}>
            {getUserInitials()}
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.displayName || user?.name || user?.username || t('common.user')}
                </p>
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Navigation Menu - Hiển thị TẤT CẢ menu */}
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/dashboard');
          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={() => onMenuClick()}
              className={`flex items-center rounded-lg cursor-pointer transition-colors ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-4 py-3'
                } mb-1 ${isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="flex items-center gap-3">
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                {!isCollapsed && (
                  <span className={`text-sm font-medium ${isActive ? 'text-purple-600' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
