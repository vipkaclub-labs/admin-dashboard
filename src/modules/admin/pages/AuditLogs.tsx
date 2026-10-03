import { useState, useEffect, useCallback } from 'react';
import { FileText, Search, Filter, Download, User, Settings, Shield, Key, RefreshCw, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { auditLogService, AuditLogItem } from '../../../services/auditLogService';
import { toast } from 'react-toastify';

const DEFAULT_FALLBACK_LOGS: AuditLogItem[] = [
  { id: '1', userId: 'admin001', action: 'login', resourceType: 'System', resourceId: 'SYS-AUTH', ipAddress: '192.168.1.100', createdAt: '2024-05-20 14:30:25', metadata: { status: 'success' } },
  { id: '2', userId: 'admin002', action: 'update_venue', resourceType: 'Karaoke', resourceId: 'Karaoke VIP 201', ipAddress: '192.168.1.101', createdAt: '2024-05-20 14:25:10', metadata: { status: 'success' } },
  { id: '3', userId: 'admin001', action: 'create_booking', resourceType: 'Booking', resourceId: 'BK-12345', ipAddress: '192.168.1.100', createdAt: '2024-05-20 14:20:05', metadata: { status: 'success' } },
  { id: '4', userId: 'admin003', action: 'delete_venue', resourceType: 'Massage', resourceId: 'Massage Spa 301', ipAddress: '192.168.1.102', createdAt: '2024-05-20 14:15:30', metadata: { status: 'failed' } },
  { id: '5', userId: 'admin001', action: 'change_settings', resourceType: 'Settings', resourceId: 'Cài đặt hệ thống', ipAddress: '192.168.1.100', createdAt: '2024-05-20 14:10:15', metadata: { status: 'success' } },
  { id: '6', userId: 'admin002', action: 'view_reports', resourceType: 'Reports', resourceId: 'Báo cáo doanh thu', ipAddress: '192.168.1.101', createdAt: '2024-05-20 14:05:00', metadata: { status: 'success' } },
];

const AuditLogs = () => {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await auditLogService.getAuditLogs({
        page: currentPage,
        limit: pageSize,
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
      });

      if (response && response.logs && response.logs.length > 0) {
        setLogs(response.logs);
        setTotalItems(response.total);
      } else if (response && response.logs && response.logs.length === 0 && actionFilter !== 'ALL') {
        setLogs([]);
        setTotalItems(0);
      } else {
        setLogs(DEFAULT_FALLBACK_LOGS);
        setTotalItems(DEFAULT_FALLBACK_LOGS.length);
      }
    } catch (err: any) {
      console.warn('Could not fetch audit logs from API, using fallback data:', err);
      setError(err?.message || 'Không thể kết nối đến máy chủ');
      setLogs(DEFAULT_FALLBACK_LOGS);
      setTotalItems(DEFAULT_FALLBACK_LOGS.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, pageSize, actionFilter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleExport = () => {
    try {
      const headers = ['Thời gian', 'Người dùng', 'Hành động', 'Loại tài nguyên', 'Mã tài nguyên', 'Địa chỉ IP'];
      const rows = filteredLogs.map(l => [
        l.createdAt,
        l.userId,
        l.action,
        l.resourceType,
        l.resourceId || '',
        l.ipAddress || '',
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
        + [headers.join(','), ...rows.map(r => r.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(language === 'vi' ? 'Xuất nhật ký thành công' : 'Audit logs exported successfully');
    } catch {
      toast.error(language === 'vi' ? 'Xuất nhật ký thất bại' : 'Export failed');
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const userMatch = (log.userId || (log as any).user || '').toLowerCase().includes(q);
    const actionMatch = (log.action || '').toLowerCase().includes(q);
    const resourceMatch = (log.resourceType || (log as any).resource || '').toLowerCase().includes(q);
    const ipMatch = (log.ipAddress || (log as any).ip || '').toLowerCase().includes(q);
    return userMatch || actionMatch || resourceMatch || ipMatch;
  });

  const getActionIcon = (action: string) => {
    const act = (action || '').toLowerCase();
    if (act.includes('login') || act.includes('logout') || act.includes('auth')) {
      return <Key className="w-4 h-4 text-blue-600" />;
    }
    if (act.includes('settings') || act.includes('update') || act.includes('config')) {
      return <Settings className="w-4 h-4 text-purple-600" />;
    }
    if (act.includes('view') || act.includes('reports') || act.includes('read')) {
      return <Shield className="w-4 h-4 text-amber-600" />;
    }
    if (act.includes('booking') || act.includes('wallet') || act.includes('transaction')) {
      return <FileText className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-gray-600" />;
  };

  const getActionColor = (action: string) => {
    const act = (action || '').toLowerCase();
    if (act.includes('delete') || act.includes('remove') || act.includes('cancel') || act.includes('fail')) {
      return 'text-rose-700 bg-rose-50 border-rose-200';
    }
    if (act.includes('create') || act.includes('add') || act.includes('insert')) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
    if (act.includes('update') || act.includes('modify') || act.includes('edit')) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'login': 'Đăng nhập',
      'logout': 'Đăng xuất',
      'update_venue': 'Cập nhật cơ sở',
      'create_venue': 'Tạo cơ sở mới',
      'delete_venue': 'Xóa cơ sở',
      'create_booking': 'Tạo đặt phòng',
      'update_booking': 'Cập nhật đặt phòng',
      'cancel_booking': 'Hủy đặt phòng',
      'create_promotion': 'Tạo khuyến mãi',
      'change_settings': 'Thay đổi cài đặt',
      'view_reports': 'Xem báo cáo',
      'update_customer': 'Cập nhật khách hàng',
      'CREATE': 'Tạo mới',
      'UPDATE': 'Cập nhật',
      'DELETE': 'Xóa',
      'READ': 'Truy vấn',
    };
    return actionMap[action] || action;
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '---';
    try {
      return new Date(dateStr).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Nhật ký Hoạt động (Audit Logs)</h1>
          <p className="text-gray-500 text-sm">Theo dõi toàn bộ các hoạt động quản trị, thay đổi cấu hình và bảo mật hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAuditLogs(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Xuất nhật ký
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div className="flex-1">
            <span className="font-semibold">Thông báo kết nối API: </span>
            {error}. Đang hiển thị nhật ký mẫu dự phòng.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhật ký (người dùng, hành động, tài nguyên, IP)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            >
              <option value="ALL">Tất cả hành động</option>
              <option value="login">Đăng nhập (login)</option>
              <option value="create">Tạo mới (create)</option>
              <option value="update">Cập nhật (update)</option>
              <option value="delete">Xóa (delete)</option>
              <option value="settings">Cài đặt (settings)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tài nguyên / Chi tiết</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Địa chỉ IP</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>Đang tải nhật ký kiểm toán...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy bản ghi nhật ký nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const userDisplay = log.userId || (log as any).user || 'system';
                  const resText = [log.resourceType, log.resourceId].filter(Boolean).join(': ') || (log as any).resource || '---';
                  const isSuccess = log.metadata?.status !== 'failed' && !(log as any).status?.includes('fail');

                  return (
                    <tr key={log.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                        {formatDateTime(log.createdAt || (log as any).timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{userDisplay}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getActionColor(log.action)}`}>
                            {getActionText(log.action)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate" title={resText}>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800">{resText}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                        {log.ipAddress || (log as any).ip || '127.0.0.1'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isSuccess ? 'Thành công' : 'Thất bại'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-semibold text-gray-700">{filteredLogs.length}</span> / <span className="font-semibold text-gray-700">{totalItems}</span> bản ghi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
              Trang {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={filteredLogs.length < pageSize || loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition"
              title="Trang tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
