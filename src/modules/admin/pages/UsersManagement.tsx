import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Loader2, Edit, Trash2, Shield, Eye, ChevronDown, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { userService } from '../../../services/userService';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto
} from '../../../types/api';

const UsersManagement = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [users, setUsers] = useState<UserResponseDto[]>([]);

  // Localized labels for this page
  const labels = language === 'vi' ? {
    pageTitle: 'Quản lý Người dùng',
    pageDescription: 'Quản lý tài khoản người dùng trong hệ thống',
    searchPlaceholder: 'Tìm kiếm theo tên, email hoặc username...',
    filterTitle: 'Bộ lọc',
    clearFilter: 'Xóa bộ lọc',
    statusLabel: 'Trạng thái',
    allStatuses: 'Tất cả trạng thái',
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    twoFaLabel: 'Xác thực 2 lớp (2FA)',
    userTypeLabel: 'Loại người dùng',
    all: 'Tất cả',
    enabled: 'Đã bật',
    disabled: 'Đã tắt',
    apply: 'Áp dụng',
    filtering: 'Đang lọc:',
    deselectAll: 'Bỏ chọn tất cả',
    selectAll: 'Chọn tất cả',
    colId: 'ID',
    colName: 'Tên',
    colEmail: 'Email',
    colUsername: 'Username',
    colType: 'Loại',
    colStatus: 'Trạng thái',
    col2fa: '2FA',
    colRequire2fa: 'Yêu cầu 2FA',
    colChangePassword: 'Đổi MK',
    colActiveAt: 'Ngày kích hoạt',
    colCreatedAt: 'Ngày tạo',
    colUpdatedAt: 'Cập nhật',
    colActions: 'Thao tác',
    noUsersFound: 'Không tìm thấy người dùng nào',
    noUsersYet: 'Chưa có người dùng nào',
    on: 'Bật',
    off: 'Tắt',
    yes: 'Có',
    no: 'Không',
    showing: 'Hiển thị',
    of: 'của',
    users: 'người dùng',
    rowsPerPage: 'Số dòng:',
    previous: 'Trước',
    page: 'Trang',
    next: 'Sau',
    editUser: 'Chỉnh sửa người dùng',
    createUser: 'Tạo người dùng mới',
    nameLabel: 'Tên',
    nameRequiredPlaceholder: 'Nhập tên người dùng...',
    usernameHint: 'Chỉ được chứa chữ cái, số và dấu gạch dưới',
    accountSettings: 'Cài đặt tài khoản',
    activateAccount: 'Kích hoạt tài khoản',
    activateAccountDesc: 'Cho phép người dùng đăng nhập',
    enable2fa: 'Bật 2FA',
    enable2faDesc: 'Kích hoạt xác thực 2 lớp',
    twoFaActivated: '2FA đã kích hoạt',
    twoFaCurrentStatus: 'Trạng thái 2FA hiện tại',
    require2faChallenge: 'Yêu cầu xác thực 2FA',
    require2faChallengeDesc: 'Bắt buộc xác thực 2FA khi đăng nhập',
    forceChangePassword: 'Bắt buộc đổi mật khẩu',
    forceChangePasswordDesc: 'Yêu cầu đổi mật khẩu khi đăng nhập lần tới',
    createUserBtn: 'Tạo người dùng',
    deleteUser: 'Xóa Người dùng',
    bulkDeleteTitle: 'Xóa nhiều người dùng',
    bulkDeleteWarning: 'Hành động này không thể hoàn tác',
    bulkDeleteConfirm: (count: number) => `Bạn có chắc chắn muốn xóa ${count} người dùng đã chọn?`,
    bulkDeleteList: 'Danh sách sẽ bị xóa:',
    bulkDeleting: (count: number) => `Đang xóa ${count} người dùng...`,
    bulkDeleteBtn: (count: number) => `Xóa ${count} người dùng`,
    selectedUsers: 'người dùng đã chọn',
    deleteSelected: 'Xóa đã chọn',
    deselect: 'Bỏ chọn',
    userTypes: { ADMIN: 'Quản trị', AGENCY: 'Đại lý', USER: 'Người dùng' } as Record<string, string>,
    // Toast messages
    createSuccess: 'Tạo người dùng thành công',
    createFailed: 'Tạo người dùng thất bại',
    updateFailed: 'Cập nhật người dùng thất bại',
    deleteSuccess: 'Xóa người dùng thành công',
    deleteFailed: 'Xóa người dùng thất bại',
    bulkDeleteSuccess: (count: number) => `Đã xóa thành công ${count} người dùng`,
    bulkDeletePartial: (success: number, total: number, failed: number) => `Xóa thành công ${success}/${total} người dùng. ${failed} người dùng xóa thất bại.`,
    // Delete confirmation
    deleteConfirmMsg: (name: string) => `Bạn có chắc chắn muốn xóa người dùng "${name}"?`,
    deleteWarningMsg: 'Hành động này không thể hoàn tác.',
  } : {
    pageTitle: 'Users Management',
    pageDescription: 'Manage user accounts in the system',
    searchPlaceholder: 'Search by name, email or username...',
    filterTitle: 'Filters',
    clearFilter: 'Clear filters',
    statusLabel: 'Status',
    allStatuses: 'All statuses',
    active: 'Active',
    inactive: 'Inactive',
    twoFaLabel: 'Two-Factor Authentication (2FA)',
    userTypeLabel: 'User Type',
    all: 'All',
    enabled: 'Enabled',
    disabled: 'Disabled',
    apply: 'Apply',
    filtering: 'Filtering:',
    deselectAll: 'Deselect all',
    selectAll: 'Select all',
    colId: 'ID',
    colName: 'Name',
    colEmail: 'Email',
    colUsername: 'Username',
    colType: 'Type',
    colStatus: 'Status',
    col2fa: '2FA',
    colRequire2fa: 'Require 2FA',
    colChangePassword: 'Change PW',
    colActiveAt: 'Activated',
    colCreatedAt: 'Created',
    colUpdatedAt: 'Updated',
    colActions: 'Actions',
    noUsersFound: 'No users found',
    noUsersYet: 'No users yet',
    on: 'On',
    off: 'Off',
    yes: 'Yes',
    no: 'No',
    showing: 'Showing',
    of: 'of',
    users: 'users',
    rowsPerPage: 'Rows:',
    previous: 'Previous',
    page: 'Page',
    next: 'Next',
    editUser: 'Edit User',
    createUser: 'Create New User',
    nameLabel: 'Name',
    nameRequiredPlaceholder: 'Enter user name...',
    usernameHint: 'Only letters, numbers and underscores allowed',
    accountSettings: 'Account Settings',
    activateAccount: 'Activate Account',
    activateAccountDesc: 'Allow user to log in',
    enable2fa: 'Enable 2FA',
    enable2faDesc: 'Enable two-factor authentication',
    twoFaActivated: '2FA Activated',
    twoFaCurrentStatus: 'Current 2FA status',
    require2faChallenge: 'Require 2FA Challenge',
    require2faChallengeDesc: 'Require 2FA verification on login',
    forceChangePassword: 'Force Password Change',
    forceChangePasswordDesc: 'Require password change on next login',
    createUserBtn: 'Create User',
    deleteUser: 'Delete User',
    bulkDeleteTitle: 'Delete Multiple Users',
    bulkDeleteWarning: 'This action cannot be undone',
    bulkDeleteConfirm: (count: number) => `Are you sure you want to delete ${count} selected users?`,
    bulkDeleteList: 'Users to be deleted:',
    bulkDeleting: (count: number) => `Deleting ${count} users...`,
    bulkDeleteBtn: (count: number) => `Delete ${count} users`,
    selectedUsers: 'users selected',
    deleteSelected: 'Delete selected',
    deselect: 'Deselect',
    userTypes: { ADMIN: 'Admin', AGENCY: 'Agency', USER: 'User' } as Record<string, string>,
    // Toast messages
    createSuccess: 'User created successfully',
    createFailed: 'Failed to create user',
    updateFailed: 'Failed to update user',
    deleteSuccess: 'User deleted successfully',
    deleteFailed: 'Failed to delete user',
    bulkDeleteSuccess: (count: number) => `Successfully deleted ${count} users`,
    bulkDeletePartial: (success: number, total: number, failed: number) => `Deleted ${success}/${total} users. ${failed} users failed to delete.`,
    // Delete confirmation
    deleteConfirmMsg: (name: string) => `Are you sure you want to delete user "${name}"?`,
    deleteWarningMsg: 'This action cannot be undone.',
  };

  const getUserTypeLabel = (type?: string) => labels.userTypes[type || 'USER'] || type || labels.userTypes['USER'];
  const dateLocale = language === 'vi' ? 'vi-VN' : 'en-US';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Bulk delete states
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [twoFaFilter, setTwoFaFilter] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  // Calculate active filter count
  const activeFilterCount = [statusFilter, twoFaFilter].filter(f => f !== '').length + (userTypeFilter.length > 0 ? 1 : 0);

  const [formData, setFormData] = useState<CreateUserRequestDto & {
    isActive?: boolean;
    isEnable2FA?: boolean;
    twoFaEnabled?: boolean;
    requires2FAChallenge?: boolean;
    mustChangePassword?: boolean;
    userType?: string;
  }>({
    name: '',
    email: '',
    username: '',
    isActive: true,
    isEnable2FA: false,
    twoFaEnabled: false,
    requires2FAChallenge: false,
    mustChangePassword: false,
    userType: 'user',
  });

  // Click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users when search or pageSize changes (reset to page 1)
  useEffect(() => {
    fetchUsers(1, debouncedSearch);
  }, [debouncedSearch, pageSize, userTypeFilter]);

  const fetchUsers = async (page: number, search?: string) => {
    setFetching(true);
    try {
      const response = await userService.getUsers({
        page,
        page_size: pageSize,
        search: search || undefined,
        user_type: userTypeFilter.length > 0 ? userTypeFilter : undefined,
      });
      setUsers(response.data || []);
      setCurrentPage(response.pagination?.page || page);
      setTotalItems(response.pagination?.total || 0);
    } catch (error: any) {
      toast.error(error.message || t('common.error'));
    } finally {
      setFetching(false);
    }
  };

  // const handleOpenModal = () => {
  //   setIsEditMode(false);
  //   setEditingUserId(null);
  //   setIsModalOpen(true);
  //   setFormData({
  //     name: '',
  //     email: '',
  //     username: '',
  //   });
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      username: '',
      isActive: true,
      isEnable2FA: false,
      twoFaEnabled: false,
      requires2FAChallenge: false,
      mustChangePassword: false,
      userType: 'user',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      toast.error(t('common.pleaseFillAllFields'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Username validation (alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      toast.error('Username chỉ được chứa chữ cái, số và dấu gạch dưới');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editingUserId) {
        // Call API to update user
        const updateData: UpdateUserRequestDto = {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          userType: formData.userType,
          isActive: formData.isActive,
          isEnable2FA: formData.isEnable2FA,
          twoFaEnabled: formData.twoFaEnabled,
          requires2FAChallenge: formData.requires2FAChallenge,
          mustChangePassword: formData.mustChangePassword,
        };
        await userService.updateUser(editingUserId, updateData);
        toast.success(t('common.update') + ' ' + t('common.success'));
      } else {
        // Call API to create user
        await userService.createUser({
          name: formData.name,
          email: formData.email,
          username: formData.username,
        });
        toast.success(labels.createSuccess);
      }

      handleCloseModal();
      await fetchUsers(currentPage, debouncedSearch);
    } catch (error: any) {
      toast.error(error.message || (isEditMode ? labels.updateFailed : labels.createFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeletingId(userToDelete.id);
    try {
      await userService.deleteUser(userToDelete.id);
      toast.success(labels.deleteSuccess);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      await fetchUsers(currentPage, debouncedSearch);
    } catch (error: any) {
      toast.error(error.message || labels.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleViewClick = (user: UserResponseDto) => {
    router.push(`/dashboard/users/${user.id}`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setTwoFaFilter('');
    setUserTypeFilter([]);
    setCurrentPage(1);
  };

  // User type filter toggle
  const handleToggleUserType = (type: string) => {
    setUserTypeFilter(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
    setCurrentPage(1);
  };

  // ── Bulk Selection Handlers ──
  const handleToggleSelect = (userId: string) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      // Deselect all
      setSelectedUserIds(new Set());
    } else {
      // Select all visible
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedUserIds(new Set());
  };

  const handleBulkDeleteClick = () => {
    if (selectedUserIds.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedUserIds.size === 0) return;
    setBulkDeleting(true);
    try {
      const result = await userService.deleteUsers(Array.from(selectedUserIds));
      if (result.failedCount === 0) {
        toast.success(labels.bulkDeleteSuccess(result.successCount));
      } else {
        toast.warning(
          labels.bulkDeletePartial(result.successCount, result.successCount + result.failedCount, result.failedCount)
        );
      }
      setSelectedUserIds(new Set());
      setIsBulkDeleteModalOpen(false);
      await fetchUsers(currentPage, debouncedSearch);
    } catch (error: any) {
      toast.error(error.message || labels.deleteFailed);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleBulkDeleteCancel = () => {
    setIsBulkDeleteModalOpen(false);
  };

  // Filter users based on status and 2FA filters (search is handled by API)
  const filteredUsers = users.filter(user => {
    // Status filter
    if (statusFilter) {
      const isActive = statusFilter === 'active';
      if (user.isActive !== isActive) return false;
    }

    // 2FA filter
    if (twoFaFilter) {
      const is2FAEnabled = twoFaFilter === 'enabled';
      if (user.isEnable2FA !== is2FAEnabled) return false;
    }

    return true;
  });

  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const isSomeSelected = selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length;

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{labels.pageTitle}</h1>
        <p className="text-gray-500 text-sm">{labels.pageDescription}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={labels.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${activeFilterCount > 0
                ? 'bg-primary-100 border-primary-400 text-primary-800 hover:bg-primary-200'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>{t('common.filter')}</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-900 text-xs font-medium rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown Panel */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="font-semibold text-gray-800">{labels.filterTitle}</span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      {labels.clearFilter}
                    </button>
                  )}
                </div>

                {/* Filter Options */}
                <div className="p-4 space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.statusLabel}
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">{labels.allStatuses}</option>
                      <option value="active">{labels.active}</option>
                      <option value="inactive">{labels.inactive}</option>
                    </select>
                  </div>

                  {/* 2FA Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.twoFaLabel}
                    </label>
                    <select
                      value={twoFaFilter}
                      onChange={(e) => {
                        setTwoFaFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">{labels.all}</option>
                      <option value="enabled">{labels.enabled}</option>
                      <option value="disabled">{labels.disabled}</option>
                    </select>
                  </div>

                  {/* User Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.userTypeLabel}
                    </label>
                    <div className="space-y-1.5">
                      {Object.entries(labels.userTypes).map(([key, label]) => (
                        <label
                          key={key}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-sm ${userTypeFilter.includes(key.toLowerCase())
                            ? 'bg-primary-100 text-primary-800'
                            : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={userTypeFilter.includes(key.toLowerCase())}
                            onChange={() => handleToggleUserType(key.toLowerCase())}
                            className="w-3.5 h-3.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full px-4 py-2 bg-primary text-primary-900 rounded-lg hover:bg-primary-400 transition-colors text-sm font-medium"
                  >
                    {labels.apply}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">{labels.filtering}</span>
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {statusFilter === 'active' ? labels.active : labels.inactive}
                <button
                  onClick={() => setStatusFilter('')}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {twoFaFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                2FA: {twoFaFilter === 'enabled' ? labels.enabled : labels.disabled}
                <button
                  onClick={() => setTwoFaFilter('')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {userTypeFilter.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {labels.userTypeLabel}: {userTypeFilter.map(t => labels.userTypes[t.toUpperCase()] || t).join(', ')}
                <button
                  onClick={() => setUserTypeFilter([])}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    title={isAllSelected ? labels.deselectAll : labels.selectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colId}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colName}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colEmail}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colUsername}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colType}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colStatus}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.col2fa}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colRequire2fa}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colChangePassword}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colActiveAt}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colCreatedAt}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colUpdatedAt}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{labels.colActions}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fetching ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-gray-600">{t('common.loadingData')}</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? labels.noUsersFound : labels.noUsersYet}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={`transition-colors ${selectedUserIds.has(user.id) ? 'bg-purple-50' : 'hover:bg-primary-50/50'}`}>
                    <td className="px-4 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.has(user.id)}
                        onChange={() => handleToggleSelect(user.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                        #{user.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-primary-900 text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-700">{user.username}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.userType === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.userType === 'PARTNER' ? 'bg-blue-100 text-blue-800' :
                          user.userType === 'PROVIDER' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {getUserTypeLabel(user.userType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {user.isActive ? labels.active : labels.inactive}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.isEnable2FA ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <Shield className="w-3 h-3" />
                          {labels.on}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {labels.off}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.requires2FAChallenge ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                          {labels.yes}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          {labels.no}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.mustChangePassword ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          {labels.yes}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          {labels.no}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.activeAt ? new Date(user.activeAt).toLocaleDateString(dateLocale) : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.updatedAt).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewClick(user)}
                          className="text-primary-700 hover:text-primary-900 p-1.5 hover:bg-primary-50 rounded transition-colors"
                          title={t('common.view') || 'Xem chi tiết'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setIsEditMode(true);
                            setEditingUserId(user.id);
                            setFormData({
                              name: user.name,
                              email: user.email,
                              username: user.username,
                              userType: user.userType?.toLowerCase() || 'user',
                              isActive: user.isActive ?? true,
                              isEnable2FA: user.isEnable2FA ?? false,
                              twoFaEnabled: user.twoFaEnabled ?? user.isEnable2FA ?? false,
                              requires2FAChallenge: user.requires2FAChallenge ?? false,
                              mustChangePassword: user.mustChangePassword ?? false,
                            });
                          }}
                          className="text-primary-700 hover:text-primary-900 p-1.5 hover:bg-primary-50 rounded transition-colors"
                          title={t('common.edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id, user.name)}
                          disabled={deletingId === user.id}
                          className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={t('common.delete')}
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {labels.showing} {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalItems)} {labels.of} {totalItems} {labels.users}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{labels.rowsPerPage}</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          {totalItems > pageSize && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers(currentPage - 1, debouncedSearch)}
                disabled={currentPage === 1 || fetching}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {labels.previous}
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {labels.page} {currentPage} / {Math.ceil(totalItems / pageSize)}
              </span>
              <button
                onClick={() => fetchUsers(currentPage + 1, debouncedSearch)}
                disabled={currentPage >= Math.ceil(totalItems / pageSize) || fetching}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {labels.next}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? labels.editUser : labels.createUser}
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
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.nameLabel} <span className="text-red-500">*</span>
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
                  placeholder={labels.nameRequiredPlaceholder}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
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
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="username"
                />
                <p className="mt-1 text-xs text-gray-500">{labels.usernameHint}</p>
              </div>

              {/* User Type - Only show in edit mode */}
              {isEditMode && (
                <div className="mb-4">
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.userTypeLabel}
                  </label>
                  <select
                    id="userType"
                    value={formData.userType || 'user'}
                    onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="admin">{labels.userTypes['ADMIN']}</option>
                    <option value="agency">{labels.userTypes['AGENCY']}</option>
                    <option value="user">{labels.userTypes['USER']}</option>
                  </select>
                </div>
              )}

              {/* Status Options - Only show in edit mode */}
              {isEditMode && (
                <div className="mb-6 space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.accountSettings}
                  </label>

                  {/* isActive Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{labels.activateAccount}</p>
                      <p className="text-xs text-gray-500">{labels.activateAccountDesc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  {/* isEnable2FA Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{labels.enable2fa}</p>
                      <p className="text-xs text-gray-500">{labels.enable2faDesc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isEnable2FA ?? false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isEnable2FA: e.target.checked }))}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  {/* twoFaEnabled Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{labels.twoFaActivated}</p>
                      <p className="text-xs text-gray-500">{labels.twoFaCurrentStatus}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.twoFaEnabled ?? false}
                        onChange={(e) => setFormData(prev => ({ ...prev, twoFaEnabled: e.target.checked }))}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  {/* requires2FAChallenge Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{labels.require2faChallenge}</p>
                      <p className="text-xs text-gray-500">{labels.require2faChallengeDesc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requires2FAChallenge ?? false}
                        onChange={(e) => setFormData(prev => ({ ...prev, requires2FAChallenge: e.target.checked }))}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  {/* mustChangePassword Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{labels.forceChangePassword}</p>
                      <p className="text-xs text-gray-500">{labels.forceChangePasswordDesc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mustChangePassword ?? false}
                        onChange={(e) => setFormData(prev => ({ ...prev, mustChangePassword: e.target.checked }))}
                        disabled={loading}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>
                </div>
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
                        ? t('common.updating')
                        : t('common.creating')
                      : isEditMode
                        ? t('common.update')
                        : labels.createUserBtn}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{labels.deleteUser}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                {labels.deleteConfirmMsg(userToDelete.name)}
              </p>
              <p className="text-sm text-red-600">
                {labels.deleteWarningMsg}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={deletingId === userToDelete.id}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingId === userToDelete.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingId === userToDelete.id && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{deletingId === userToDelete.id ? t('common.deleting') : t('common.delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{labels.bulkDeleteTitle}</h2>
                  <p className="text-sm text-red-600">{labels.bulkDeleteWarning}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                {labels.bulkDeleteConfirm(selectedUserIds.size)}
              </p>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{labels.bulkDeleteList}</p>
                <ul className="space-y-1">
                  {filteredUsers
                    .filter(u => selectedUserIds.has(u.id))
                    .map(u => (
                      <li key={u.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-300 to-red-500 flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{u.name}</span>
                        <span className="text-gray-400 text-xs">({u.email})</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
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
                <span>{bulkDeleting ? labels.bulkDeleting(selectedUserIds.size) : labels.bulkDeleteBtn(selectedUserIds.size)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedUserIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-purple-500 rounded-full text-xs font-bold">
                {selectedUserIds.size}
              </div>
              <span className="text-sm font-medium">{labels.selectedUsers}</span>
            </div>
            <div className="w-px h-6 bg-gray-600" />
            <button
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              {labels.deleteSelected}
            </button>
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
              {labels.deselect}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

