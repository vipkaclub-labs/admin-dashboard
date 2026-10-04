import { ChevronRight } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
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
    return 'AD';
  };

  // Hiển thị TẤT CẢ menu items
  const menuItems = ALL_MENU_ITEMS.map((item) => ({
    ...item,
    label: t(item.translationKey) || item.label,
  }));

  return (
    <aside
      className={`bg-white/95 backdrop-blur-md border-r border-amber-200/50 h-screen overflow-y-auto custom-scrollbar transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* User Profile Section */}
        <div
          className={`border-b border-amber-100/80 bg-gradient-to-b from-amber-500/5 to-transparent ${
            isCollapsed ? 'p-3 flex justify-center' : 'p-5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`rounded-2xl flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30 flex-shrink-0 ${
                isCollapsed ? 'w-10 h-10 text-xs' : 'w-11 h-11 text-sm'
              } bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 font-display`}
            >
              {getUserInitials()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {user?.displayName || user?.name || user?.username || t('common.user')}
                  </p>
                  <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    VIP Quản trị
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Menu Quản Trị
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path === '/dashboard' && pathname === '/dashboard');

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => onMenuClick()}
                className={`group flex items-center rounded-xl cursor-pointer transition-all duration-200 ${
                  isCollapsed
                    ? 'justify-center p-3'
                    : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 text-amber-950 font-bold border-l-4 border-amber-500 border-y border-r border-amber-200/50 shadow-xs'
                    : 'text-stone-600 hover:bg-amber-50/50 hover:text-amber-900 hover:translate-x-0.5'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center transition-colors ${
                      isActive
                        ? 'text-amber-600'
                        : 'text-stone-400 group-hover:text-amber-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  {!isCollapsed && (
                    <span
                      className={`text-xs truncate ${
                        isActive
                          ? 'text-amber-950 font-bold'
                          : 'font-medium text-stone-700 group-hover:text-amber-900'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                      isActive
                        ? 'text-amber-600'
                        : 'text-stone-300 group-hover:text-amber-500'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer branding */}
      {!isCollapsed && (
        <div className="p-4 border-t border-amber-100/60 bg-stone-50/50 m-3 rounded-xl border">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">VIPKA Club Portal</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
              v2.4
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarMenu;
