import { useState, useEffect } from 'react';
import { Mail, MessageCircle, FileText, ExternalLink, HelpCircle, Phone, Globe, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { systemSettingsService } from '../../../services/systemSettingsService';
import { articleService } from '../../../services/articleService';
import { ArticleResponseDto } from '../../../types/api';

const HelpSupport = () => {
  const { t } = useLanguage();
  const [supportEmail, setSupportEmail] = useState('support@vipka.club');
  const [supportPhone, setSupportPhone] = useState('+84 901 234 567');
  const [articles, setArticles] = useState<ArticleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelpData = async () => {
      setLoading(true);
      try {
        const [settingsRes, articlesRes] = await Promise.allSettled([
          systemSettingsService.getSystemSettings(),
          articleService.getArticles({ page: 1, limit: 5 }),
        ]);

        if (settingsRes.status === 'fulfilled' && settingsRes.value) {
          const s = settingsRes.value;
          if ((s as any)?.general?.systemEmail) {
            setSupportEmail((s as any).general.systemEmail);
          }
        }

        if (articlesRes.status === 'fulfilled' && articlesRes.value) {
          setArticles(articlesRes.value.data || []);
        }
      } catch (err) {
        console.warn('Could not load help data from API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpData();
  }, []);

  const supportChannels = [
    {
      icon: Mail,
      title: t('pages.helpSupport.emailSupport') || 'Email Hỗ trợ VIP',
      description: t('pages.helpSupport.emailSupportDesc') || 'Gửi email cho bộ phận hỗ trợ kỹ thuật và vận hành 24/7',
      action: supportEmail,
      link: `mailto:${supportEmail}`,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      icon: MessageCircle,
      title: t('pages.helpSupport.liveChat') || 'Trò chuyện Trực tiếp',
      description: t('pages.helpSupport.liveChatDesc') || 'Kết nối trực tiếp với nhân viên hỗ trợ trực ban',
      action: t('pages.helpSupport.startChat') || 'Bắt đầu chat',
      link: '#',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      icon: Phone,
      title: t('pages.helpSupport.phoneSupport') || 'Hotline Khẩn cấp',
      description: t('pages.helpSupport.phoneSupportDesc') || 'Đường dây nóng hỗ trợ sự cố thanh toán và kỹ thuật',
      action: supportPhone,
      link: `tel:${supportPhone.replace(/\s+/g, '')}`,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];

  const faqCategories = [
    {
      title: t('pages.helpSupport.gettingStarted') || 'Khởi đầu & Đăng nhập',
      questions: [
        {
          q: t('pages.helpSupport.faq1Question') || 'Làm thế nào để phân quyền cho quản trị viên mới?',
          a: t('pages.helpSupport.faq1Answer') || 'Vào mục "Phân quyền & Vai trò" (RBAC), chọn vai trò phù hợp và gán quyền hạn tương ứng cho tài khoản.',
        },
        {
          q: t('pages.helpSupport.faq2Question') || 'Cách kích hoạt bảo mật 2 lớp (2FA)?',
          a: t('pages.helpSupport.faq2Answer') || 'Truy cập "Hồ sơ của tôi" > "Bảo mật tài khoản" hoặc vào "Cài đặt người dùng" để quét mã QR Authenticator hoặc nhận mã OTP qua Email.',
        },
      ],
    },
    {
      title: t('pages.helpSupport.accountManagement') || 'Quản lý Đặt phòng & Ví thanh toán',
      questions: [
        {
          q: t('pages.helpSupport.faq3Question') || 'Làm sao để xác nhận hoặc hủy một yêu cầu đặt chỗ?',
          a: t('pages.helpSupport.faq3Answer') || 'Vào menu "Đặt phòng" (Bookings), tìm đơn đặt tương ứng và cập nhật trạng thái sang "Đã xác nhận", "Hoàn thành" hoặc "Đã hủy".',
        },
        {
          q: t('pages.helpSupport.faq4Question') || 'Cách kiểm tra trạng thái cổng nạp tiền tự động?',
          a: t('pages.helpSupport.faq4Answer') || 'Kiểm tra tại menu "Ví & Thanh toán" hoặc "Trạng thái hệ thống" để theo dõi kết nối Redis, Database và các cổng thanh toán.',
        },
      ],
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('header.helpSupport')}</h1>
          <p className="text-gray-500 text-sm">{t('pages.helpSupport.description') || 'Trung tâm trợ giúp và tài liệu hướng dẫn vận hành'}</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang đồng bộ dữ liệu hỗ trợ...</span>
          </div>
        )}
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {supportChannels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border p-6 ${channel.color} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-xs ${channel.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{channel.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                  <a
                    href={channel.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    <span>{channel.action}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Published Knowledge Base Guides from API */}
      {articles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-800">Tài liệu & Cẩm nang Hướng dẫn Mới nhất</h2>
            </div>
            <a
              href="/dashboard/articles"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
            >
              Xem tất cả bài viết →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.slice(0, 3).map((art) => (
              <a
                key={art.id}
                href={`/dashboard/articles`}
                className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition group"
              >
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition mb-1 line-clamp-1">
                  {art.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {art.excerpt || art.content?.replace(/<[^>]*>?/gm, '') || 'Hướng dẫn chi tiết'}
                </p>
                <span className="text-[11px] text-purple-600 font-medium font-mono">
                  {new Date(art.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">{t('pages.helpSupport.faq') || 'Câu hỏi Thường gặp'}</h2>
        </div>

        <div className="space-y-6">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-base font-bold text-gray-800 mb-3">{category.title}</h3>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-l-4 border-purple-500 pl-4 py-1 bg-gray-50/50 rounded-r-lg">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{faq.q}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('pages.helpSupport.resources') || 'Tài nguyên Kỹ thuật'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/api"
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-purple-50/30 hover:border-purple-300 transition-colors"
          >
            <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Tài liệu API & Cổng Gateway</h3>
              <p className="text-xs text-gray-600">Đặc tả endpoint REST API, WebSocket và khóa kết nối</p>
            </div>
          </a>
          <a
            href="/dashboard/system-status"
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-purple-50/30 hover:border-purple-300 transition-colors"
          >
            <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Giám sát Trạng thái Dịch vụ</h3>
              <p className="text-xs text-gray-600">Kiểm tra kết nối trực tiếp đến PostgreSQL và Redis</p>
            </div>
          </a>
          <a
            href="/dashboard/audit-logs"
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-purple-50/30 hover:border-purple-300 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Nhật ký Hoạt động Hệ thống</h3>
              <p className="text-xs text-gray-600">Tra cứu toàn bộ lịch sử thao tác của các tài khoản quản trị</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
