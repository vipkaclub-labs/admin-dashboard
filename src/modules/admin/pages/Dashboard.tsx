import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Bookmark,
  Gem,
  RefreshCw,
  AlertCircle,
  Activity,
  Sparkles,
  Calendar,
} from 'lucide-react';
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

  const todayDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex-1 bg-[#faf8f5] p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 mb-8 border border-amber-500/20 shadow-xl shadow-stone-950/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                VIPKA Executive Control
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Hệ thống trực tuyến
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white mb-2">
              Chào mừng trở lại, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">VIP Admin</span>
            </h1>
            <p className="text-sm text-stone-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400/80" />
              <span>{todayDate.charAt(0).toUpperCase() + todayDate.slice(1)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 px-3 py-2 rounded-xl border border-amber-500/30 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Dữ liệu demo offline</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => loadStats(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 text-sm font-semibold text-stone-900 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Đang đồng bộ...' : 'Làm mới dữ liệu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title={t('pages.dashboard.weeklyRevenue')}
          value={formatRevenue(stats?.revenue?.total, stats?.revenue?.currency || 'VNĐ')}
          change={revenueChange.changeText}
          changeType={revenueChange.changeType}
          gradientFrom="from-amber-700"
          gradientTo="to-amber-600"
          icon={TrendingUp}
          badge="Doanh thu"
        />
        <MetricCard
          title={t('pages.dashboard.bookingsCount')}
          value={stats?.bookings?.total !== undefined ? stats.bookings.total.toLocaleString('vi-VN') : '456'}
          change={bookingsChange.changeText}
          changeType={bookingsChange.changeType}
          gradientFrom="from-stone-900"
          gradientTo="to-stone-800"
          icon={Bookmark}
          badge="Đơn đặt"
        />
        <MetricCard
          title={t('pages.dashboard.activeCustomers')}
          value={stats?.activeCustomers?.current !== undefined ? stats.activeCustomers.current.toLocaleString('vi-VN') : '95'}
          change={customersChange.changeText}
          changeType={customersChange.changeType}
          gradientFrom="from-emerald-800"
          gradientTo="to-teal-800"
          icon={Gem}
          badge="Khách VIP"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VisitSalesChart
          data={stats?.accessSalesChart}
          loading={loading || refreshing}
        />
        <TrafficSourcesChart
          data={stats?.trafficSources}
          loading={loading || refreshing}
        />
      </div>

      {/* Recent Activity / Bookings Table */}
      <RecentTickets
        bookings={stats?.recentBookings}
        loading={loading || refreshing}
      />
    </div>
  );
};

export default Dashboard;
