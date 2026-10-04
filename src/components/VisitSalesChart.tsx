import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AccessSalesChartDto } from '../types/api';

const defaultData = [
  { month: 'T1', CHN: 4000, USA: 2400, UK: 2400 },
  { month: 'T2', CHN: 3000, USA: 1398, UK: 2210 },
  { month: 'T3', CHN: 2000, USA: 9800, UK: 2290 },
  { month: 'T4', CHN: 2780, USA: 3908, UK: 2000 },
  { month: 'T5', CHN: 1890, USA: 4800, UK: 2181 },
  { month: 'T6', CHN: 2390, USA: 3800, UK: 2500 },
  { month: 'T7', CHN: 3490, USA: 4300, UK: 2100 },
  { month: 'T8', CHN: 4000, USA: 2400, UK: 2400 },
];

const SERIES_COLORS: Record<string, { fill: string; label: string }> = {
  CHN: { fill: '#d97706', label: 'Doanh thu chính' },
  USA: { fill: '#292524', label: 'Dịch vụ phụ' },
  UK: { fill: '#0284c7', label: 'Dịch vụ trực tuyến' },
  VNM: { fill: '#059669', label: 'Khách nội địa' },
  SGP: { fill: '#f59e0b', label: 'Khách quốc tế' },
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
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              {t('pages.dashboard.visitAndSalesStatistics')}
            </h3>
            <p className="text-xs text-stone-600">Thống kê lượng truy cập & doanh thu theo mốc thời gian</p>
          </div>
        </div>

        {loading ? (
          <span className="text-xs text-amber-600 animate-pulse font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            Đang tải dữ liệu...
          </span>
        ) : (
          <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full font-medium">
            30 ngày qua
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap pt-2 border-t border-stone-100">
        {seriesList.map((series) => {
          const config = SERIES_COLORS[series] || { fill: '#d97706', label: series };
          return (
            <div key={series} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/60 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: config.fill }}
              />
              <span className="font-semibold text-stone-700">{config.label}</span>
            </div>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={chartData} margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#a8a29e"
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#a8a29e"
            tick={{ fontSize: 12, fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(28, 25, 23, 0.95)',
              borderColor: 'rgba(217, 119, 6, 0.4)',
              borderRadius: '12px',
              color: '#fff',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              fontSize: '12px',
              padding: '10px 14px',
            }}
            labelStyle={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#e7e5e4', padding: '2px 0' }}
          />
          {seriesList.map((series) => {
            const config = SERIES_COLORS[series] || { fill: '#d97706', label: series };
            return (
              <Bar
                key={series}
                dataKey={series}
                name={config.label}
                fill={config.fill}
                radius={[6, 6, 0, 0]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitSalesChart;
