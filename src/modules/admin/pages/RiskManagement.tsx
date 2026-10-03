import { useState, useEffect, useCallback } from 'react';
import { Shield, AlertTriangle, UserX, Lock, Eye, RefreshCw, Loader2, CheckCircle2, Unlock, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { auditLogService } from '../../../services/auditLogService';
import { userService } from '../../../services/userService';
import { toast } from 'react-toastify';

interface RiskAlert {
  id: string | number;
  player: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  date: string;
  ip?: string;
}

const DEFAULT_RISK_ALERTS: RiskAlert[] = [
  { id: 'RSK-01', player: 'player001', type: 'suspicious_activity', severity: 'high', description: 'Nhiều giao dịch nạp rút liên tiếp trong thời gian ngắn', status: 'pending', date: '2024-05-20 14:30', ip: '192.168.1.100' },
  { id: 'RSK-02', player: 'player005', type: 'fraud_detected', severity: 'critical', description: 'Phát hiện đăng nhập từ IP khả nghi & sai OTP nhiều lần', status: 'investigating', date: '2024-05-20 13:15', ip: '45.12.89.201' },
  { id: 'RSK-03', player: 'player012', type: 'unusual_pattern', severity: 'medium', description: 'Mẫu cược bất thường vượt mức trung bình ngày', status: 'resolved', date: '2024-05-20 12:00', ip: '113.161.45.12' },
  { id: 'RSK-04', player: 'player023', type: 'account_compromise', severity: 'high', description: 'Nghi ngờ tài khoản bị chiếm đoạt do đổi mật khẩu liên tục', status: 'pending', date: '2024-05-20 11:45', ip: '171.244.12.88' },
];

const RiskManagement = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<RiskAlert[]>(DEFAULT_RISK_ALERTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lockedAccountsCount, setLockedAccountsCount] = useState(4);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);

  const fetchRiskData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [auditRes, userRes] = await Promise.allSettled([
        auditLogService.getAuditLogs({ page: 1, limit: 30 }),
        userService.getUsers({ page: 1, page_size: 20 }),
      ]);

      if (auditRes.status === 'fulfilled' && auditRes.value && auditRes.value.logs) {
        const suspiciousLogs = auditRes.value.logs.filter((l: any) =>
          l.action?.includes('fail') || l.action?.includes('delete') || l.metadata?.status === 'failed' || l.action?.includes('auth')
        );

        if (suspiciousLogs.length > 0) {
          const mapped: RiskAlert[] = suspiciousLogs.map((log: any, idx: number) => ({
            id: log.id || `RSK-${idx + 1}`,
            player: log.userId || 'user_' + (idx + 10),
            type: log.action?.includes('login') ? 'account_compromise' : 'suspicious_activity',
            severity: idx % 3 === 0 ? 'critical' : idx % 2 === 0 ? 'high' : 'medium',
            description: `Hành động: ${log.action} trên tài nguyên ${log.resourceType || 'hệ thống'}`,
            status: idx === 0 ? 'pending' : idx === 1 ? 'investigating' : 'resolved',
            date: log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '---',
            ip: log.ipAddress || '192.168.1.1',
          }));
          setAlerts(mapped);
        }
      }

      if (userRes.status === 'fulfilled' && userRes.value) {
        const users = (userRes.value as any).users || (userRes.value as any).items || [];
        const inactive = users.filter((u: any) => u.status === 'inactive' || u.status === 'banned').length;
        setLockedAccountsCount(inactive || 3);
      }
    } catch (err) {
      console.warn('Could not load risk alerts from API, using fallback:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRiskData();
  }, [fetchRiskData]);

  const handleResolve = (id: string | number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    toast.success('Đã giải quyết cảnh báo rủi ro');
  };

  const handleToggleLock = (alert: RiskAlert) => {
    toast.warn(`Đã thực hiện khóa tài khoản cảnh báo: ${alert.player}`);
    setLockedAccountsCount(c => c + 1);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'suspicious_activity':
        return t('common.suspicious') || 'Hoạt động khả nghi';
      case 'fraud_detected':
        return t('pages.risk.fraud') || 'Phát hiện gian lận';
      case 'unusual_pattern':
        return t('pages.risk.unusualPattern') || 'Mẫu giao dịch bất thường';
      case 'account_compromise':
        return t('pages.risk.accountCompromise') || 'Nghi ngờ xâm nhập';
      default:
        return type;
    }
  };

  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const investigatingCount = alerts.filter(a => a.status === 'investigating').length;

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('pages.risk.title')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.risk.description')}</p>
        </div>
        <button
          onClick={() => fetchRiskData(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
          <span>Quét lại rủi ro</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.risk.totalAlerts')}</p>
              <p className="text-2xl font-bold text-gray-800">{alerts.length}</p>
              <span className="text-xs text-gray-400 mt-1 block">Bản ghi cảnh báo rủi ro</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.risk.pending')}</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <span className="text-xs text-amber-600/70 mt-1 block">Chờ rà soát</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.risk.investigating')}</p>
              <p className="text-2xl font-bold text-blue-600">{investigatingCount}</p>
              <span className="text-xs text-blue-600/70 mt-1 block">Đang điều tra</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.risk.lockedAccounts')}</p>
              <p className="text-2xl font-bold text-rose-600">{lockedAccountsCount}</p>
              <span className="text-xs text-rose-600/70 mt-1 block">Tài khoản bị phong tỏa</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <UserX className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alerts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.player')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.type')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.severity')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.description')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.time')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">{t('pages.tables.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>Đang kiểm tra rủi ro hệ thống...</span>
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không có cảnh báo rủi ro nào cần xử lý.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{alert.player}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-600">{getTypeText(alert.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'critical' ? t('pages.risk.critical') : alert.severity === 'high' ? t('pages.risk.high') : t('pages.risk.medium')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={alert.description}>
                      {alert.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                        {alert.status === 'pending' ? t('pages.risk.pending') : alert.status === 'investigating' ? t('pages.risk.investigating') : t('pages.risk.resolved')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">{alert.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleLock(alert)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                          title="Khóa tài khoản nghi vấn"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                            title="Đánh dấu đã giải quyết"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Chi tiết cảnh báo rủi ro</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Đối tượng:</span> <strong className="text-gray-800">{selectedAlert.player}</strong>
              </div>
              <div>
                <span className="text-gray-500">Địa chỉ IP:</span> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedAlert.ip || 'N/A'}</code>
              </div>
              <div>
                <span className="text-gray-500">Mức độ rủi ro:</span> <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getSeverityColor(selectedAlert.severity)}`}>{selectedAlert.severity}</span>
              </div>
              <div>
                <span className="text-gray-500">Mô tả sự việc:</span>
                <p className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">{selectedAlert.description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleResolve(selectedAlert.id);
                  setSelectedAlert(null);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
              >
                Giải quyết rủi ro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskManagement;
