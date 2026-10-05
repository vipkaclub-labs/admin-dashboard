// API Configuration
// Get API base URL from environment variable
const getApiBaseUrl = (): string => {
  let envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000/api";
  if (!envUrl.endsWith('/api') && !envUrl.includes('/api')) {
    envUrl = `${envUrl.replace(/\/$/, '')}/api`;
  }
  return envUrl;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000, // 30 seconds
};

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    // Legacy 2FA endpoints (not in OpenAPI spec, kept for backward compatibility)
    SETUP_2FA: '/two-factor/setup',
    REGENERATE_2FA: '/two-factor/regenerate-secret',
    VERIFY_2FA: '/two-factor/verify',
    DISABLE_2FA: '/two-factor/disable',
    SETUP_2FA_EMAIL: '/auth/2fa/setup/email',
    RECOVERY_CODES: '/two-factor/recovery-codes',
  },
  // Admin endpoints
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD_STATS: '/admin/dashboard/stats',
  },
  // Cache endpoints
  CACHE: {
    BASE: '/cache',
    BY_KEY: (key: string) => `/cache/${encodeURIComponent(key)}`,
  },
  // Health endpoints
  HEALTH: {
    BASE: '/system-status',
  },
  // System Settings endpoints
  SYSTEM_SETTINGS: {
    BASE: '/system-settings',
    BY_ID: (id: string) => `/system-settings/${id}`,
  },
  // Wallet endpoints
  WALLET: {
    BALANCE: '/wallet/balance',
    CREDIT_BALANCE: '/wallet/credit-balance',
    DEBIT_BALANCE: '/wallet/debit-balance',
    TRANSACTIONS: '/wallet/transactions',
  },
  // Payment Methods endpoints
  PAYMENT_METHODS: {
    BASE: '/payment-methods',
    BY_ID: (id: string) => `/payment-methods/${id}`,
    STATUS: (id: string) => `/payment-methods/${id}/status`,
  },
  // Audit Logs endpoints
  AUDIT_LOGS: {
    BASE: '/audit-logs',
  },
  // Promotions & Bonus endpoints
  PROMOTIONS: {
    BASE: '/promotions',
    BY_ID: (id: string) => `/promotions/${id}`,
    STATUS: (id: string) => `/promotions/${id}/status`,
  },
  // Facility endpoints
  FACILITIES: {
    BASE: '/facilities',
    BY_ID: (id: string) => `/facilities/${id}`,
  },
  // RBAC endpoints
  RBAC: {
    ROLES: '/rbac/roles',
    ROLE_BY_ID: (id: string) => `/rbac/roles/${id}`,
    ROLE_PERMISSIONS: (roleId: string) => `/rbac/roles/${roleId}/permissions`,
    PERMISSIONS: '/rbac/permissions',
    PERMISSION_BY_ID: (id: string) => `/rbac/permissions/${id}`,
    PERMISSIONS_BATCH: '/rbac/permissions/batch',
    ASSIGN_ROLES_TO_USER: (userId: string) => `/rbac/users/${userId}/roles`,
    ROLES_BATCH: '/rbac/roles/batch',
  },
  // Booking endpoints
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
  },
  // User endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  // Article endpoints
  ARTICLES: {
    BASE: '/articles',
    BY_ID: (id: string) => `/articles/${id}`,
    BY_SLUG: (slug: string) => `/articles/slug/${slug}`,
    PUBLISH: (id: string) => `/articles/${id}/publish`,
  },
  // Comment endpoints
  COMMENTS: {
    BASE: '/admin/comments',
    CREATE: '/comments',
    BY_ID: (id: string) => `/comments/${id}`,
    BY_ARTICLE: (articleId: string) => `/comments/article/${articleId}`,
    BATCH: '/comments/batch',
  },
  // Karaoke endpoints
  KARAOKE: {
    BASE: '/karaokes',
    BY_ID: (id: string) => `/karaokes/${id}`,
    BATCH: '/karaokes/batch',
  },
  // Massage endpoints
  MASSAGE: {
    BASE: '/massages',
    BY_ID: (id: string) => `/massages/${id}`,
    BATCH: '/massages/batch',
  },
  // Club endpoints
  CLUBS: {
    BASE: '/clubs',
    BY_ID: (id: string) => `/clubs/${id}`,
    BATCH: '/clubs/batch',
  },
  // Rating endpoints
  RATINGS: {
    BASE: '/admin/ratings',
    CREATE: '/ratings',
    BY_ID: (id: string) => `/ratings/${id}`,
    BY_ARTICLE: (articleId: string) => `/ratings/article/${articleId}`,
    BY_USER: (userId: string) => `/ratings/user/${userId}`,
    BATCH: '/ratings/batch',
  },
  // Document/KYC endpoints
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
    VERIFY: (id: string) => `/documents/${id}/verify`,
    BATCH: '/documents/batch',
  },
  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/admin/notifications',
    CREATE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_UNREAD: (id: string) => `/notifications/${id}/unread`,
    ARCHIVE: (id: string) => `/notifications/${id}/archive`,
    BATCH: '/notifications/batch',
  },
  // Feed endpoints
  FEEDS: {
    BASE: '/admin/feeds',
    CREATE: '/feeds',
    BY_ID: (id: string) => `/feeds/${id}`,
    BATCH: '/feeds/batch',
  },
  // Friend endpoints
  FRIENDS: {
    REQUESTS: '/friends/requests',
    REQUEST_BY_ID: (id: string) => `/friends/requests/${id}`,
    ACCEPT_REQUEST: (id: string) => `/friends/requests/${id}/accept`,
    REJECT_REQUEST: (id: string) => `/friends/requests/${id}/reject`,
    LIST: '/friends',
    BY_ID: (friendId: string) => `/friends/${friendId}`,
  },
  // Chat endpoints
  CHATS: {
    ROOMS: '/chats/rooms',
    ROOM_BY_ID: (id: string) => `/chats/rooms/${id}`,
    ROOM_PARTICIPANTS: (id: string) => `/chats/rooms/${id}/participants`,
    REMOVE_PARTICIPANT: (roomId: string, userId: string) => `/chats/rooms/${roomId}/participants/${userId}`,
    MESSAGES: (roomId: string) => `/chats/rooms/${roomId}/messages`,
    MARK_READ: (roomId: string) => `/chats/rooms/${roomId}/messages/read`,
    DELETE_MESSAGE: (id: string) => `/chats/messages/${id}`,
  },
  // Follow endpoints
  FOLLOW: {
    BY_USER: (userId: string) => `/follow/${userId}`,
    FOLLOWERS: '/follow/followers',
    FOLLOWERS_BY_USER: (userId: string) => `/follow/followers/${userId}`,
    FOLLOWING: '/follow/following',
    FOLLOWING_BY_USER: (userId: string) => `/follow/following/${userId}`,
    STATS: (userId: string) => `/follow/stats/${userId}`,
    STATUS: (userId: string) => `/follow/status/${userId}`,
  },
  // Reaction endpoints
  REACTIONS: {
    BY_ARTICLE: (articleId: string) => `/articles/${articleId}/reactions`,
    STATS: (articleId: string) => `/articles/${articleId}/reactions/stats`,
  },
  // Favorite endpoints
  FAVORITES: {
    KARAOKE: (karaokeId: string) => `/favorites/karaoke/${karaokeId}`,
  },
  // Image endpoints
  IMAGES: {
    BASE: '/images',
    BY_ID: (id: string) => `/images/${id}`,
  },
  // Public endpoints
  PUBLIC: {
    FACILITIES: '/public/facilities',
    FACILITY_BY_ID: (id: string) => `/public/facilities/${id}`,
    FACILITY_COUPONS: (id: string) => `/public/facilities/${id}/coupons`,
    KARAOKES: '/public/karaokes',
    MASSAGES: '/public/massages',
    CLUBS: '/public/clubs',
    ALL: '/public/all',
  },
  // Two-Factor endpoints (explicit)
  TWO_FACTOR: {
    SETUP: '/two-factor/setup',
    VERIFY: '/two-factor/verify',
    RESEND_EMAIL_OTP: '/two-factor/resend-email-otp',
    REGENERATE_SECRET: '/two-factor/regenerate-secret',
    RECOVERY_CODES: '/two-factor/recovery-codes',
    USE_RECOVERY_CODE: '/two-factor/recovery-codes/use',
    DISABLE_CHALLENGE: '/two-factor/disable-2fa-challenge',
    CONFIGS: '/two-factor/configs',
    DISABLE: '/two-factor/disable',
  },
};

