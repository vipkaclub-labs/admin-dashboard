import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrafficSourceDto } from '../types/api';

const DEFAULT_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#ec4899'];

interface TrafficSourcesChartProps {
  data?: TrafficSourceDto[];
  loading?: boolean;
}

const TrafficSourcesChart = ({ data, loading }: TrafficSourcesChartProps) => {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: t('pages.dashboard.searchEngines'), value: 30, color: '#60a5fa' },
        { name: t('pages.dashboard.directClick'), value: 30, color: '#34d399' },
        { name: t('pages.dashboard.bookmarksClick'), value: 40, color: '#fbbf24' },
      ];
    }

    return data.map((item, index) => ({
      name: item.source,
      value: item.percentage,
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      visits: item.visits,
    }));
  }, [data, t]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('pages.dashboard.trafficSources')}
        </h3>
        {loading && (
          <span className="text-xs text-purple-600 animate-pulse font-medium">
            Đang tải dữ liệu...
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`${value}%`, 'Tỷ lệ']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{item.value}%</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        title="Settings"
        className="absolute bottom-4 right-4 p-2 hover:bg-gray-100 rounded-lg text-purple-600 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TrafficSourcesChart;
