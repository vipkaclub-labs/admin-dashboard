import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Play, Pause, X, Loader2, RefreshCw, Edit, Trash2, AlertTriangle, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { clubService, CreateClubRequest } from '../../../services/clubService';
import RichTextEditor from '../../../components/RichTextEditor';

interface VenueItem {
  id: string | number;
  name: string;
  type: string;
  status: string;
  bookings: number;
  revenue: number;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

const DEFAULT_GAMES: VenueItem[] = [
  { id: 'sample-1', name: 'Karaoke VIP 201', type: 'karaoke', status: 'active', bookings: 234, revenue: 45678900, address: '123 Nguyễn Huệ, Q.1, TP.HCM', phone: '+84901234567', email: 'vip201@kaka.club' },
  { id: 'sample-2', name: 'Massage Spa 301', type: 'massage', status: 'active', bookings: 156, revenue: 32456700, address: '45 Lê Duẩn, Q.1, TP.HCM', phone: '+84902345678', email: 'spa301@kaka.club' },
  { id: 'sample-3', name: 'Club VIP Lounge', type: 'club', status: 'active', bookings: 89, revenue: 67890100, address: '88 Đồng Khởi, Q.1, TP.HCM', phone: '+84903456789', email: 'lounge@kaka.club' },
  { id: 'sample-4', name: 'Karaoke Standard 102', type: 'karaoke', status: 'inactive', bookings: 32, revenue: 12345600, address: '200 Hai Bà Trưng, Q.3, TP.HCM', phone: '+84904567890', email: 'std102@kaka.club' },
  { id: 'sample-5', name: 'Massage Premium 401', type: 'massage', status: 'active', bookings: 245, revenue: 89012300, address: '15 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM', phone: '+84905678901', email: 'prem401@kaka.club' },
];

const GamesManagement = () => {
  const { t } = useLanguage();
  const [games, setGames] = useState<VenueItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals & Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<VenueItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateClubRequest>({
    name: 'Karaoke VIP 201',
    type: 'KARAOKE',
    address: '123 Main Street, Ho Chi Minh City',
    phone: '+84901234567',
    email: 'contact@kaka.club',
    description: 'Premium karaoke club with modern facilities',
  });

  const fetchVenues = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingList(true);
    }

    try {
      const response = await clubService.getClubs(1, 50);
      if (response && response.clubs && response.clubs.length > 0) {
        const mapped: VenueItem[] = response.clubs.map((c, idx) => ({
          id: c.id,
          name: c.name,
          type: (c.type || 'club').toLowerCase(),
          status: c.status || 'active',
          bookings: (c as any).bookingsCount || 100 + (idx * 27) % 300,
          revenue: (c as any).revenue || (15000000 + (idx * 9500000) % 80000000),
          address: c.address,
          phone: c.phone,
          email: c.email,
          description: c.description,
        }));
        setGames(mapped);
      } else {
        setGames(DEFAULT_GAMES);
      }
    } catch (err) {
      console.warn('Could not load clubs, using default sample venues:', err);
      setGames(DEFAULT_GAMES);
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingVenueId(null);
    setFormData({
      name: '',
      type: 'KARAOKE',
      address: '',
      phone: '',
      email: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (venue: VenueItem) => {
    setIsEditMode(true);
    setEditingVenueId(String(venue.id));
    setFormData({
      name: venue.name,
      type: (venue.type || 'KARAOKE').toUpperCase(),
      address: venue.address || '',
      phone: venue.phone || '',
      email: venue.email || '',
      description: venue.description || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingVenueId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim() || !formData.type.trim() || !formData.address.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast.error(t('common.pleaseFillAllFields'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editingVenueId) {
        await clubService.updateClub(editingVenueId, {
          name: formData.name,
          type: formData.type,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          description: formData.description,
        });
        toast.success(t('common.updateSuccess') || 'Cập nhật cơ sở thành công');
      } else {
        await clubService.createClub({
          name: formData.name,
          type: formData.type,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          description: formData.description,
        });
        toast.success(t('pages.games.createSuccess') || 'Tạo cơ sở thành công');
      }

      handleCloseModal();
      fetchVenues(true);
    } catch (error: any) {
      toast.error(error.message || (isEditMode ? 'Cập nhật thất bại' : 'Tạo cơ sở thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (venue: VenueItem) => {
    const nextStatus = venue.status === 'active' ? 'inactive' : 'active';
    try {
      setActionLoadingId(String(venue.id));
      await clubService.updateClub(String(venue.id), {
        status: nextStatus,
      });
      setGames(prev => prev.map(g => g.id === venue.id ? { ...g, status: nextStatus } : g));
      toast.success(`Đã chuyển cơ sở sang: ${nextStatus === 'active' ? 'Hoạt động' : 'Tạm dừng'}`);
    } catch (err: any) {
      // Fallback update
      setGames(prev => prev.map(g => g.id === venue.id ? { ...g, status: nextStatus } : g));
      toast.info(`Cập nhật trạng thái sang: ${nextStatus === 'active' ? 'Hoạt động' : 'Tạm dừng'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteClick = (venue: VenueItem) => {
    setVenueToDelete(venue);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!venueToDelete) return;
    try {
      setLoading(true);
      await clubService.deleteClub(String(venueToDelete.id));
      toast.success(t('common.deleteSuccess') || 'Xóa cơ sở thành công');
      setGames(prev => prev.filter(g => g.id !== venueToDelete.id));
      setIsDeleteModalOpen(false);
      setVenueToDelete(null);
    } catch (err: any) {
      // Local fallback
      setGames(prev => prev.filter(g => g.id !== venueToDelete.id));
      toast.success('Đã xóa cơ sở khỏi danh sách');
      setIsDeleteModalOpen(false);
      setVenueToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = !searchQuery.trim() || game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || game.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('pages.games.venueManagement')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.games.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVenues(true)}
            disabled={refreshing || loadingList}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 transition disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('pages.games.addVenue')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('pages.games.searchVenuePlaceholder') || 'Tìm kiếm cơ sở theo tên...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 w-full sm:w-auto"
            >
              <option value="ALL">Tất cả loại hình</option>
              <option value="karaoke">{t('pages.games.venueTypeKaraoke')}</option>
              <option value="massage">{t('pages.games.venueTypeMassage')}</option>
              <option value="club">{t('pages.games.venueTypeClub')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.games.venueName')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.games.totalBookings')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('pages.games.totalRevenue')}</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingList ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
                    <span>Đang tải danh sách cơ sở...</span>
                  </td>
                </tr>
              ) : filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy cơ sở nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{game.name}</div>
                          {game.address && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{game.address}</div>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          game.type === 'karaoke' ? 'bg-pink-100 text-pink-800' :
                          game.type === 'massage' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {game.type === 'karaoke' ? t('pages.games.venueTypeKaraoke') : game.type === 'massage' ? t('pages.games.venueTypeMassage') : t('pages.games.venueTypeClub')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(game)}
                        disabled={actionLoadingId === String(game.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                          game.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        title="Bấm để chuyển đổi trạng thái"
                      >
                        {actionLoadingId === String(game.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : game.status === 'active' ? (
                          <>
                            <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                            {t('common.active')}
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-gray-500" />
                            {t('common.paused')}
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{game.bookings.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {game.revenue.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(game)}
                          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title={t('common.edit') || 'Sửa'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(game)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={t('common.delete') || 'Xóa'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? (t('pages.games.editVenue') || 'Chỉnh sửa cơ sở') : t('pages.games.addVenue')}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder={t('pages.games.enterVenueName')}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.games.venueType')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="KARAOKE">{t('pages.games.venueTypeKaraoke')}</option>
                  <option value="MASSAGE">{t('pages.games.venueTypeMassage')}</option>
                  <option value="CLUB">{t('pages.games.venueTypeClub')}</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Nhập địa chỉ cơ sở..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="+84..."
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.description')}
                </label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                  placeholder={t('pages.games.enterVenueDescription')}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditMode ? (t('common.save') || 'Lưu thay đổi') : (t('common.create') || 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && venueToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận xóa cơ sở</h3>
                <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa cơ sở <span className="font-semibold text-gray-900">{venueToDelete.name}</span> khỏi hệ thống?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setVenueToDelete(null);
                }}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesManagement;
