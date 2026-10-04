import { useLanguage } from '../contexts/LanguageContext';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { RecentBookingDto } from '../types/api';

interface RecentTicketsProps {
  bookings?: RecentBookingDto[];
  loading?: boolean;
}

const DEFAULT_TICKETS = [
  {
    id: 'BK-12345',
    customerName: 'Nguyễn Văn A',
    facilityName: 'Phòng VIP 201',
    status: 'Hoàn thành',
    statusCode: 'done',
    time: 'Hôm nay, 20:30',
    amount: '1.200.000 đ',
  },
  {
    id: 'BK-12346',
    customerName: 'Trần Thị B',
    facilityName: 'Phòng Massage 301',
    status: 'Đang sử dụng',
    statusCode: 'active',
    time: 'Hôm nay, 19:15',
    amount: '850.000 đ',
  },
  {
    id: 'BK-12347',
    customerName: 'Lê Hoàng C',
    facilityName: 'Club VIP Lounge',
    status: 'Đã xác nhận',
    statusCode: 'confirmed',
    time: 'Hôm nay, 18:00',
    amount: '3.500.000 đ',
  },
  {
    id: 'BK-12348',
    customerName: 'Phạm Minh D',
    facilityName: 'Phòng Cigar & Wine',
    status: 'Đã xác nhận',
    statusCode: 'confirmed',
    time: 'Hôm nay, 17:30',
    amount: '4.800.000 đ',
  },
];

const getStatusBadge = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('complet') || s.includes('thành')) {
    return {
      dotColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    };
  }
  if (s.includes('active') || s.includes('using') || s.includes('dụng')) {
    return {
      dotColor: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300/80',
    };
  }
  if (s.includes('confirm') || s.includes('nhận')) {
    return {
      dotColor: 'bg-sky-500',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
    };
  }
  if (s.includes('cancel') || s.includes('hủy')) {
    return {
      dotColor: 'bg-rose-500',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
    };
  }
  return {
    dotColor: 'bg-stone-400',
    badgeClass: 'bg-stone-50 text-stone-700 border-stone-200/80',
  };
};

const formatBookingTime = (startTime?: string, endTime?: string) => {
  if (!startTime) return 'N/A';
  try {
    const s = new Date(startTime);
    const dateStr = s.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const timeStr = s.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    if (endTime) {
      const e = new Date(endTime);
      const endStr = e.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `${dateStr}, ${timeStr} - ${endStr}`;
    }
    return `${dateStr}, ${timeStr}`;
  } catch {
    return startTime;
  }
};

const RecentTickets = ({ bookings, loading }: RecentTicketsProps) => {
  const { t } = useLanguage();

  const items = bookings && bookings.length > 0
    ? bookings.map((b) => ({
        id: b.id ? (b.id.length > 8 ? b.id.substring(0, 8).toUpperCase() : b.id) : 'N/A',
        customerName: b.customerName || 'Khách vãng lai',
        facilityName: b.facilityName || 'Dịch vụ VIP',
        status: b.status || 'Đã xác nhận',
        time: formatBookingTime(b.startTime, b.endTime),
        amount: b.amount ? `${b.amount.toLocaleString('vi-VN')} đ` : '-',
      }))
    : DEFAULT_TICKETS;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Đặt phòng & Dịch vụ gần đây
            </h3>
            <p className="text-xs text-stone-600">Danh sách các lượt đặt dịch vụ mới nhất trong hệ thống</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <span className="text-xs text-amber-600 animate-pulse font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Đang cập nhật...
            </span>
          )}

          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50/60 hover:bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-200/60 transition-all"
          >
            <span>{t('common.viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-100">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50/75 border-b border-stone-200/60">
              <th className="text-left py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Phòng / Dịch vụ
              </th>
              <th className="text-left py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="text-left py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                {t('common.status')}
              </th>
              <th className="text-left py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="text-left py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="text-right py-3.5 px-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Mã đặt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((ticket, index) => {
              const statusStyle = getStatusBadge(ticket.status);
              return (
                <tr
                  key={index}
                  className="hover:bg-amber-50/30 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-bold flex items-center justify-center text-xs shadow-sm shadow-amber-500/20 flex-shrink-0">
                        {ticket.facilityName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {ticket.facilityName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-medium text-stone-700">
                    {ticket.customerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`}></span>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-stone-600">
                    {ticket.time}
                  </td>
                  <td className="py-3.5 px-4 text-sm font-bold text-stone-900 font-display">
                    {ticket.amount}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-amber-200 transition-colors">
                      {ticket.id}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTickets;
