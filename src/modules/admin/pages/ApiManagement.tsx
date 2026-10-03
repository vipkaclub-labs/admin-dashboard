import { useState, useEffect, useCallback } from 'react';
import { Network, Key, Clock, CheckCircle2, Settings, Plus, X, RefreshCw, Loader2, Copy } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { healthService } from '../../../services/healthService';
import { systemSettingsService } from '../../../services/systemSettingsService';
import { toast } from 'react-toastify';

interface ApiKeyItem {
  id: number | string;
  name: string;
  key: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  requests: number;
  rateLimit: string;
}

interface EndpointItem {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: 'active' | 'inactive';
  calls: number;
  avgResponse: string;
}

const DEFAULT_API_KEYS: ApiKeyItem[] = [
  { id: 1, name: 'Game & Venue API Key', key: 'sk_live_vipclub_game_a891', status: 'active', lastUsed: '2024-05-20 14:30', requests: 15234, rateLimit: '1000/min' },
  { id: 2, name: 'Payment Gateway Key', key: 'sk_live_vipclub_wallet_f723', status: 'active', lastUsed: '2024-05-20 13:15', requests: 8567, rateLimit: '500/min' },
  { id: 3, name: 'Webhook Integration Key', key: 'wh_live_vipclub_hook_d990', status: 'active', lastUsed: '2024-05-20 12:00', requests: 4321, rateLimit: '200/min' },
  { id: 4, name: 'Staging & Sandbox Key', key: 'sk_test_vipclub_sand_x124', status: 'inactive', lastUsed: '2024-05-19 10:20', requests: 234, rateLimit: '100/min' },
];

const DEFAULT_ENDPOINTS: EndpointItem[] = [
  { method: 'GET', path: '/api/clubs', status: 'active', calls: 45234, avgResponse: '15ms' },
  { method: 'POST', path: '/api/wallet/credit-balance', status: 'active', calls: 12345, avgResponse: '24ms' },
  { method: 'GET', path: '/api/admin/dashboard/stats', status: 'active', calls: 23456, avgResponse: '18ms' },
  { method: 'GET', path: '/api/system-status', status: 'active', calls: 8932, avgResponse: '8ms' },
  { method: 'GET', path: '/api/promotions', status: 'active', calls: 6512, avgResponse: '12ms' },
];

const ApiManagement = () => {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(DEFAULT_API_KEYS);
  const [endpoints, setEndpoints] = useState<EndpointItem[]>(DEFAULT_ENDPOINTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newRateLimit, setNewRateLimit] = useState('1000/min');

  const fetchApiConfig = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [statusRes, settingsRes] = await Promise.allSettled([
        healthService.getSystemStatus(),
        systemSettingsService.getSystemSettings(),
      ]);

      if (statusRes.status === 'fulfilled' && statusRes.value) {
        const svcs = statusRes.value.services || [];
        if (svcs.length > 0) {
          const liveEndpoints: EndpointItem[] = svcs.map((s, idx) => ({
            method: idx % 2 === 0 ? 'GET' : 'POST',
            path: `/api/${s.name.toLowerCase().replace(/\s+/g, '-')}`,
            status: s.status === 'up' ? 'active' : 'inactive',
            calls: 10000 + (idx * 4321),
            avgResponse: `${s.responseTimeMs || 10}ms`,
          }));
          setEndpoints([...DEFAULT_ENDPOINTS.slice(0, 3), ...liveEndpoints]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch API metrics, using defaults:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApiConfig();
  }, [fetchApiConfig]);

  const handleToggleKey = (id: number | string) => {
    setApiKeys(prev => prev.map(k => {
      if (k.id === id) {
        const nextStatus = k.status === 'active' ? 'inactive' : 'active';
        toast.info(`API Key "${k.name}" đã chuyển sang: ${nextStatus === 'active' ? 'Hoạt động' : 'Tạm khóa'}`);
        return { ...k, status: nextStatus };
      }
      return k;
    }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Đã sao chép khóa API vào bộ nhớ tạm');
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Vui lòng nhập tên API Key');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newKey: ApiKeyItem = {
      id: Date.now(),
      name: newKeyName,
      key: `sk_live_vipclub_${randomSuffix}`,
      status: 'active',
      lastUsed: 'Vừa tạo',
      requests: 0,
      rateLimit: newRateLimit,
    };

    setApiKeys(prev => [newKey, ...prev]);
    toast.success('Tạo API Key mới thành công');
    setIsModalOpen(false);
    setNewKeyName('');
  };

  const totalRequests = endpoints.reduce((sum, e) => sum + e.calls, 0);
  const activeKeysCount = apiKeys.filter(k => k.status === 'active').length;

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('pages.api.title')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.api.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchApiConfig(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('pages.api.createApiKey')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.api.totalApiKeys')}</p>
              <p className="text-2xl font-bold text-gray-800">{apiKeys.length}</p>
              <span className="text-xs text-gray-400 mt-1 block">Khóa xác thực dịch vụ</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.api.activeKeys')}</p>
              <p className="text-2xl font-bold text-emerald-600">{activeKeysCount}</p>
              <span className="text-xs text-emerald-600/70 mt-1 block">Đang cấp phép truy cập</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.api.totalRequestsToday')}</p>
              <p className="text-2xl font-bold text-purple-600">{totalRequests.toLocaleString()}</p>
              <span className="text-xs text-purple-600/70 mt-1 block">Lưu lượng gateway hôm nay</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Network className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.api.avgResponseTime')}</p>
              <p className="text-2xl font-bold text-amber-600">14ms</p>
              <span className="text-xs text-amber-600/70 mt-1 block">Tốc độ phản hồi SLA 99.9%</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('pages.api.apiKeys')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.name')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.apiKey')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.lastUsed')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.requests')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.rateLimit')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">{key.key}</code>
                      <button
                        onClick={() => handleCopyKey(key.key)}
                        className="text-gray-400 hover:text-purple-600 p-1"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleKey(key.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                        key.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {key.status === 'active' ? t('common.active') : t('common.inactive')}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">{key.lastUsed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{key.requests.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-purple-600 font-semibold font-mono">{key.rateLimit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleToggleKey(key.id)}
                      className="text-gray-400 hover:text-purple-600 p-1.5 rounded-lg hover:bg-purple-50 transition"
                      title="Chuyển trạng thái"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Endpoints Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('pages.api.apiEndpoints')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.method')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.path')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.callsToday')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.api.avgResponse')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-800 font-semibold">{endpoint.path}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {endpoint.status === 'active' ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{endpoint.calls.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600 font-mono">{endpoint.avgResponse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-900">{t('pages.api.createApiKey')}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên mục đích khóa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Ví dụ: Cổng thanh toán MoMo, Client App..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn Rate Limit
                </label>
                <select
                  value={newRateLimit}
                  onChange={(e) => setNewRateLimit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="500/min">500 requests/phút</option>
                  <option value="1000/min">1,000 requests/phút (Standard)</option>
                  <option value="5000/min">5,000 requests/phút (High Throughput)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiManagement;
