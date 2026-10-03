import { useLanguage } from '../contexts/LanguageContext';
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
    statusColor: 'bg-green-100 text-green-800',
    time: 'Hôm nay, 20:30',
    amount: '1.200.000 đ',
  },
  {
    id: 'BK-12346',
    customerName: 'Trần Thị B',
    facilityName: 'Phòng Massage 301',
    status: 'Đang sử dụng',
    statusColor: 'bg-blue-100 text-blue-800',
    time: 'Hôm nay, 19:15',
    amount: '850.000 đ',
  },
  {
    id: 'BK-12347',
    customerName: 'Lê Hoàng C',
    facilityName: 'Club VIP Lounge',
    status: 'Đã xác nhận',
    statusColor: 'bg-purple-100 text-purple-800',
    time: 'Hôm nay, 18:00',
    amount: '3.500.000 đ',
  },
];

const getStatusColor = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('complet') || s.includes('thành')) {
    return 'bg-green-100 text-green-800';
  }
  if (s.includes('active') || s.includes('using') || s.includes('dụng')) {
    return 'bg-blue-100 text-blue-800';
  }
  if (s.includes('confirm') || s.includes('nhận')) {
    return 'bg-purple-100 text-purple-800';
  }
  if (s.includes('cancel') || s.includes('hủy')) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
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
        statusColor: getStatusColor(b.status),
        time: formatBookingTime(b.startTime, b.endTime),
        amount: b.amount ? `${b.amount.toLocaleString('vi-VN')} đ` : '-',
      }))
    : DEFAULT_TICKETS;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Đặt phòng gần đây</h3>
        {loading && (
          <span className="text-xs text-purple-600 animate-pulse font-medium">
            Đang cập nhật...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phòng/Dịch vụ</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('common.status')}</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Thời gian</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã đặt</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ticket, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                      {ticket.facilityName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{ticket.facilityName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{ticket.customerName}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.statusColor}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{ticket.time}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{ticket.amount}</td>
                <td className="py-3 px-4 text-sm text-purple-600 font-mono font-medium">{ticket.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTickets;
