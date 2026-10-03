import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { AccessSalesChartDto } from '../types/api';

const defaultData = [
  { month: 'JAN', CHN: 4000, USA: 2400, UK: 2400 },
  { month: 'FEB', CHN: 3000, USA: 1398, UK: 2210 },
  { month: 'MAR', CHN: 2000, USA: 9800, UK: 2290 },
  { month: 'APR', CHN: 2780, USA: 3908, UK: 2000 },
  { month: 'MAY', CHN: 1890, USA: 4800, UK: 2181 },
  { month: 'JUN', CHN: 2390, USA: 3800, UK: 2500 },
  { month: 'JUL', CHN: 3490, USA: 4300, UK: 2100 },
  { month: 'AUG', CHN: 4000, USA: 2400, UK: 2400 },
];

const SERIES_COLORS: Record<string, string> = {
  CHN: '#8b5cf6',
  USA: '#ef4444',
  UK: '#3b82f6',
  VNM: '#10b981',
  SGP: '#f59e0b',
};

const DEFAULT_SERIES = ['CHN', 'USA', 'UK'];

interface VisitSalesChartProps {
  data?: AccessSalesChartDto;
  loading?: boolean;
}

const VisitSalesChart = ({ data, loading }: VisitSalesChartProps) => {
  const { t } = useLanguage();

  const { chartData, seriesList } = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return { chartData: defaultData, seriesList: DEFAULT_SERIES };
    }

    const map = new Map<string, any>();
    const foundSeries = new Set<string>();

    data.data.forEach((item) => {
      if (!map.has(item.label)) {
        map.set(item.label, { month: item.label });
      }
      const entry = map.get(item.label);
      if (item.series) {
        entry[item.series] = item.value;
        foundSeries.add(item.series);
      } else {
        entry['value'] = item.value;
        foundSeries.add('value');
      }
    });

    const activeSeries = data.series && data.series.length > 0
      ? data.series
      : Array.from(foundSeries);

    return {
      chartData: Array.from(map.values()),
      seriesList: activeSeries.length > 0 ? activeSeries : DEFAULT_SERIES,
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('pages.dashboard.visitAndSalesStatistics')}
        </h3>
        {loading && (
          <span className="text-xs text-purple-600 animate-pulse font-medium">
            Đang tải dữ liệu...
          </span>
        )}
      </div>

      <div className="flex items-center gap-6 mb-6 flex-wrap">
        {seriesList.map((series) => (
          <div key={series} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: SERIES_COLORS[series] || '#8b5cf6' }}
            />
            <span className="text-sm text-gray-600">{series}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          {seriesList.map((series) => (
            <Bar
              key={series}
              dataKey={series}
              fill={SERIES_COLORS[series] || '#8b5cf6'}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitSalesChart;
