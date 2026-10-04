import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrafficSourceDto } from '../types/api';

const LUXURY_PALETTE = ['#d97706', '#292524', '#059669', '#0284c7', '#7c3aed', '#e11d48'];

interface TrafficSourcesChartProps {
  data?: TrafficSourceDto[];
  loading?: boolean;
}

const TrafficSourcesChart = ({ data, loading }: TrafficSourcesChartProps) => {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: t('pages.dashboard.searchEngines'), value: 45, color: '#d97706', visits: 1840 },
        { name: t('pages.dashboard.directClick'), value: 35, color: '#292524', visits: 1420 },
        { name: t('pages.dashboard.bookmarksClick'), value: 20, color: '#059669', visits: 810 },
      ];
    }

    return data.map((item, index) => ({
      name: item.source,
      value: item.percentage,
      color: LUXURY_PALETTE[index % LUXURY_PALETTE.length],
      visits: item.visits,
    }));
  }, [data, t]);

  const totalVisits = chartData.reduce((acc, curr) => acc + (curr.visits || curr.value * 10), 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 hover:shadow-md transition-shadow relative flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                {t('pages.dashboard.trafficSources')}
              </h3>
              <p className="text-xs text-stone-600">Phân bổ kênh chuyển đổi khách hàng</p>
            </div>
          </div>

          {loading && (
            <span className="text-xs text-amber-600 animate-pulse font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Đang tải...
            </span>
          )}
        </div>

        {/* Donut Chart with Centered Metric */}
        <div className="relative py-2">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Tỷ lệ']}
                contentStyle={{
                  backgroundColor: 'rgba(28, 25, 23, 0.95)',
                  borderColor: 'rgba(217, 119, 6, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Pill */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">Tổng lượt</span>
            <span className="text-lg font-black text-stone-900 font-display">{totalVisits.toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Source breakdown list */}
      <div className="mt-4 space-y-2.5 pt-4 border-t border-stone-100">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-stone-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600 font-medium">
                {item.visits ? `${item.visits.toLocaleString('vi-VN')} lượt` : ''}
              </span>
              <span className="text-xs font-bold text-stone-900 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200/60">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficSourcesChart;
