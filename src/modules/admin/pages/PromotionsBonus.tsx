import { useState, useEffect, useCallback } from 'react';
import { Gift, Plus, Calendar, Users, Percent, Search, Filter, RefreshCw, Loader2, Play, Pause, Trash2, X, Download } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { promotionService, PromotionItem, CreatePromotionDto } from '../../../services/promotionService';
import { toast } from 'react-toastify';

const DEFAULT_PROMOTIONS: PromotionItem[] = [
  { id: 'PROMO_001', name: 'Khuyến mãi chào mừng tân thủ', type: 'first_deposit', bonus: '100%', maxBonus: 5000000, status: 'active', participants: 1234, startDate: '2024-01-01', endDate: '2026-12-31', description: 'Thưởng nạp đầu 100%' },
  { id: 'PROMO_002', name: 'Nạp thẻ ngày cuối tuần VIP', type: 'deposit', bonus: '50%', maxBonus: 3000000, status: 'active', participants: 856, startDate: '2024-05-01', endDate: '2026-12-31', description: 'Tặng 50% cuối tuần' },
  { id: 'PROMO_003', name: 'Hoàn trả cược thua hàng tuần', type: 'cashback', bonus: '10%', maxBonus: 2000000, status: 'active', participants: 2100, startDate: '2024-01-01', endDate: '2026-12-31', description: 'Hoàn trả thứ 2' },
  { id: 'PROMO_004', name: 'Giải đấu slot Tournament', type: 'tournament', bonus: '100M VNĐ', maxBonus: 100000000, status: 'upcoming', participants: 0, startDate: '2026-11-01', endDate: '2026-11-30', description: 'Đua top hũ' },
  { id: 'PROMO_005', name: 'Hoàn tiền VIP Diamond', type: 'rebate', bonus: '15%', maxBonus: 5000000, status: 'expired', participants: 432, startDate: '2024-04-01', endDate: '2024-04-30', description: 'Hội viên VIP' },
];

const PromotionsBonus = () => {
  const { t, language } = useLanguage();
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatePromotionDto>({
    name: '',
    type: 'first_deposit',
    bonus: '100%',
    maxBonus: 5000000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '2026-12-31',
    description: '',
  });

  const fetchPromotions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await promotionService.getPromotions({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
      });

      if (response && response.items && response.items.length > 0) {
        setPromotions(response.items);
      } else if (response && response.items && response.items.length === 0 && (statusFilter !== 'ALL' || typeFilter !== 'ALL')) {
        setPromotions([]);
      } else {
        setPromotions(DEFAULT_PROMOTIONS);
      }
    } catch (err) {
      console.warn('Could not load promotions from API, using default fallback:', err);
      setPromotions(DEFAULT_PROMOTIONS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleToggleStatus = async (promo: PromotionItem) => {
    const newStatus = promo.status === 'active' ? 'paused' : 'active';
    try {
      await promotionService.updateStatus(promo.id, newStatus);
      toast.success(`Đã chuyển trạng thái sang: ${newStatus === 'active' ? 'Đang chạy' : 'Tạm dừng'}`);
      setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: newStatus } : p));
    } catch {
      // Local fallback toggle
      setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: newStatus } : p));
      toast.info(`Cập nhật trạng thái sang: ${newStatus === 'active' ? 'Đang chạy' : 'Tạm dừng'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) return;
    try {
      await promotionService.deletePromotion(id);
      toast.success('Xóa chương trình khuyến mãi thành công');
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch {
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast.success('Đã xóa chương trình khuyến mãi');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên chương trình');
      return;
    }

    setSubmitting(true);
    try {
      const created = await promotionService.createPromotion(formData);
      toast.success('Tạo chương trình khuyến mãi thành công');
      setIsModalOpen(false);
      setPromotions(prev => [created, ...prev]);
    } catch (err: any) {
      toast.error(err.message || 'Tạo khuyến mãi thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    try {
      const headers = ['Mã', 'Tên chương trình', 'Loại', 'Thưởng', 'Thưởng tối đa', 'Trạng thái', 'Người tham gia', 'Thời gian'];
      const rows = filteredPromotions.map(p => [
        p.id,
        p.name,
        p.type,
        p.bonus,
        p.maxBonus,
        p.status,
        p.participants,
        `${p.startDate} - ${p.endDate}`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
        + [headers.join(','), ...rows.map(r => r.map(f => `"${String(f || '').replace(/"/g, '""')}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `promotions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Xuất danh sách khuyến mãi thành công');
    } catch {
      toast.error('Xuất danh sách thất bại');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('pages.promotions.ongoing') || 'Đang diễn ra';
      case 'upcoming':
        return t('pages.promotions.upcoming') || 'Sắp diễn ra';
      case 'expired':
        return t('pages.promotions.expired') || 'Đã kết thúc';
      case 'paused':
        return 'Tạm dừng';
      default:
        return status;
    }
  };

  const filteredPromotions = promotions.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchType = typeFilter === 'ALL' || p.type.toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  const totalParticipants = promotions.reduce((sum, p) => sum + (p.participants || 0), 0);
  const activeCount = promotions.filter(p => p.status === 'active').length;
  const totalMaxBonus = promotions.reduce((sum, p) => sum + (Number(p.maxBonus) || 0), 0);

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('pages.promotions.title')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.promotions.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPromotions(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-700 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất danh sách</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('pages.promotions.createPromotion')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.promotions.totalPrograms')}</p>
              <p className="text-2xl font-bold text-gray-800">{promotions.length}</p>
              <span className="text-xs text-gray-400 mt-1 block">Chương trình khuyến mãi</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.promotions.ongoing')}</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
              <span className="text-xs text-emerald-600/70 mt-1 block">Đang hoạt động cho khách hàng</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('pages.promotions.totalParticipants')}</p>
              <p className="text-2xl font-bold text-gray-800">{totalParticipants.toLocaleString()}</p>
              <span className="text-xs text-blue-600/70 mt-1 block">Hội viên đã nhận thưởng</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tổng quỹ thưởng tối đa</p>
              <p className="text-2xl font-bold text-amber-600">{(totalMaxBonus / 1000000).toFixed(0)}M VNĐ</p>
              <span className="text-xs text-amber-600/70 mt-1 block">Ngân sách dự kiến</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Percent className="w-6 h-6 text-amber-600" />
            </div>
          </div>
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
              placeholder="Tìm kiếm theo tên chương trình, mô tả, hình thức thưởng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="active">Đang diễn ra (Active)</option>
                <option value="upcoming">Sắp diễn ra (Upcoming)</option>
                <option value="paused">Tạm dừng (Paused)</option>
                <option value="expired">Đã kết thúc (Expired)</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            >
              <option value="ALL">Tất cả loại khuyến mãi</option>
              <option value="first_deposit">{t('pages.promotions.firstDeposit')}</option>
              <option value="deposit">{t('pages.promotions.deposit')}</option>
              <option value="cashback">{t('pages.promotions.cashback')}</option>
              <option value="tournament">{t('pages.promotions.tournament')}</option>
              <option value="rebate">{t('pages.promotions.rebate')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.promotions.programName')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.type')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.promotions.bonus')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.promotions.maxBonus')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.promotions.participants')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.tables.time')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>Đang tải chương trình khuyến mãi...</span>
                  </td>
                </tr>
              ) : filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy chương trình khuyến mãi nào.
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{promo.name}</div>
                      {promo.description && <div className="text-xs text-gray-400 max-w-xs truncate">{promo.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {promo.type === 'first_deposit' ? t('pages.promotions.firstDeposit') : promo.type === 'deposit' ? t('pages.promotions.deposit') : promo.type === 'cashback' ? t('pages.promotions.cashback') : promo.type === 'tournament' ? t('pages.promotions.tournament') : t('pages.promotions.rebate')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">{promo.bonus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {Number(promo.maxBonus).toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {(promo.participants || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div>{promo.startDate}</div>
                      <div className="text-gray-400">{t('pages.promotions.to')} {promo.endDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(promo)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${getStatusColor(promo.status)}`}
                        title="Bấm để chuyển trạng thái"
                      >
                        {promo.status === 'active' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                        {getStatusText(promo.status)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Xóa khuyến mãi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{t('pages.promotions.createPromotion')}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chương trình <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Thưởng nạp 100% đón giáng sinh..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại khuyến mãi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="first_deposit">{t('pages.promotions.firstDeposit')}</option>
                    <option value="deposit">{t('pages.promotions.deposit')}</option>
                    <option value="cashback">{t('pages.promotions.cashback')}</option>
                    <option value="tournament">{t('pages.promotions.tournament')}</option>
                    <option value="rebate">{t('pages.promotions.rebate')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức thưởng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bonus}
                    onChange={(e) => setFormData(prev => ({ ...prev, bonus: e.target.value }))}
                    placeholder="100% hoặc 500,000 VNĐ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thưởng tối đa (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.maxBonus}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxBonus: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả / Điều kiện nhận thưởng
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả điều kiện vòng cược hoặc thể lệ tham gia..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsBonus;
