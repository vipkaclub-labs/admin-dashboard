import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { walletService, WalletTransactionItem } from '../../../services/walletService';
import { toast } from 'react-toastify';

const DEFAULT_FALLBACK_TRANSACTIONS: WalletTransactionItem[] = [
  { id: 'TXN001', userId: 'user-001', amount: 500000, type: 'CREDIT', status: 'SUCCESS', referenceId: 'REF-BOOKING-01', description: 'Nạp ví - Karaoke VIP 201', createdAt: '2024-05-20 14:30:00', user: { id: 'user-001', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' } },
  { id: 'TXN002', userId: 'user-002', amount: 800000, type: 'DEBIT', status: 'PENDING', referenceId: 'REF-BOOKING-02', description: 'Thanh toán dịch vụ Massage Spa 301', createdAt: '2024-05-20 13:15:00', user: { id: 'user-002', name: 'Trần Thị B', email: 'tranthib@gmail.com' } },
  { id: 'TXN003', userId: 'user-003', amount: 2000000, type: 'CREDIT', status: 'SUCCESS', referenceId: 'REF-VIP-03', description: 'Nạp ví qua ngân hàng', createdAt: '2024-05-20 12:00:00', user: { id: 'user-003', name: 'Phạm Thị D', email: 'phamthid@gmail.com' } },
  { id: 'TXN004', userId: 'user-001', amount: 500000, type: 'DEBIT', status: 'SUCCESS', referenceId: 'REF-SERVICE-04', description: 'Đặt phòng Karaoke VIP 201', createdAt: '2024-05-20 11:45:00', user: { id: 'user-001', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' } },
  { id: 'TXN005', userId: 'user-004', amount: 300000, type: 'REFUND', status: 'FAILED', referenceId: 'REF-REFUND-05', description: 'Hoàn tiền hủy phòng', createdAt: '2024-05-20 10:20:00', user: { id: 'user-004', name: 'Lê Văn C', email: 'levanc@gmail.com' } },
];

const Transactions = () => {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await walletService.getAllTransactions({
        page: currentPage,
        limit: pageSize,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
      });

      if (response && response.items && response.items.length > 0) {
        setTransactions(response.items);
        setTotalItems(response.total);
      } else if (response && response.items && response.items.length === 0 && (statusFilter !== 'ALL' || typeFilter !== 'ALL')) {
        setTransactions([]);
        setTotalItems(0);
      } else {
        // Fallback to sample data if database has no transaction records yet
        setTransactions(DEFAULT_FALLBACK_TRANSACTIONS);
        setTotalItems(DEFAULT_FALLBACK_TRANSACTIONS.length);
      }
    } catch (err: any) {
      console.warn('Could not fetch transactions from API, using fallback data:', err);
      setError(err?.message || 'Không thể kết nối đến máy chủ');
      setTransactions(DEFAULT_FALLBACK_TRANSACTIONS);
      setTotalItems(DEFAULT_FALLBACK_TRANSACTIONS.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, pageSize, statusFilter, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExport = () => {
    try {
      const headers = ['Mã GD', 'Khách hàng', 'Email', 'Loại', 'Số tiền (VND)', 'Trạng thái', 'Mô tả', 'Thời gian'];
      const rows = filteredTransactions.map(txn => [
        txn.id,
        txn.user?.name || txn.userName || txn.userId,
        txn.user?.email || txn.userEmail || '',
        txn.type,
        txn.amount,
        txn.status,
        txn.description || txn.referenceId || '',
        txn.createdAt,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
        + [headers.join(','), ...rows.map(r => r.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(language === 'vi' ? 'Xuất báo cáo thành công' : 'Export completed successfully');
    } catch {
      toast.error(language === 'vi' ? 'Xuất báo cáo thất bại' : 'Export failed');
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const idMatch = txn.id?.toLowerCase().includes(q);
    const userMatch = (txn.user?.name || txn.userName || txn.userId || '').toLowerCase().includes(q);
    const emailMatch = (txn.user?.email || txn.userEmail || '').toLowerCase().includes(q);
    const descMatch = (txn.description || txn.referenceId || '').toLowerCase().includes(q);
    return idMatch || userMatch || emailMatch || descMatch;
  });

  // Calculate live stats
  const totalVolume = transactions.reduce((acc, txn) => acc + (Number(txn.amount) || 0), 0);
  const completedCount = transactions.filter(t => ['SUCCESS', 'COMPLETED', 'completed', 'success'].includes(t.status)).length;
  const pendingCount = transactions.filter(t => ['PENDING', 'pending'].includes(t.status)).length;
  const failedCount = transactions.filter(t => ['FAILED', 'REJECTED', 'rejected', 'failed'].includes(t.status)).length;

  const isPositiveType = (type: string) => {
    const t = String(type || '').toUpperCase();
    return t === 'CREDIT' || t === 'DEPOSIT' || t === 'REFUND';
  };

  const getTransactionIcon = (type: string) => {
    if (isPositiveType(type)) {
      return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-rose-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (isPositiveType(type)) {
      return 'text-emerald-600';
    }
    return 'text-rose-600';
  };

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toUpperCase();
    if (s === 'SUCCESS' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {t('pages.transactions.statusCompleted') || 'Thành công'}
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          {t('pages.transactions.statusPending') || 'Chờ xử lý'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
        {t('pages.transactions.statusRejected') || 'Thất bại'}
      </span>
    );
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '---';
    try {
      return new Date(dateStr).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('pages.transactions.title')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.transactions.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTransactions(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            {t('pages.transactions.exportReport')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div className="flex-1">
            <span className="font-semibold">Thông báo kết nối API: </span>
            {error}. Đang hiển thị bản ghi mô phỏng dự phòng.
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.transactions.totalTransactionsToday')}</p>
          <p className="text-2xl font-bold text-gray-800">{totalItems.toLocaleString('vi-VN')}</p>
          <span className="text-xs text-gray-400 mt-1 block">Tổng bản ghi đã ghi nhận</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.transactions.totalRevenue')}</p>
          <p className="text-2xl font-bold text-emerald-600">{totalVolume.toLocaleString('vi-VN')} VNĐ</p>
          <span className="text-xs text-emerald-600/70 mt-1 block">{completedCount} giao dịch thành công</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.transactions.pendingProcessing')}</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <span className="text-xs text-amber-600/70 mt-1 block">Đang chờ cổng xử lý</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.transactions.totalRefund')}</p>
          <p className="text-2xl font-bold text-rose-600">{failedCount}</p>
          <span className="text-xs text-rose-600/70 mt-1 block">Thất bại / Đã từ chối</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('pages.transactions.searchTransactionPlaceholder') || 'Tìm kiếm theo mã GD, người dùng, email, mô tả...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="SUCCESS">Thành công (SUCCESS)</option>
                <option value="PENDING">Chờ duyệt (PENDING)</option>
                <option value="FAILED">Thất bại / Hủy (FAILED)</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            >
              <option value="ALL">Tất cả loại giao dịch</option>
              <option value="CREDIT">Nạp tiền (CREDIT)</option>
              <option value="DEBIT">Chi tiêu / Trừ ví (DEBIT)</option>
              <option value="REFUND">Hoàn tiền (REFUND)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.transactions.transactionCode')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.transactions.customer')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.type')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.transactions.amount')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mô tả / Tham chiếu</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.transactions.time')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>Đang tải dữ liệu giao dịch...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const displayName = txn.user?.name || (txn as any).userName || (txn as any).customer || txn.userId;
                  const displayEmail = txn.user?.email || (txn as any).userEmail || '';
                  const desc = txn.description || (txn as any).venue || txn.referenceId || '---';

                  return (
                    <tr key={txn.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600 font-semibold">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{displayName}</div>
                        {displayEmail && <div className="text-xs text-gray-400">{displayEmail}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {getTransactionIcon(txn.type)}
                          <span className={`text-xs font-semibold uppercase ${getTransactionColor(txn.type)}`}>
                            {txn.type}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getTransactionColor(txn.type)}`}>
                        {isPositiveType(txn.type) ? '+' : '-'}{Number(txn.amount || 0).toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={desc}>
                        {desc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(txn.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                        {formatDateTime(txn.createdAt || (txn as any).date)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-semibold text-gray-700">{filteredTransactions.length}</span> / <span className="font-semibold text-gray-700">{totalItems}</span> giao dịch
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
              Trang {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={filteredTransactions.length < pageSize || loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-white text-gray-600 disabled:opacity-40 transition"
              title="Trang tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
