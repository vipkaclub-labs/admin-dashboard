import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLanguage } from '../../../contexts/LanguageContext';
import { karaokeService } from '../../../services/karaokeService';

const KaraokeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const [karaoke, setKaraoke] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchKaraokeDetails();
    }
  }, [id]);

  const fetchKaraokeDetails = async () => {
    try {
      setLoading(true);
      const response = await karaokeService.getKaraoke(id!);

      if (response && response.data) {
        // response.data is the karaoke object (extracted by apiClient)
        setKaraoke(response.data);
      } else {
        toast.error('Không thể tải dữ liệu karaoke');
      }
    } catch (error: any) {
      console.error('Error fetching karaoke details:', error);
      toast.error('Không thể tải thông tin karaoke. Vui lòng thử lại.');
      router.push('/dashboard/karaoke');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/karaoke');
  };

  // Show loading state first
  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">{t('common.loadingData')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no karaoke data after loading is complete
  if (!karaoke) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="space-y-4">
              <p className="text-gray-500">Không thể tải thông tin karaoke</p>
              <p className="text-sm text-gray-400">ID: {id || 'không có'}</p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-2xl">
                  {karaoke.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{karaoke.name}</h1>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
                    karaoke.status?.toUpperCase() === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {karaoke.status?.toUpperCase() === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                </span>
              </div>
            </div>

            {/* Karaoke Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.email')}</label>
                <p className="text-base text-gray-900">{karaoke.email || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.status')}</label>
                <p className="text-base text-gray-900">
                  {karaoke.status?.toUpperCase() === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                </p>
              </div>

              {karaoke.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                  <p className="text-base text-gray-900">{karaoke.phoneNumber}</p>
                </div>
              )}

              {karaoke.district && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Quận/Huyện</label>
                  <p className="text-base text-gray-900">{karaoke.district}</p>
                </div>
              )}

              {karaoke.qualityLevel && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mức độ chất lượng</label>
                  <p className="text-base text-gray-900">{karaoke.qualityLevel}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Đánh giá</label>
                <p className="text-base text-gray-900">{karaoke.rating || 0}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Số lượt đánh giá</label>
                <p className="text-base text-gray-900">{karaoke.numberOfRatings || 0}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Lượt xem</label>
                <p className="text-base text-gray-900">{karaoke.views || 0}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nổi bật</label>
                <p className="text-base text-gray-900">{karaoke.featured ? 'Có' : 'Không'}</p>
              </div>

              {karaoke.address && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Địa chỉ</label>
                  <p className="text-base text-gray-900">{karaoke.address}</p>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Mô tả</label>
                <p className="text-base text-gray-900">{karaoke.description || '-'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Tags</label>
                <p className="text-base text-gray-900">
                  {karaoke.tags && karaoke.tags.length > 0
                    ? karaoke.tags.join(', ')
                    : 'Không có tags'
                  }
                </p>
              </div>

              {karaoke.imageUrl && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">URL hình ảnh</label>
                  <p className="text-base text-gray-900 break-all">{karaoke.imageUrl}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t('pages.tables.id')}</label>
                <p className="text-base text-gray-900 font-mono text-sm break-all">{karaoke.id}</p>
              </div>

              {karaoke.facilityId && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Facility ID</label>
                  <p className="text-base text-gray-900 font-mono text-sm break-all">{karaoke.facilityId}</p>
                </div>
              )}

              {karaoke.facilityType && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Facility Type</label>
                  <p className="text-base text-gray-900">{karaoke.facilityType}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t('common.createdAt')}</label>
                <p className="text-base text-gray-900">
                  {karaoke.createdAt
                    ? new Date(karaoke.createdAt * 1000).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <p className="text-base text-gray-900">
                  {karaoke.updatedAt
                    ? new Date(karaoke.updatedAt * 1000).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </p>
              </div>
            </div>

            {/* Config Section */}
            {karaoke.config && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Config</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(karaoke.config, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaraokeDetails;