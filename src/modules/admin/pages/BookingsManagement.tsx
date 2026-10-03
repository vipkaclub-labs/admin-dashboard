import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
  Building,
  CreditCard,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { bookingService } from '../../../services/bookingService';
import { BookingResponseDto, BookingStatus } from '../../../types/api';

const statusConfig: Record<BookingStatus, { label: string; bg: string; text: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
  ACTIVE: { label: 'Đang diễn ra', bg: 'bg-purple-100', text: 'text-purple-800', icon: AlertCircle },
  COMPLETED: { label: 'Hoàn thành', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
};

const BookingsManagement: React.FC = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<BookingResponseDto | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const statusParam = statusFilter !== 'ALL' ? (statusFilter as BookingStatus) : undefined;
      const res = await bookingService.getBookings({
        status: statusParam,
        page,
        limit,
      });

      if (res && res.data) {
        setBookings(res.data);
        setTotal(res.total || res.data.length);
      } else {
        setBookings([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      toast.error(err.message || 'Không thể tải danh sách đặt phòng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    try {
      setActionLoading(id);
      await bookingService.updateBookingStatus(id, newStatus);
      toast.success(`Cập nhật trạng thái thành ${statusConfig[newStatus]?.label || newStatus}`);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      fetchBookings();
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered on client side by search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const query = searchQuery.toLowerCase().trim();
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(query) ||
        (b.userId && b.userId.toLowerCase().includes(query)) ||
        (b.facilityId && b.facilityId.toLowerCase().includes(query)) ||
        (b.notes && b.notes.toLowerCase().includes(query))
    );
  }, [bookings, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = total || bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;
    return { total: totalCount, pending, confirmed, completed, cancelled };
  }, [bookings, total]);

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      toast.warn('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['Mã Đặt Phòng', 'User ID', 'Facility ID', 'Bắt Đầu', 'Kết Thúc', 'Tổng Tiền (VNĐ)', 'Trạng Thái', 'Ghi Chú', 'Ngày Tạo'];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.userId,
      b.facilityId,
      new Date(b.startTime).toLocaleString('vi-VN'),
      new Date(b.endTime).toLocaleString('vi-VN'),
      b.totalAmount.toLocaleString('vi-VN'),
      b.status,
      b.notes || '',
      new Date(b.createdAt).toLocaleString('vi-VN'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map((e) => e.map(item => `"${item}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file CSV thành công');
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-purple-600" />
            Quản Lý Đặt Phòng (Bookings)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi, xác nhận và quản lý các lượt đặt bàn, phòng VIP và dịch vụ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-white text-gray-700 text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase text-gray-500">Tổng Lượt Đặt</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 bg-amber-50/30">
          <p className="text-xs font-semibold uppercase text-amber-700">Chờ Duyệt</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 bg-blue-50/30">
          <p className="text-xs font-semibold uppercase text-blue-700">Đã Xác Nhận</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 bg-green-50/30">
          <p className="text-xs font-semibold uppercase text-green-700">Hoàn Thành</p>
          <p className="text-2xl font-black text-green-600 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 bg-red-50/30">
          <p className="text-xs font-semibold uppercase text-red-700">Đã Hủy</p>
          <p className="text-2xl font-black text-red-600 mt-1">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo ID, khách, cơ sở..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-gray-100 rounded-lg">
            {['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white text-purple-700 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {st === 'ALL' ? 'Tất cả' : statusConfig[st as BookingStatus]?.label || st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-sm text-gray-500">Đang tải dữ liệu đặt phòng...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold text-lg">Chưa có lượt đặt phòng nào</p>
            <p className="text-sm text-gray-400 mt-1">Khi khách hàng đặt chỗ, danh sách sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                  <th className="py-3.5 px-4">Mã Đặt Chỗ</th>
                  <th className="py-3.5 px-4">Khách Hàng / ID</th>
                  <th className="py-3.5 px-4">Cơ Sở / Dịch Vụ</th>
                  <th className="py-3.5 px-4">Thời Gian Đặt</th>
                  <th className="py-3.5 px-4">Tổng Tiền</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBookings.map((b) => {
                  const statusInfo = statusConfig[b.status] || {
                    label: b.status,
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    icon: AlertCircle,
                  };
                  const StatusIcon = statusInfo.icon;
                  const isProcessing = actionLoading === b.id;

                  return (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-xs text-purple-700">
                        {b.id.slice(0, 8)}...
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {b.userId ? b.userId.slice(0, 10) : 'Khách vãng lai'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium truncate max-w-[150px]">{b.facilityId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <p className="font-medium text-gray-900">
                            {new Date(b.startTime).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-gray-500">
                            {new Date(b.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(b.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900">
                          {b.totalAmount.toLocaleString('vi-VN')} đ
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Details Button */}
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Actions */}
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Duyệt
                            </button>
                          )}

                          {(b.status === 'CONFIRMED' || b.status === 'ACTIVE') && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, 'COMPLETED')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Xong
                            </button>
                          )}

                          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, 'CANCELLED')}
                              disabled={isProcessing}
                              className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 bg-gray-50/50">
          <span>
            Hiển thị {filteredBookings.length} / {total} lượt đặt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs font-medium"
            >
              Trước
            </button>
            <span className="text-xs font-medium">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Chi Tiết Đặt Phòng
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Mã đặt chỗ</p>
                  <p className="font-mono font-bold text-gray-800 break-all">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Trạng thái hiện tại</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                      statusConfig[selectedBooking.status]?.bg || 'bg-gray-100'
                    } ${statusConfig[selectedBooking.status]?.text || 'text-gray-800'}`}
                  >
                    {statusConfig[selectedBooking.status]?.label || selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" /> Khách hàng ID
                  </span>
                  <span className="font-medium text-gray-800 font-mono text-xs">{selectedBooking.userId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-gray-400" /> Cơ sở ID
                  </span>
                  <span className="font-medium text-gray-800 font-mono text-xs">{selectedBooking.facilityId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> Thời gian bắt đầu
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedBooking.startTime).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> Thời gian kết thúc
                  </span>
                  <span className="font-medium text-gray-800">
                    {new Date(selectedBooking.endTime).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-gray-400" /> Tổng tiền thanh toán
                  </span>
                  <span className="font-black text-purple-700 text-base">
                    {selectedBooking.totalAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-1">
                    <FileText className="w-3.5 h-3.5" /> Ghi chú từ khách
                  </p>
                  <p className="text-gray-700 text-xs italic">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Status Change Buttons Inside Modal */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">Chuyển trạng thái nhanh:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                    disabled={selectedBooking.status === 'CONFIRMED'}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold disabled:opacity-40"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'COMPLETED')}
                    disabled={selectedBooking.status === 'COMPLETED'}
                    className="px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold disabled:opacity-40"
                  >
                    Hoàn tất
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                    disabled={selectedBooking.status === 'CANCELLED'}
                    className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold disabled:opacity-40"
                  >
                    Hủy đặt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
