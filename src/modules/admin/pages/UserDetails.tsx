import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Loader2, User, Shield, Mail, UserCircle, Calendar, Clock, Trash2, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { userService } from '../../../services/userService';
import { UserResponseDto, UpdateUserRequestDto } from '../../../types/api';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequestDto>({
    name: '',
    email: '',
    username: '',
  });

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      toast.error(error.message || 'Không thể tải thông tin người dùng');
      // Navigate back after error
      setTimeout(() => {
        router.push('/dashboard/users');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setFormData({
      name: '',
      email: '',
      username: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    // Validate required fields
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.username?.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
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

    try {
      setUpdating(true);
      const updatedUser = await userService.updateUser(id, formData);
      setUser(updatedUser);
      toast.success('Cập nhật người dùng thành công');
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Cập nhật người dùng thất bại. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !id) return;

    try {
      setDeleting(true);
      await userService.deleteUser(id);
      toast.success('Xóa người dùng thành công');
      router.push('/dashboard/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Xóa người dùng thất bại. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Không tìm thấy người dùng</p>
          <button
            onClick={() => router.push('/dashboard/users')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Chi tiết Người dùng</h1>
        <p className="text-gray-500 text-sm">Thông tin chi tiết về tài khoản người dùng</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                @{user.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{t('common.edit')}</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('common.delete')}</span>
            </button>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">ID</label>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">#{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Tên đầy đủ</label>
            <p className="text-sm text-gray-900">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
            <p className="text-sm text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
            <p className="text-sm text-gray-900">@{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Trạng thái</label>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Xác thực 2 lớp (2FA)</label>
            {user.isEnable2FA ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3" />
                Bật
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Tắt
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ngày tạo
            </label>
            <p className="text-sm text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {user.updatedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Ngày cập nhật
              </label>
              <p className="text-sm text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {user.activeAt && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hoạt động lần cuối
              </label>
              <p className="text-sm text-gray-900">
                {new Date(user.activeAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa Người dùng</h2>
              <button
                onClick={handleEditCancel}
                disabled={updating}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nhập tên người dùng..."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-username"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  required
                  disabled={updating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="username"
                />
                <p className="mt-1 text-xs text-gray-500">Chỉ được chứa chữ cái, số và dấu gạch dưới</p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={updating}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('common.updating') || 'Đang cập nhật...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t('common.update') || 'Cập nhật'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('common.delete')} Người dùng</h2>
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa người dùng <strong>"{user.name}"</strong>?
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Email: <strong>{user.email}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Username: <strong>@{user.username}</strong>
              </p>
              <p className="text-sm text-red-600 font-medium">
                {t('common.deleteWarning') || 'Hành động này không thể hoàn tác.'}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.deleting') || 'Đang xóa...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{t('common.delete')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

