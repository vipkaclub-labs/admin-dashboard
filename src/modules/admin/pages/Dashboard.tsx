import { useState, useEffect, useCallback } from 'react';
import { Home, TrendingUp, Bookmark, Gem, RefreshCw, AlertCircle } from 'lucide-react';
import MetricCard from '../../../components/MetricCard';
import VisitSalesChart from '../../../components/VisitSalesChart';
import TrafficSourcesChart from '../../../components/TrafficSourcesChart';
import RecentTickets from '../../../components/RecentTickets';
import { useLanguage } from '../../../contexts/LanguageContext';
import { adminService } from '../../../services/adminService';
import { DashboardStatsResponseDto } from '../../../types/api';

const Dashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStatsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.warn('Could not fetch real-time dashboard stats, fallback to preview defaults:', err.message);
      setError(err?.message || 'Không thể tải thống kê');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Formatting helpers
  const formatRevenue = (total?: number, currency = 'VNĐ') => {
    if (total === undefined || total === null) return '1.5 tỷ VNĐ';
    if (total >= 1_000_000_000) {
      return `${(total / 1_000_000_000).toFixed(1)} tỷ ${currency}`;
    }
    if (total >= 1_000_000) {
      return `${(total / 1_000_000).toFixed(1)} tr ${currency}`;
    }
    return `${total.toLocaleString('vi-VN')} ${currency}`;
  };

  const getChangeInfo = (percent?: number, defaultVal = 10) => {
    const val = percent !== undefined && percent !== null ? percent : defaultVal;
    return {
      changeText: `${Math.abs(val)}%`,
      changeType: val >= 0 ? ('increase' as const) : ('decrease' as const),
    };
  };

  const revenueChange = getChangeInfo(stats?.revenue?.changePercent, 60);
  const bookingsChange = getChangeInfo(stats?.bookings?.changePercent, 10);
  const customersChange = getChangeInfo(stats?.activeCustomers?.changePercent, 5);

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">{t('pages.dashboard.title')}</h1>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Dữ liệu demo offline</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => loadStats(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title={t('pages.dashboard.weeklyRevenue')}
          value={formatRevenue(stats?.revenue?.total, stats?.revenue?.currency || 'VNĐ')}
          change={revenueChange.changeText}
          changeType={revenueChange.changeType}
          gradientFrom="from-pink-500"
          gradientTo="to-orange-500"
          icon={TrendingUp}
        />
        <MetricCard
          title={t('pages.dashboard.bookingsCount')}
          value={stats?.bookings?.total !== undefined ? stats.bookings.total.toLocaleString('vi-VN') : '456'}
          change={bookingsChange.changeText}
          changeType={bookingsChange.changeType}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          icon={Bookmark}
        />
        <MetricCard
          title={t('pages.dashboard.activeCustomers')}
          value={stats?.activeCustomers?.current !== undefined ? stats.activeCustomers.current.toLocaleString('vi-VN') : '95'}
          change={customersChange.changeText}
          changeType={customersChange.changeType}
          gradientFrom="from-green-500"
          gradientTo="to-teal-500"
          icon={Gem}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VisitSalesChart
          data={stats?.accessSalesChart}
          loading={loading || refreshing}
        />
        <TrafficSourcesChart
          data={stats?.trafficSources}
          loading={loading || refreshing}
        />
      </div>

      {/* Recent Tickets */}
      <RecentTickets
        bookings={stats?.recentBookings}
        loading={loading || refreshing}
      />
    </div>
  );
};

export default Dashboard;
