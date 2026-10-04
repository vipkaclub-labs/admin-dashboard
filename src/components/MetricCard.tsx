import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  gradientFrom: string;
  gradientTo: string;
  icon: LucideIcon;
  badge?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  gradientFrom,
  gradientTo,
  icon: Icon,
  badge,
}: MetricCardProps) => {
  const { t } = useLanguage();
  const isIncrease = changeType === 'increase';

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg shadow-stone-900/5 border border-white/15 hover:border-amber-300/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* Ambient Luxury Background Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:bg-white/15 transition-all duration-500"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10 blur-xl"></div>
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white/10 -mr-12 -mt-12 group-hover:scale-105 transition-transform duration-500"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full border border-white/10 -mr-8 -mb-8 group-hover:scale-110 transition-transform duration-500"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/80">
                {title}
              </span>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white border border-white/20 uppercase tracking-wider">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white drop-shadow-sm">
              {value}
            </p>
          </div>

          {/* Icon Badge */}
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-inner shadow-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
            <Icon className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Bottom Trend & Context */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/15">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
              isIncrease
                ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
                : 'bg-rose-500/20 text-rose-100 border-rose-400/30'
            }`}
          >
            {isIncrease ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{change}</span>
          </div>

          <span className="text-xs text-white/80 font-medium">
            {isIncrease
              ? t('pages.dashboard.increased')
              : t('pages.dashboard.decreased')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
