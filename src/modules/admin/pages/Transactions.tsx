import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  Copy,
  Check,
  Calendar,
  Plus,
  Wallet,
  ShieldCheck,
  User as UserIcon,
  X,
  RotateCcw,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { walletService, WalletTransactionItem } from '../../../services/walletService';
import { userService } from '../../../services/userService';
import { UserResponseDto } from '../../../types/api';
import { toast } from 'react-toastify';

const DEFAULT_FALLBACK_TRANSACTIONS: WalletTransactionItem[] = [
  {
    id: 'TXN-984021',
    userId: 'usr-vip-001',
    amount: 5000000,
    type: 'CREDIT',
    status: 'SUCCESS',
    referenceId: 'REF-BANK-88219',
    description: 'Nạp ví hội viên VIP Diamond qua Vietcombank Auto QR',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-001', name: 'Nguyễn Thái Sơn', email: 'thaison.vip@gmail.com' },
  },
  {
    id: 'TXN-984020',
    userId: 'usr-vip-002',
    amount: 1850000,
    type: 'DEBIT',
    status: 'SUCCESS',
    referenceId: 'BK-KARAOKE-201',
    description: 'Thanh toán dịch vụ Phòng VIP Karaoke Suite Hoàng Gia 201',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-002', name: 'Trần Minh Hoàng', email: 'hoangtm.ceo@gmail.com' },
  },
  {
    id: 'TXN-984019',
    userId: 'usr-vip-003',
    amount: 3200000,
    type: 'DEBIT',
    status: 'PENDING',
    referenceId: 'BK-SPA-VIP3',
    description: 'Tạm giữ dịch vụ Trị liệu Spa Royal Imperial 4 tay',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-003', name: 'Lê Hoàng Yến', email: 'hoangyen.le@outlook.com' },
  },
  {
    id: 'TXN-984018',
    userId: 'usr-vip-004',
    amount: 10000000,
    type: 'CREDIT',
    status: 'SUCCESS',
    referenceId: 'REF-TOPUP-9982',
    description: 'Chuyển khoản nạp thẻ thành viên Black Card qua Techcombank',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-004', name: 'Phạm Đăng Khoa', email: 'khoa.pdk@fintech.vn' },
  },
  {
    id: 'TXN-984017',
    userId: 'usr-vip-005',
    amount: 500000,
    type: 'REFUND',
    status: 'SUCCESS',
    referenceId: 'REF-RF-0091',
    description: 'Hoàn tiền cọc phòng do chuyển lịch trước 24h',
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-005', name: 'Vũ Thị Ngọc Hà', email: 'ngocha.vu@gmail.com' },
  },
  {
    id: 'TXN-984016',
    userId: 'usr-vip-006',
    amount: 750000,
    type: 'DEBIT',
    status: 'FAILED',
    referenceId: 'BK-BAR-092',
    description: 'Thanh toán đồ uống Club Lounge (Số dư ví không đủ)',
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    user: { id: 'usr-vip-006', name: 'Đoàn Quang Khải', email: 'khai.dq@invest.com' },
  },
];

const PRESET_AMOUNTS = [100000, 500000, 1000000, 2000000, 5000000, 10000000];

export const Transactions = () => {
  const { t, language } = useLanguage();

  // State management
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Modals & UI helpers
  const [selectedTxn, setSelectedTxn] = useState<WalletTransactionItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Adjustment Modal state
  const [usersList, setUsersList] = useState<UserResponseDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [inputMode, setInputMode] = useState<'select' | 'manual'>('select');
  const [adjustTargetUserId, setAdjustTargetUserId] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState<number>(1000000);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjusting, setAdjusting] = useState<boolean>(false);
  const [userLiveBalance, setUserLiveBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState<boolean>(false);

  // Fetch Transactions
  const fetchTransactions = useCallback(
    async (isRefresh = false) => {
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
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        });

        if (response && response.items && response.items.length > 0) {
          setTransactions(response.items);
          setTotalItems(response.total);
          setIsLiveApi(true);
        } else if (
          response &&
          response.items &&
          response.items.length === 0 &&
          (statusFilter !== 'ALL' || typeFilter !== 'ALL' || startDate || endDate)
        ) {
          setTransactions([]);
          setTotalItems(0);
          setIsLiveApi(true);
        } else {
          // Database currently empty -> Use realistic VIP fallback mock records
          setTransactions(DEFAULT_FALLBACK_TRANSACTIONS);
          setTotalItems(DEFAULT_FALLBACK_TRANSACTIONS.length);
          setIsLiveApi(false);
        }
      } catch (err: any) {
        console.warn('Could not fetch transactions from API, using fallback data:', err);
        setError(err?.message || 'Không thể kết nối đến máy chủ API Sổ cái');
        setTransactions(DEFAULT_FALLBACK_TRANSACTIONS);
        setTotalItems(DEFAULT_FALLBACK_TRANSACTIONS.length);
        setIsLiveApi(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, pageSize, statusFilter, typeFilter, startDate, endDate]
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Load user list for manual adjustment modal with dynamic search
  const loadUsersForModal = useCallback(async (search = '') => {
    setLoadingUsers(true);
    try {
      const res = await userService.getUsers({
        page: 1,
        page_size: 50,
        search: search.trim() || undefined,
      });
      const users = res?.data || (res as any)?.users || [];
      if (Array.isArray(users)) {
        setUsersList(users);
      }
    } catch {
      // Fallback empty users
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handleOpenAdjustModal = () => {
    setIsAdjustModalOpen(true);
    setUserSearchQuery('');
    loadUsersForModal('');
  };

  const handleOpenAdjustModalForUser = (userId: string) => {
    setAdjustTargetUserId(userId);
    setInputMode('manual');
    setIsAdjustModalOpen(true);
  };

  // Debounced user search inside modal
  useEffect(() => {
    if (!isAdjustModalOpen || inputMode !== 'select') return;
    const timer = setTimeout(() => {
      loadUsersForModal(userSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearchQuery, isAdjustModalOpen, inputMode, loadUsersForModal]);

  // Fetch balance for selected user in modal
  useEffect(() => {
    if (!adjustTargetUserId) {
      setUserLiveBalance(null);
      return;
    }
    const fetchUserBalance = async () => {
      setCheckingBalance(true);
      try {
        const balRes = await walletService.getBalance(adjustTargetUserId);
        setUserLiveBalance(balRes?.balance ?? 0);
      } catch {
        setUserLiveBalance(null);
      } finally {
        setCheckingBalance(false);
      }
    };
    fetchUserBalance();
  }, [adjustTargetUserId]);

  // Handle Adjustment Submit
  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetUserId.trim()) {
      toast.error('Vui lòng chọn hoặc nhập ID thành viên');
      return;
    }
    if (!adjustAmount || adjustAmount <= 0) {
      toast.error('Số tiền điều chỉnh phải lớn hơn 0 VNĐ');
      return;
    }

    setAdjusting(true);
    try {
      if (adjustType === 'CREDIT') {
        await walletService.creditBalance({
          user_id: adjustTargetUserId.trim(),
          amount: Number(adjustAmount),
        });
        toast.success(
          language === 'vi'
            ? `Đã nạp thành công +${adjustAmount.toLocaleString('vi-VN')} VNĐ vào ví thành viên!`
            : `Successfully credited +${adjustAmount.toLocaleString()} VND to wallet!`
        );
      } else {
        await walletService.debitBalance({
          user_id: adjustTargetUserId.trim(),
          amount: Number(adjustAmount),
        });
        toast.success(
          language === 'vi'
            ? `Đã trừ thành công -${adjustAmount.toLocaleString('vi-VN')} VNĐ từ ví thành viên!`
            : `Successfully debited -${adjustAmount.toLocaleString()} VND from wallet!`
        );
      }

      setIsAdjustModalOpen(false);
      setAdjustReason('');
      setAdjustAmount(1000000);
      fetchTransactions(true);
    } catch (err: any) {
      toast.error(err?.message || 'Thao tác điều chỉnh số dư thất bại');
    } finally {
      setAdjusting(false);
    }
  };

  // Filtered transactions (with search query)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const idMatch = txn.id?.toLowerCase().includes(q);
      const userMatch = (
        txn.user?.name ||
        txn.userName ||
        (txn as any).customer ||
        txn.userId ||
        ''
      )
        .toLowerCase()
        .includes(q);
      const emailMatch = (txn.user?.email || txn.userEmail || '').toLowerCase().includes(q);
      const descMatch = (
        txn.description ||
        txn.referenceId ||
        (txn as any).venue ||
        ''
      )
        .toLowerCase()
        .includes(q);
      return idMatch || userMatch || emailMatch || descMatch;
    });
  }, [transactions, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    let creditSum = 0;
    let debitSum = 0;
    let successCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    transactions.forEach((txn) => {
      const amt = Number(txn.amount) || 0;
      const isCredit = ['CREDIT', 'DEPOSIT', 'TOPUP', 'REFUND'].includes(
        String(txn.type || '').toUpperCase()
      );
      const isSuccess = ['SUCCESS', 'COMPLETED'].includes(
        String(txn.status || '').toUpperCase()
      );
      const isPending = String(txn.status || '').toUpperCase() === 'PENDING';
      const isFailed = ['FAILED', 'REJECTED'].includes(
        String(txn.status || '').toUpperCase()
      );

      if (isCredit) {
        creditSum += amt;
      } else {
        debitSum += amt;
      }

      if (isSuccess) successCount++;
      if (isPending) pendingCount++;
      if (isFailed) failedCount++;
    });

    return {
      creditSum,
      debitSum,
      successCount,
      pendingCount,
      failedCount,
      totalCount: transactions.length,
    };
  }, [transactions]);

  // Helper for copy to clipboard
  const handleCopy = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.info('Đã sao chép vào bộ nhớ tạm: ' + text);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export CSV
  const handleExport = () => {
    try {
      const headers = [
        'Mã GD',
        'Khách hàng',
        'Email',
        'User ID',
        'Loại giao dịch',
        'Số tiền (VNĐ)',
        'Trạng thái',
        'Mã tham chiếu',
        'Nội dung / Mô tả',
        'Thời gian ghi nhận',
      ];
      const rows = filteredTransactions.map((txn) => [
        txn.id,
        txn.user?.name || txn.userName || (txn as any).customer || 'Khách vãng lai',
        txn.user?.email || txn.userEmail || '',
        txn.userId || '',
        txn.type,
        txn.amount,
        txn.status,
        txn.referenceId || '',
        txn.description || (txn as any).venue || '',
        txn.createdAt,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [
          headers.join(','),
          ...rows.map((r) =>
            r.map((field) => `"${String(field || '').replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `VIPKA_Ledger_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(
        language === 'vi' ? 'Xuất báo cáo sổ cái thành công' : 'Ledger export completed successfully'
      );
    } catch {
      toast.error(language === 'vi' ? 'Xuất báo cáo thất bại' : 'Export failed');
    }
  };

  // Type identification
  const isPositiveType = (type: string) => {
    const t = String(type || '').toUpperCase();
    return t === 'CREDIT' || t === 'DEPOSIT' || t === 'TOPUP' || t === 'REFUND';
  };

  const getTransactionTypeBadge = (type: string) => {
    const tStr = String(type || '').toUpperCase();
    if (tStr === 'CREDIT' || tStr === 'DEPOSIT' || tStr === 'TOPUP') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nạp tiền</span>
        </span>
      );
    }
    if (tStr === 'REFUND') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/80">
          <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
          <span>Hoàn tiền</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/80">
        <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
        <span>Chi tiêu</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toUpperCase();
    if (s === 'SUCCESS' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{t('pages.transactions.statusCompleted') || 'Thành công'}</span>
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>{t('pages.transactions.statusPending') || 'Đang xử lý'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        <span>{t('pages.transactions.statusRejected') || 'Thất bại'}</span>
      </span>
    );
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '---';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', {
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

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    startDate !== '' ||
    endDate !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 bg-[#faf8f5] p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Top Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-7 mb-8 border border-amber-500/20 shadow-xl shadow-stone-950/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                VIPKA Treasury & Financial Ledger
              </span>
              {isLiveApi ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sổ cái trực tuyến (Live API)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Chế độ đồng bộ dự phòng
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white mb-2">
              {t('pages.transactions.title') || 'Lịch Sử Giao Dịch & Sổ Cái'}
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl">
              {t('pages.transactions.description') ||
                'Hệ thống quản lý, đối soát thanh toán và điều chỉnh hạn mức ví cho thành viên VIP.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchTransactions(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-stone-700/80 bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-all text-xs sm:text-sm font-semibold shadow-sm disabled:opacity-50"
              title="Làm mới sổ cái"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-400' : 'text-stone-300'}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all text-xs sm:text-sm font-semibold shadow-sm"
              title="Xuất file CSV"
            >
              <Download className="w-4 h-4" />
              <span>{t('pages.transactions.exportReport') || 'Xuất CSV'}</span>
            </button>

            <button
              onClick={handleOpenAdjustModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Điều chỉnh số dư</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connectivity Alert if API had error */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-3 text-amber-900 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Đang hiển thị bản ghi mô phỏng dự phòng: </span>
              <span className="text-stone-700">{error}</span>
            </div>
          </div>
          <button
            onClick={() => fetchTransactions(true)}
            className="text-xs font-bold text-amber-800 hover:underline px-3 py-1 bg-amber-100/70 rounded-lg"
          >
            Thử kết nối lại
          </button>
        </div>
      )}

      {/* Executive Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Total records */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-400 to-stone-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {t('pages.transactions.totalTransactionsToday') || 'Tổng số giao dịch'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            {totalItems.toLocaleString('vi-VN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
            <span className="font-bold text-emerald-600">{stats.successCount} thành công</span>
            <span>•</span>
            <span className="font-bold text-amber-600">{stats.pendingCount} chờ duyệt</span>
          </div>
        </div>

        {/* Total Inflow (Credit) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Tổng dòng tiền nạp vào
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
            +{stats.creditSum.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-emerald-700">VNĐ</span>
          </div>
          <div className="text-xs text-emerald-700/80 mt-2 font-medium">
            Nạp tiền ví & Hoàn trả tích lũy
          </div>
        </div>

        {/* Total Outflow (Debit) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Tổng chi tiêu dịch vụ
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            -{stats.debitSum.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-stone-500">VNĐ</span>
          </div>
          <div className="text-xs text-stone-500 mt-2 font-medium">
            Đặt phòng Karaoke, Spa & Thức uống
          </div>
        </div>

        {/* Pending count */}
        <div
          onClick={() => {
            setStatusFilter('PENDING');
            setCurrentPage(1);
          }}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {t('pages.transactions.pendingProcessing') || 'Giao dịch chờ duyệt'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">
            {stats.pendingCount}
          </div>
          <div className="text-xs text-amber-700/80 mt-2 font-medium flex items-center gap-1">
            <span>Nhấn để lọc giao dịch chờ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Mã GD, Khách hàng, Email, Số phòng, Mã tham chiếu..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-800 placeholder-stone-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Select */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-700 font-medium"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="SUCCESS">Thành công (SUCCESS)</option>
                <option value="PENDING">Chờ duyệt (PENDING)</option>
                <option value="FAILED">Thất bại / Hủy (FAILED)</option>
              </select>
            </div>

            {/* Type Select */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-700 font-medium"
            >
              <option value="ALL">Tất cả loại giao dịch</option>
              <option value="CREDIT">Nạp ví (CREDIT)</option>
              <option value="DEBIT">Chi tiêu (DEBIT)</option>
              <option value="REFUND">Hoàn tiền (REFUND)</option>
            </select>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-transparent text-stone-700 focus:outline-none"
                title="Từ ngày"
              />
              <span className="text-stone-400 text-xs">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-transparent text-stone-700 focus:outline-none"
                title="Đến ngày"
              />
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition"
                title="Đặt lại bộ lọc"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50/80 border-b border-stone-200/60">
              <tr>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Thành viên VIP
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Loại GD
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Số tiền phát sinh
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Diễn giải / Tham chiếu
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-stone-600 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-stone-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
                    <span className="text-sm font-medium">Đang tải dữ liệu sổ cái giao dịch...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-stone-500">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mx-auto mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-base font-bold text-stone-800">Không tìm thấy bản ghi nào</p>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                      Không có giao dịch nào phù hợp với bộ lọc hiện tại. Thử thay đổi từ khóa tìm kiếm hoặc ngày lọc.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition"
                      >
                        Đặt lại bộ lọc
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const displayName =
                    txn.user?.name ||
                    txn.userName ||
                    (txn as any).customer ||
                    txn.userId ||
                    'Khách VIP';
                  const displayEmail = txn.user?.email || txn.userEmail || '';
                  const desc = txn.description || (txn as any).venue || 'Giao dịch hệ thống';
                  const isPositive = isPositiveType(txn.type);
                  const initials = displayName
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => {
                        setSelectedTxn(txn);
                        setIsDetailModalOpen(true);
                      }}
                      className="hover:bg-amber-50/20 transition-colors cursor-pointer group"
                    >
                      {/* Transaction ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-stone-800 group-hover:text-amber-700 transition">
                            {txn.id}
                          </span>
                          <button
                            onClick={(e) => handleCopy(txn.id, e)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded transition opacity-0 group-hover:opacity-100"
                            title="Sao chép mã"
                          >
                            {copiedId === txn.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {txn.referenceId && (
                          <div className="text-[11px] font-mono text-stone-400 truncate max-w-[140px]">
                            Ref: {txn.referenceId}
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                            {initials || 'VIP'}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-800 transition">
                              {displayName}
                            </div>
                            {displayEmail && (
                              <div className="text-[11px] text-stone-400 max-w-[180px] truncate">
                                {displayEmail}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getTransactionTypeBadge(txn.type)}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-extrabold ${
                            isPositive ? 'text-emerald-600' : 'text-stone-900'
                          }`}
                        >
                          {isPositive ? '+' : '-'}
                          {Number(txn.amount || 0).toLocaleString('vi-VN')}{' '}
                          <span className="text-xs font-semibold text-stone-400">VNĐ</span>
                        </div>
                      </td>

                      {/* Description / Reference */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs text-stone-700 font-medium truncate" title={desc}>
                          {desc}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(txn.status)}
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-stone-500 font-mono">
                        {formatDateTime(txn.createdAt || (txn as any).date)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAdjustModalForUser(txn.userId);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition"
                            title="Điều chỉnh số dư ví thành viên"
                          >
                            <Wallet className="w-3.5 h-3.5 text-amber-700" />
                            <span className="hidden xl:inline">Sổ cái</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTxn(txn);
                              setIsDetailModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100/70 hover:text-amber-900 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-500" />
                            <span>Chi tiết</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Executive Pagination Bar */}
        <div className="px-6 py-4 border-t border-stone-200/80 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Hiển thị <span className="font-bold text-stone-800">{filteredTransactions.length}</span> trên tổng số{' '}
            <span className="font-bold text-stone-800">{totalItems}</span> giao dịch đã ghi nhận
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1 || loading}
              className="flex items-center gap-1 px-3 py-1.5 border border-stone-300 rounded-xl hover:bg-white text-stone-700 text-xs font-semibold disabled:opacity-40 transition shadow-xs"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-800 shadow-xs">
              Trang {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={filteredTransactions.length < pageSize || loading}
              className="flex items-center gap-1 px-3 py-1.5 border border-stone-300 rounded-xl hover:bg-white text-stone-700 text-xs font-semibold disabled:opacity-40 transition shadow-xs"
              title="Trang tiếp"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Transaction Detail Modal */}
      {isDetailModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full border border-amber-500/20 shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 border-b border-amber-500/20">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Biên lai giao dịch VIP
                </span>
                {getStatusBadge(selectedTxn.status)}
              </div>
              <h3 className="text-xl font-extrabold font-display text-white">
                Mã GD: {selectedTxn.id}
              </h3>
              <p className="text-xs text-stone-300 mt-1 font-mono">
                {formatDateTime(selectedTxn.createdAt)}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Highlight Amount Box */}
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-200/60 text-center">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Giá trị giao dịch
                </span>
                <div
                  className={`text-3xl font-black font-display ${
                    isPositiveType(selectedTxn.type) ? 'text-emerald-600' : 'text-stone-900'
                  }`}
                >
                  {isPositiveType(selectedTxn.type) ? '+' : '-'}
                  {Number(selectedTxn.amount || 0).toLocaleString('vi-VN')} VNĐ
                </div>
                <div className="mt-2 flex justify-center">
                  {getTransactionTypeBadge(selectedTxn.type)}
                </div>
              </div>

              {/* Transaction Key Details Grid */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 text-xs font-medium">Khách hàng / Chủ ví</span>
                  <span className="font-bold text-stone-800 text-right">
                    {selectedTxn.user?.name ||
                      selectedTxn.userName ||
                      (selectedTxn as any).customer ||
                      selectedTxn.userId}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 text-xs font-medium">Email liên kết</span>
                  <span className="font-mono text-xs text-stone-700">
                    {selectedTxn.user?.email || selectedTxn.userEmail || 'Chưa cập nhật'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 text-xs font-medium">User ID</span>
                  <span className="font-mono text-xs text-stone-600 flex items-center gap-1">
                    {selectedTxn.userId}
                    <button
                      onClick={() => handleCopy(selectedTxn.userId)}
                      className="text-stone-400 hover:text-amber-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </span>
                </div>

                {selectedTxn.referenceId && (
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500 text-xs font-medium">Mã tham chiếu (Ref)</span>
                    <span className="font-mono text-xs font-bold text-amber-700">
                      {selectedTxn.referenceId}
                    </span>
                  </div>
                )}

                <div className="py-2 border-b border-stone-100">
                  <span className="text-stone-500 text-xs font-medium block mb-1">
                    Nội dung giao dịch
                  </span>
                  <div className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    {selectedTxn.description || (selectedTxn as any).venue || 'Không có mô tả chi tiết'}
                  </div>
                </div>

                {/* Metadata JSON Inspector if available */}
                {selectedTxn.metadata && Object.keys(selectedTxn.metadata).length > 0 && (
                  <div className="pt-2">
                    <span className="text-stone-500 text-xs font-medium block mb-1">
                      Dữ liệu mở rộng (Metadata Payload)
                    </span>
                    <pre className="text-[11px] font-mono bg-stone-900 text-amber-300 p-3 rounded-xl overflow-x-auto max-h-36">
                      {JSON.stringify(selectedTxn.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-stone-50/80 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedTxn.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã GD</span>
                </button>
                <button
                  onClick={() => {
                    const uid = selectedTxn.userId;
                    setIsDetailModalOpen(false);
                    handleOpenAdjustModalForUser(uid);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition shadow-2xs"
                >
                  <Wallet className="w-3.5 h-3.5 text-amber-700" />
                  <span>Điều chỉnh ví thành viên</span>
                </button>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Manual Balance Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-md w-full border border-amber-500/20 shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 border-b border-amber-500/20">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Sổ Cái Quản Trị
                </span>
              </div>
              <h3 className="text-xl font-extrabold font-display text-white">
                Điều chỉnh số dư thành viên
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Nạp hoặc trừ tiền trực tiếp vào tài khoản ví người dùng VIP
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleExecuteAdjustment} className="p-6 space-y-4">
              {/* Select or Enter User ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Thành viên VIP nhận điều chỉnh *
                  </label>
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setInputMode('select')}
                      className={`px-2 py-0.5 rounded-md transition ${
                        inputMode === 'select'
                          ? 'bg-white text-stone-900 shadow-xs font-bold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Chọn từ danh sách
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('manual')}
                      className={`px-2 py-0.5 rounded-md transition ${
                        inputMode === 'manual'
                          ? 'bg-white text-stone-900 shadow-xs font-bold'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Nhập mã UUID
                    </button>
                  </div>
                </div>

                {inputMode === 'select' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên, email, username..."
                        className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                      />
                      {loadingUsers && (
                        <Loader2 className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-600 animate-spin" />
                      )}
                    </div>

                    <select
                      value={adjustTargetUserId}
                      onChange={(e) => setAdjustTargetUserId(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-800 font-medium"
                      required
                    >
                      <option value="">-- Chọn thành viên ({usersList.length} người) --</option>
                      {usersList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name || (u as any).username || 'Khách'} - {u.email} ({u.id.substring(0, 8)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={adjustTargetUserId}
                    onChange={(e) => setAdjustTargetUserId(e.target.value)}
                    placeholder="Nhập User UUID (ví dụ: 4f4bcf82-748c-4c8e-9584-dabaeec503cc)"
                    className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-800 font-mono"
                    required
                  />
                )}

                {/* Live balance & projected balance indicator */}
                {adjustTargetUserId && (
                  <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 font-medium">Số dư ví hiện tại:</span>
                      <span className="font-extrabold text-amber-900 font-mono">
                        {checkingBalance ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 inline" />
                        ) : userLiveBalance !== null ? (
                          `${userLiveBalance.toLocaleString('vi-VN')} VNĐ`
                        ) : (
                          'Đang tải...'
                        )}
                      </span>
                    </div>

                    {userLiveBalance !== null && adjustAmount > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/50">
                        <span className="text-stone-600 font-medium">Dự kiến sau điều chỉnh:</span>
                        <span
                          className={`font-black font-mono ${
                            adjustType === 'CREDIT'
                              ? 'text-emerald-700'
                              : userLiveBalance - adjustAmount < 0
                              ? 'text-rose-600'
                              : 'text-stone-900'
                          }`}
                        >
                          {(adjustType === 'CREDIT'
                            ? userLiveBalance + adjustAmount
                            : userLiveBalance - adjustAmount
                          ).toLocaleString('vi-VN')}{' '}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {adjustType === 'DEBIT' && userLiveBalance !== null && userLiveBalance - adjustAmount < 0 && (
                      <div className="text-[11px] font-bold text-rose-600 pt-0.5">
                        ⚠️ Cảnh báo: Số tiền trừ vượt quá số dư hiện có trong ví thành viên.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Adjustment Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Thao tác số dư *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    <span>Nạp tiền (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                      adjustType === 'DEBIT'
                        ? 'bg-rose-50 text-rose-800 border-rose-400 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    <span>Trừ tiền (-)</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Số tiền điều chỉnh (VNĐ) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full pl-3 pr-16 py-2.5 text-base font-extrabold rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 text-stone-900 font-display"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    VNĐ
                  </span>
                </div>
                <div className="text-right mt-1 text-xs font-bold text-amber-700">
                  {adjustAmount.toLocaleString('vi-VN')} VNĐ
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAdjustAmount(amt)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition ${
                        adjustAmount === amt
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      +{amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Lý do / Căn cứ điều chỉnh
                </label>
                <textarea
                  rows={2}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ghi chú đối soát (ví dụ: Thưởng nâng hạng VIP Diamond, đền bù lỗi...)"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  disabled={adjusting}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {adjusting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{adjusting ? 'Đang thực hiện...' : 'Xác nhận điều chỉnh'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
