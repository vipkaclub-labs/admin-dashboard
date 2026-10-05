import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Bell, CheckCircle2, XCircle, RefreshCw, Loader2, CheckCheck, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { notificationService } from '../../../services/notificationService';
import { toast } from 'react-toastify';

interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DEFAULT_ALERTS: AlertItem[] = [
  { id: 'ALT_001', type: 'warning', title: 'Tải hệ thống cao', message: 'Tải CPU máy chủ vượt ngưỡng 80% trong 5 phút qua', time: '14:30:25', read: false },
  { id: 'ALT_002', type: 'error', title: 'Cổng thanh toán phản hồi chậm', message: 'Cổng Vietcombank Auto QR phản hồi timeout > 5000ms', time: '13:15:10', read: false },
  { id: 'ALT_003', type: 'info', title: 'Sao lưu cơ sở dữ liệu hoàn tất', message: 'Bản sao lưu snapshot định kỳ đã được lưu vào S3', time: '12:00:05', read: true },
  { id: 'ALT_004', type: 'warning', title: 'Tiệm cận giới hạn Rate Limit', message: 'IP 192.168.1.105 đã gửi 950/1000 requests/phút', time: '11:45:30', read: true },
  { id: 'ALT_005', type: 'success', title: 'Triển khai bản vá thành công', message: 'Dịch vụ Core API đã được cập nhật lên phiên bản mới', time: '10:20:15', read: true },
];

const Alerts = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Create alert modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'warning' as 'warning' | 'error' | 'info' | 'success',
  });

  const fetchAlerts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await notificationService.getNotifications(1, 50);
      const rawItems = response?.data?.items || (response as any)?.items || [];
      if (rawItems && rawItems.length > 0) {
        const mapped: AlertItem[] = rawItems.map((n: any) => {
          let alertType: AlertItem['type'] = 'info';
          const tLower = (n.type || '').toLowerCase();
          if (tLower.includes('error') || tLower.includes('fail') || tLower.includes('critical')) {
            alertType = 'error';
          } else if (tLower.includes('warn')) {
            alertType = 'warning';
          } else if (tLower.includes('success')) {
            alertType = 'success';
          }

          return {
            id: n.id,
            type: alertType,
            title: n.title || 'Hệ thống thông báo',
            message: n.message || n.content || '',
            time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString('vi-VN') : '---',
            read: !!n.readAt || !!n.isRead || !!n.read,
          };
        });
        setAlerts(mapped);
      } else {
        setAlerts(DEFAULT_ALERTS);
      }
    } catch (err) {
      console.warn('Could not fetch notifications from API, using fallback:', err);
      setAlerts(DEFAULT_ALERTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
      toast.success('Đã đánh dấu đã đọc');
    } catch {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    }
  };

  const handleMarkAllRead = async () => {
    const unread = alerts.filter(a => !a.read);
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
    try {
      await Promise.allSettled(unread.map(a => notificationService.markAsRead(a.id)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      toast.success('Đã xóa cảnh báo');
    } catch {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung cảnh báo');
      return;
    }

    setSubmitting(true);
    try {
      await notificationService.createNotification({
        title: formData.title,
        message: formData.message,
        type: formData.type.toUpperCase(),
      });
      toast.success('Tạo cảnh báo hệ thống thành công');
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'warning' });
      fetchAlerts(true);
    } catch (err: any) {
      // Fallback local create
      const newAlert: AlertItem = {
        id: `ALT_${Date.now()}`,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        time: new Date().toLocaleTimeString('vi-VN'),
        read: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
      toast.success('Đã tạo cảnh báo mới');
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'warning' });
    } finally {
      setSubmitting(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-rose-50/70 border-rose-200';
      case 'warning':
        return 'bg-amber-50/70 border-amber-200';
      case 'success':
        return 'bg-emerald-50/70 border-emerald-200';
      default:
        return 'bg-blue-50/70 border-blue-200';
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (typeFilter === 'ALL') return true;
    return a.type === typeFilter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const errorCount = alerts.filter(a => a.type === 'error').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('menu.alerts')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.alerts.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAlerts(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 text-purple-600" />
            <span>Đọc tất cả</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo cảnh báo</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.alerts.totalAlertsLabel')}</p>
              <p className="text-2xl font-bold text-gray-800">{alerts.length}</p>
              <span className="text-xs text-gray-400 mt-1 block">Tổng cảnh báo hệ thống</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.alerts.unread')}</p>
              <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
              <span className="text-xs text-amber-600/70 mt-1 block">Cần xử lý ngay</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('common.error')}</p>
              <p className="text-2xl font-bold text-rose-600">{errorCount}</p>
              <span className="text-xs text-rose-600/70 mt-1 block">Lỗi kết nối / Dịch vụ</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.alerts.warning')}</p>
              <p className="text-2xl font-bold text-orange-600">{warningCount}</p>
              <span className="text-xs text-orange-600/70 mt-1 block">Cảnh báo ngưỡng tải</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {['ALL', 'error', 'warning', 'info', 'success'].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
              typeFilter === type
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type === 'ALL' ? 'Tất cả' : type}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
            <span>Đang tải danh sách cảnh báo...</span>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            Không có cảnh báo nào phù hợp.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl shadow-sm border p-4 transition ${getAlertBgColor(alert.type)} ${
                !alert.read ? 'ring-2 ring-purple-300' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${!alert.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">{alert.time}</span>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-purple-600 rounded-full" title="Chưa đọc" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-200/50">
                    {!alert.read && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="text-xs font-medium text-gray-400 hover:text-rose-600 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Phát cảnh báo hệ thống</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ cảnh báo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="warning">Cảnh báo (Warning)</option>
                  <option value="error">Nghiêm trọng (Error)</option>
                  <option value="info">Thông tin (Info)</option>
                  <option value="success">Thành công (Success)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ví dụ: Bảo trì cổng thanh toán..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Nhập chi tiết nội dung cảnh báo gửi đến quản trị viên..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Phát cảnh báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
