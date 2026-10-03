import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2, Filter, X, Loader2, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { karaokeService, CreateKaraokeRequest, Karaoke } from '../../../services/karaokeService';
import RichTextEditor from '../../../components/RichTextEditor';

const KaraokesManagement = () => {
  const { t, language } = useLanguage();
  const router = useRouter();

  // Localized labels for this page
  const labels = language === 'vi' ? {
    bulkDeleteTitle: 'Xóa nhiều Karaoke',
    bulkDeleteWarning: 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.',
    bulkDeleteConfirm: (count: number) => `Bạn có chắc chắn muốn xóa ${count} karaoke đã chọn?`,
    bulkDeleteList: 'Danh sách sẽ bị xóa:',
    bulkDeleting: (count: number) => `Đang xóa ${count} karaoke...`,
    bulkDeleteBtn: (count: number) => `Xóa ${count} karaoke`,
    deleteSelected: 'Xóa đã chọn',
    bulkDeleteSuccess: (count: number) => `Đã xóa thành công ${count} karaoke`,
    deleteFailed: 'Xóa thất bại. Vui lòng thử lại.',
  } : {
    bulkDeleteTitle: 'Delete Multiple Karaokes',
    bulkDeleteWarning: 'This action cannot be undone. Data will be permanently removed from the system.',
    bulkDeleteConfirm: (count: number) => `Are you sure you want to delete ${count} selected karaokes?`,
    bulkDeleteList: 'Karaokes to be deleted:',
    bulkDeleting: (count: number) => `Deleting ${count} karaokes...`,
    bulkDeleteBtn: (count: number) => `Delete ${count} karaokes`,
    deleteSelected: 'Delete Selected',
    bulkDeleteSuccess: (count: number) => `Successfully deleted ${count} karaokes`,
    deleteFailed: 'Deletion failed. Please try again.',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingOperatorId, setEditingOperatorId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('inactive');
  const [editRegion, setEditRegion] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(7);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Bulk Selection States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [formData, setFormData] = useState<CreateKaraokeRequest>({
    name: '',
    email: '',
    description: '',
    address: '',
    phone: '',
    district: '',
    rating: 0,
    reviewCount: 0,
    qualityLevel: 'STANDARD',
    tags: [],
    views: 0,
    featured: false,
    imageUrl: '',
  });
  const [tagInput, setTagInput] = useState<string>('');

  const [operators, setOperators] = useState<Karaoke[]>([]);

  // Fetch karaokes on component mount
  useEffect(() => {
    fetchKaraokes(1);
  }, []);

  // Fetch karaokes when search or status filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchKaraokes(1);
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  const fetchKaraokes = async (page: number) => {
    setFetching(true);
    try {
      const status = statusFilter === 'ALL' ? undefined : statusFilter;
      const search = searchQuery.trim() || undefined;
      const { karaokes, page: apiPage, total } = await karaokeService.getKaraokes(page, pageSize, status, search);
      setOperators(karaokes);
      setCurrentPage(apiPage);
      setTotalItems(total);
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setFetching(false);
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingOperatorId(null);
    setEditStatus('inactive');
    setEditRegion('');
    setIsModalOpen(true);
    setTagInput('');
    setFormData({
      name: '',
      email: '',
      description: '',
      address: '',
      phone: '',
      district: '',
      rating: 0,
      reviewCount: 0,
      qualityLevel: 'STANDARD',
      tags: [],
      views: 0,
      featured: false,
      imageUrl: '',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingOperatorId(null);
    setEditStatus('inactive');
    setEditRegion('');
    setTagInput('');
    setFormData({
      name: '',
      email: '',
      description: '',
      address: '',
      phone: '',
      district: '',
      rating: 0,
      reviewCount: 0,
      qualityLevel: 'STANDARD',
      tags: [],
      views: 0,
      featured: false,
      imageUrl: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
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
      if (isEditMode && editingOperatorId) {
        await karaokeService.updateKaraoke(editingOperatorId, {
          ...formData,
          status: editStatus.toUpperCase(),
        });
        toast.success(t('common.update') + ' ' + t('common.success'));
      } else {
        // Call karaoke API to create
        await karaokeService.createKaraoke(formData);
        toast.success(t('pages.operators.createSuccess'));
      }

      handleCloseModal();
      await fetchKaraokes(currentPage);
    } catch (error: any) {
      toast.error(error.message || t('pages.operators.createFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (operatorId: string, operatorName: string) => {
    setOperatorToDelete({ id: operatorId, name: operatorName });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!operatorToDelete) return;

    setDeletingId(operatorToDelete.id);
    try {
      await karaokeService.deleteKaraoke(operatorToDelete.id);
      toast.success(t('pages.operators.deleteSuccess'));
      setIsDeleteModalOpen(false);
      setOperatorToDelete(null);
      await fetchKaraokes(currentPage);
    } catch (error: any) {
      toast.error(error.message || t('pages.operators.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setOperatorToDelete(null);
  };

  const handleViewDetail = (karaoke: Karaoke) => {
    router.push(`/dashboard/karaoke/${karaoke.id}`);
  };

  // ── Bulk Selection Handlers ──
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === operators.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(operators.map(op => String(op.id))));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      const bulkResult = await karaokeService.deleteKaraokes(Array.from(selectedIds));
      if (bulkResult.failedCount === 0) {
        toast.success(labels.bulkDeleteSuccess(bulkResult.successCount));
      } else {
        toast.warning(
          `Xóa thành công ${bulkResult.successCount}/${bulkResult.successCount + bulkResult.failedCount} karaoke. ${bulkResult.failedCount} xóa thất bại.`
        );
      }
      setSelectedIds(new Set());
      setIsBulkDeleteModalOpen(false);
      await fetchKaraokes(currentPage);
    } catch (error: any) {
      toast.error(error.message || labels.deleteFailed);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkDeleteCancel = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const isAllSelected = operators.length > 0 && selectedIds.size === operators.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < operators.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pages.operators.title')}</h1>
          <p className="text-gray-600">{t('pages.operators.description')}</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('pages.operators.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-48 pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="ALL">{t('common.allStatus') || 'All Status'}</option>
                  <option value="ACTIVE">{t('common.active')}</option>
                  <option value="INACTIVE">{t('common.inactive')}</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              {selectedIds.size > 0 && (
                <button
                  onClick={handleBulkDeleteClick}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors animate-fade-in"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{labels.deleteSelected} ({selectedIds.size})</span>
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                <span>{t('common.filter')}</span>
              </button>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t('pages.operators.addOperator')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('pages.operators.title')}</p>
                <p className="text-2xl font-bold text-gray-900">{operators.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">O</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('common.active')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {operators.filter(op => op.status?.toUpperCase() === 'ACTIVE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('common.inactive')}</p>
                <p className="text-2xl font-bold text-red-600">
                  {operators.filter(op => op.status?.toUpperCase() === 'INACTIVE').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">✗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operators Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">{t('common.loadingData')}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={el => { if (el) el.indeterminate = isSomeSelected; }}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('pages.operators.title')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.createdAt')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.lastLogin')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operators.map((karaoke) => (
                    <tr key={karaoke.id} className={`transition-colors ${selectedIds.has(String(karaoke.id)) ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(String(karaoke.id))}
                          onChange={() => handleToggleSelect(String(karaoke.id))}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-semibold">
                              {karaoke.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{karaoke.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{karaoke.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{(karaoke as any).username || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${karaoke.status?.toUpperCase() === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {karaoke.status?.toUpperCase() === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{(karaoke as any).region || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {karaoke.createdAt ? new Date(karaoke.createdAt).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(karaoke as any).lastLogin || (karaoke as any).activeAt
                          ? new Date((karaoke as any).lastLogin || (karaoke as any).activeAt).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(karaoke)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                            title={t('pages.operators.viewDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setIsModalOpen(true);
                              setIsEditMode(true);
                              setEditingOperatorId(karaoke.id);
                              setEditStatus((karaoke.status || 'inactive').toLowerCase());
                              setEditRegion((karaoke as any).region || '');
                              setTagInput('');
                              setFormData({
                                name: karaoke.name,
                                email: karaoke.email || '',
                                description: karaoke.description || '',
                                address: (karaoke as any).address || '',
                                phone: (karaoke as any).phone || '',
                                district: (karaoke as any).district || '',
                                rating: (karaoke as any).rating || 0,
                                reviewCount: (karaoke as any).reviewCount || 0,
                                qualityLevel: (karaoke as any).qualityLevel || 'STANDARD',
                                tags: (karaoke as any).tags || [],
                                views: (karaoke as any).views || 0,
                                featured: (karaoke as any).featured || false,
                                imageUrl: (karaoke as any).imageUrl || '',
                              });
                            }}
                            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded"
                            title={t('pages.operators.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(String(karaoke.id), karaoke.name)}
                            disabled={deletingId === String(karaoke.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title={t('pages.operators.deleteOperator')}
                          >
                            {deletingId === String(karaoke.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!fetching && operators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'ALL' ? t('pages.operators.noOperatorsFound') : t('pages.operators.noOperatorsYet')}
              </p>
            </div>
          )}

          {/* Pagination */}
          {!fetching && totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {t('common.showing')}{' '}
                <span className="font-medium">
                  {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span>{' '}
                {t('common.to')}{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalItems)}
                </span>{' '}
                {t('common.of')}{' '}
                <span className="font-medium">{totalItems}</span>{' '}
                {t('pages.operators.operatorsLabel')}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => currentPage > 1 && fetchKaraokes(currentPage - 1)}
                  disabled={currentPage === 1 || fetching}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.previous') || 'Previous'}
                </button>

                <span className="text-sm text-gray-600">
                  {t('common.page')}{' '}
                  <span className="font-medium">{currentPage}</span>{' '}
                  {t('common.of') || 'of'}{' '}
                  <span className="font-medium">{totalPages}</span>
                </span>

                <button
                  type="button"
                  onClick={() => currentPage < totalPages && fetchKaraokes(currentPage + 1)}
                  disabled={currentPage >= totalPages || fetching}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.next') || 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Operator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? t('common.editAction') : t('pages.operators.addOperator')}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Karaoke <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập tên karaoke"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="karaoke@example.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Nhập mô tả (tùy chọn)"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0901111111"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="quan-1"
                  />
                </div>

                <div>
                  <label htmlFor="qualityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ chất lượng
                  </label>
                  <select
                    id="qualityLevel"
                    name="qualityLevel"
                    value={formData.qualityLevel}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="BASIC">Basic</option>
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượt đánh giá
                  </label>
                  <input
                    type="number"
                    id="reviewCount"
                    name="reviewCount"
                    min="0"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="245"
                  />
                </div>

                <div>
                  <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-2">
                    Lượt xem
                  </label>
                  <input
                    type="number"
                    id="views"
                    name="views"
                    min="0"
                    value={formData.views}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="3200"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nhập tag và nhấn Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={loading || !tagInput.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Thêm
                  </button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={loading}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Nổi bật (Featured)</span>
                </label>
              </div>

              {/* When editing, allow changing status & region */}

              {isEditMode && (
                <>
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('common.status')}
                    </label>
                    <select
                      id="status"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="active">{t('common.active')}</option>
                      <option value="inactive">{t('common.inactive')}</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                      {'Region'}
                    </label>
                    <input
                      type="text"
                      id="region"
                      value={editRegion}
                      onChange={(e) => setEditRegion(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder={t('common.region') || 'Enter region'}
                    />
                  </div>
                </>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {loading
                      ? isEditMode
                        ? t('common.update')
                        : t('common.creating')
                      : isEditMode
                        ? t('common.update')
                        : t('pages.operators.createOperator')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && operatorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{t('pages.operators.deleteOperatorTitle')}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                {t('common.deleteConfirmMessage').replace('this item', `Karaoke "${operatorToDelete.name}"`)}
              </p>
              <p className="text-sm text-red-600">
                {t('common.deleteConfirmMessage').split('?')[1] || t('common.deleteConfirmMessage')}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={deletingId === operatorToDelete.id}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingId === operatorToDelete.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingId === operatorToDelete.id && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{deletingId === operatorToDelete.id ? t('common.deleting') : t('common.delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                {labels.bulkDeleteTitle}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                {labels.bulkDeleteConfirm(selectedIds.size)}
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-700">
                  {labels.bulkDeleteWarning}
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-2 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
                  {labels.bulkDeleteList}
                </p>
                <div className="space-y-1">
                  {operators
                    .filter(op => selectedIds.has(String(op.id)))
                    .map(op => (
                      <div key={op.id} className="text-sm text-gray-600 px-2 py-1 bg-white rounded border border-gray-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <span className="truncate">{op.name}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBulkDeleteCancel}
                disabled={bulkDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                disabled={bulkDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {bulkDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {bulkDeleting
                    ? labels.bulkDeleting(selectedIds.size)
                    : labels.bulkDeleteBtn(selectedIds.size)
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaraokesManagement;

