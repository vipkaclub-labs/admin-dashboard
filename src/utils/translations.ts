// Cấu trúc translations - dễ dàng mở rộng thêm ngôn ngữ mới
export interface Translations {
  common: {
    search: string;
    profile: string;
    settings: string;
    help: string;
    logout: string;
    fullscreen: string;
    messages: string;
    notifications: string;
    viewAll: string;
    language: string;
    user: string;
    searchPlaceholder: string;
    searchBy: string;
    // Actions
    save: string;
    cancel: string;
    delete: string;
    editAction: string;
    add: string;
    create: string;
    update: string;
    submit: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    view: string;
    detailsAction: string;
    actions: string;
    // Status
    status: string;
    active: string;
    inactive: string;
    success: string;
    error: string;
    loading: string;
    yes: string;
    no: string;
    ok: string;
    // Login
    providerOperatorPortal: string;
    login: string;
    welcome: string;
    emailOrUsername: string;
    password: string;
    forgotPassword: string;
    loggingIn: string;
    // Messages
    pleaseFillAllFields: string;
    loginSuccess: string;
    loginFailed: string;
    checkLoginInfo: string;
    logoutSuccess: string;
    logoutLocal: string;
    // Table & List
    filter: string;
    noData: string;
    loadingData: string;
    showing: string;
    to: string;
    of: string;
    page: string;
    // Status
    paused: string;
    banned: string;
    suspicious: string;
    // Actions
    creating: string;
    deleting: string;
    updating: string;
    saving: string;
    // Forms
    name: string;
    email: string;
    code: string;
    description: string;
    phone: string;
    username: string;
    // Modals
    addNew: string;
    confirmDelete: string;
    deleteConfirmMessage: string;
    deleteWarning: string;
    // Placeholders
    enterName: string;
    enterEmail: string;
    enterGameName: string;
    enterProviderAccountEmail: string;
    // Details
    createdAt: string;
    lastLogin: string;
    neverLoggedIn: string;
    additionalInfo: string;
    edit: string;
    // Dashboard
    overview: string;
    increased: string;
    decreased: string;
    weeklySales: string;
    weeklyOrders: string;
    visitorsOnline: string;
    visitAndSalesStatistics: string;
    trafficSources: string;
    searchEngines: string;
    directClick: string;
    bookmarksClick: string;
    recentTickets: string;
    assignee: string;
    subject: string;
    lastUpdate: string;
    trackingId: string;
    done: string;
  };
  pages: {
    dashboard: {
      title: string;
      overview: string;
      weeklySales: string;
      weeklyOrders: string;
      visitorsOnline: string;
      visitAndSalesStatistics: string;
      trafficSources: string;
      searchEngines: string;
      directClick: string;
      bookmarksClick: string;
      recentTickets: string;
      assignee: string;
      subject: string;
      lastUpdate: string;
      trackingId: string;
      done: string;
      increased: string;
      decreased: string;
      weeklyRevenue: string;
      bookingsCount: string;
      activeCustomers: string;
    };
    operators: {
      title: string;
      addOperator: string;
      createOperator: string;
      deleteOperator: string;
      operatorDetails: string;
      searchPlaceholder: string;
      createSuccess: string;
      createFailed: string;
      deleteSuccess: string;
      deleteFailed: string;
      viewDetails: string;
      deleteOperatorTitle: string;
      description: string;
      noOperatorsFound: string;
      noOperatorsYet: string;
      operatorCode: string;
      operatorName: string;
      enterOperatorCode: string;
      enterOperatorName: string;
      randomData: string;
      random: string;
      edit: string;
      userNotFound: string;
      operatorsLabel: string;
    };
    games: {
      title: string;
      addGame: string;
      createGame: string;
      searchPlaceholder: string;
      description: string;
      venueManagement: string;
      venueName: string;
      venueType: string;
      venueTypeKaraoke: string;
      venueTypeMassage: string;
      venueTypeClub: string;
      bookingsCount: string;
      revenue: string;
      addVenue: string;
      searchVenuePlaceholder: string;
      enterVenueName: string;
      actions: string;
      noVenuesYet: string;
      createSuccess: string;
      deleteSuccess: string;
      deleteFailed: string;
    };
    providerAccounts: {
      title: string;
      addAccount: string;
      createAccount: string;
      deleteAccount: string;
      searchPlaceholder: string;
      createSuccess: string;
      createFailed: string;
      deleteSuccess: string;
      deleteFailed: string;
      deleteAccountTitle: string;
      description: string;
      totalAccounts: string;
      activeAccounts: string;
      loadingAccounts: string;
      providerAccount: string;
      noAccountsFound: string;
      noAccountsYet: string;
      randomData: string;
      random: string;
    };
    roles: {
      title: string;
      addRole: string;
      createRole: string;
      editRole: string;
      deleteRole: string;
      searchPlaceholder: string;
      createSuccess: string;
      createFailed: string;
      updateSuccess: string;
      updateFailed: string;
      deleteSuccess: string;
      deleteFailed: string;
      role: string;
      slug: string;
      description: string;
      permissions: string;
      noRolesFound: string;
      noRolesYet: string;
      loadingRoles: string;
      loadingPermissions: string;
      operatorAccounts: string;
      operatorAccount: string;
      selectPermissions: string;
      // Assign permissions
      assignPermissions: string;
      assignPermissionsToRole: string;
      saveChanges: string;
      saving: string;
      selectAll: string;
      selectedCount: string;
      noPermissionsYet: string;
      assignSuccess: string;
      assignFailed: string;
      loadPermissionsFailed: string;
    };
    permissions: {
      title: string;
      addPermission: string;
      createPermission: string;
      editPermission: string;
      deletePermission: string;
      searchPlaceholder: string;
      createSuccess: string;
      createFailed: string;
      updateSuccess: string;
      updateFailed: string;
      deleteSuccess: string;
      deleteFailed: string;
      permission: string;
      slug: string;
      description: string;
      resource: string;
      action: string;
      content: string;
      detailedContent: string;
      selectAction: string;
      selectResourceAndAction: string;
      enterPermissionName: string;
      enterSlug: string;
      enterResource: string;
      enterDescription: string;
      enterDetailedContent: string;
      noPermissionsFound: string;
      noPermissionsYet: string;
      loadingPermissions: string;
      // Pagination
      showing: string;
      of: string;
      page: string;
      previous: string;
      next: string;
      // Delete confirmation
      deleteConfirmMessage: string;
    };
    wallet: {
      title: string;
      addMethod: string;
      totalMethods: string;
      activeMethods: string;
      totalDailyLimit: string;
      dailyLimit: string;
      monthlyLimit: string;
      bank: string;
      ewallet: string;
      gateway: string;
      description: string;
    };
    promotions: {
      title: string;
      createPromotion: string;
      totalPrograms: string;
      ongoing: string;
      totalParticipants: string;
      totalBonusAwarded: string;
      programName: string;
      bonus: string;
      maxBonus: string;
      participants: string;
      startDate: string;
      endDate: string;
      firstDeposit: string;
      deposit: string;
      cashback: string;
      tournament: string;
      rebate: string;
      upcoming: string;
      expired: string;
      to: string;
      description: string;
    };
    transactions: {
      title: string;
      searchPlaceholder: string;
      exportReport: string;
      totalTransactionsToday: string;
      totalDeposit: string;
      totalWithdraw: string;
      pendingProcessing: string;
      transactionCode: string;
      amount: string;
      paymentMethod: string;
      time: string;
      deposit: string;
      withdraw: string;
      bet: string;
      completed: string;
      rejected: string;
      description: string;
      customer: string;
      venue: string;
      transactionTypeBooking: string;
      transactionTypeService: string;
      transactionTypeDeposit: string;
      transactionTypeWithdraw: string;
      transactionTypeRefund: string;
      paymentMethodCash: string;
      paymentMethodTransfer: string;
      paymentMethodEwallet: string;
      statusPending: string;
      statusCompleted: string;
      statusRejected: string;
      searchTransactionPlaceholder: string;
      totalRevenue: string;
      totalRefund: string;
    };
    auditLogs: {
      title: string;
      searchPlaceholder: string;
      description: string;
      exportLogs: string;
      time: string;
      user: string;
      action: string;
      resource: string;
      ipAddress: string;
      login: string;
      logout: string;
      updatePlayer: string;
      createPromotion: string;
      deleteGame: string;
      changeSettings: string;
      viewSensitiveData: string;
    };
    settings: {
      title: string;
      saveSettings: string;
      generalSettings: string;
      notificationSettings: string;
      securitySettings: string;
      paymentSettings: string;
      systemName: string;
      systemDescription: string;
      defaultLanguage: string;
      emailNotification: string;
      emailNotificationDesc: string;
      pushNotification: string;
      pushNotificationDesc: string;
      smsAlert: string;
      smsAlertDesc: string;
      security: string;
      sessionTimeout: string;
      maxLoginAttempts: string;
      require2FA: string;
      require2FADesc: string;
      minDepositLimit: string;
      minWithdrawLimit: string;
      withdrawProcessingTime: string;
      description: string;
    };
    api: {
      title: string;
      createApiKey: string;
      description: string;
      totalApiKeys: string;
      activeKeys: string;
      totalRequestsToday: string;
      avgResponseTime: string;
      apiKeys: string;
      apiKey: string;
      lastUsed: string;
      requests: string;
      rateLimit: string;
      apiEndpoints: string;
      method: string;
      path: string;
      callsToday: string;
      avgResponse: string;
    };
    alerts: {
      totalAlerts: string;
      unread: string;
      warning: string;
      totalAlertsLabel: string;
      description: string;
      alertHighSystemLoad: string;
      alertPaymentGatewayTimeout: string;
      alertBackupCompleted: string;
      alertRateLimitNear: string;
      alertDeploymentSuccess: string;
      alertHighSystemLoadMessage: string;
      alertPaymentGatewayTimeoutMessage: string;
      alertBackupCompletedMessage: string;
      alertRateLimitNearMessage: string;
      alertDeploymentSuccessMessage: string;
    };
    monitoring: {
      online: string;
      offline: string;
      warning: string;
      systemStatus: string;
      service: string;
      uptime: string;
      latency: string;
      avgUptime: string;
      totalServices: string;
      recentEvents: string;
      description: string;
      serviceGameServer: string;
      servicePaymentGateway: string;
      serviceDatabase: string;
      serviceApiGateway: string;
      serviceNotificationService: string;
      eventHighLoad: string;
      eventBackupCompleted: string;
      eventTransactionProcessed: string;
      eventRateLimitWarning: string;
      eventNewPlayerJoined: string;
    };
    risk: {
      totalAlerts: string;
      fraud: string;
      unusualPattern: string;
      accountCompromise: string;
      pending: string;
      investigating: string;
      resolved: string;
      critical: string;
      high: string;
      medium: string;
      low: string;
      lockedAccounts: string;
      type: string;
      severity: string;
      time: string;
      title: string;
      description: string;
    };
    analytics: {
      registration: string;
      firstDeposit: string;
      playGame: string;
      activeUsers: string;
      revenuePerDay: string;
      sessions: string;
      conversionRate: string;
      performanceLast5Days: string;
      conversionRateChart: string;
      revenueTrend: string;
      comparedToYesterday: string;
      description: string;
    };
    reports: {
      exportPdf: string;
      exportExcel: string;
      monthlyRevenue: string;
      profit: string;
      revenueByMonth: string;
      revenue: string;
      winRate: string;
      comparedToLastMonth: string;
      description: string;
    };
    players: {
      totalPlayers: string;
      activePlayers: string;
      inactivePlayers: string;
      totalBalance: string;
      username: string;
      balance: string;
      registrationDate: string;
      description: string;
    };
    profile: {
      description: string;
      personalInfo: string;
      accountSecurity: string;
      changePassword: string;
      changePasswordDesc: string;
      twoFactorAuth: string;
      twoFactorAuthDesc: string;
      changePhoto: string;
    };
    userSettings: {
      description: string;
      notifications: string;
      appearance: string;
      privacy: string;
      emailNotifications: string;
      emailNotificationsDesc: string;
      pushNotifications: string;
      pushNotificationsDesc: string;
      smsNotifications: string;
      smsNotificationsDesc: string;
      language: string;
      theme: string;
      light: string;
      dark: string;
      auto: string;
      showEmail: string;
      showEmailDesc: string;
      showPhone: string;
      showPhoneDesc: string;
    };
    helpSupport: {
      description: string;
      emailSupport: string;
      emailSupportDesc: string;
      liveChat: string;
      liveChatDesc: string;
      startChat: string;
      phoneSupport: string;
      phoneSupportDesc: string;
      faq: string;
      gettingStarted: string;
      accountManagement: string;
      faq1Question: string;
      faq1Answer: string;
      faq2Question: string;
      faq2Answer: string;
      faq3Question: string;
      faq3Answer: string;
      faq4Question: string;
      faq4Answer: string;
      resources: string;
      userGuide: string;
      userGuideDesc: string;
      apiDocumentation: string;
      apiDocumentationDesc: string;
      community: string;
      communityDesc: string;
    };
    tables: {
      id: string;
      player: string;
      type: string;
      severity: string;
      description: string;
      status: string;
      time: string;
      actions: string;
      service: string;
      uptime: string;
      latency: string;
      players: string;
      gameName: string;
      revenue: string;
      totalWagered: string;
      game: string;
      wagered: string;
    };
  };
  header: {
    providerPortal: string;
    operatorPortal: string;
    adminPortal: string;
    myProfile: string;
    helpSupport: string;
  };
  menu: {
    dashboard: string;
    bookingsManagement?: string;
    venuesManagement: string;

    gamesManagement: string;
    operatorsManagement: string;
    providerAccountsManagement: string;
    rolesPermissionsManagement: string;
    rolesManagement: string;
    permissionsManagement: string;
    playersManagement: string;
    transactions: string;
    walletPayment: string;
    promotionsBonus: string;
    reports: string;
    analytics: string;
    articlesManagement: string;
    usersManagement: string;
    commentsManagement: string;
    ratingsManagement: string;
    notificationsManagement: string;
    feedsManagement: string;
    kycManagement: string;
    monitoring: string;
    riskManagement: string;
    apiManagement: string;
    alerts: string;
    auditLogs: string;
    cachingManagement: string;
    systemStatus: string;
    systemSettings: string;
  };
  languages: {
    en: string;
    vi: string;
    zh: string;
    th: string;
    ja: string;
    ko: string;
  };
}

// Định nghĩa các ngôn ngữ được hỗ trợ (chỉ hiển thị en và vi)
export type SupportedLanguage = 'en' | 'vi';

// Internal type cho tất cả ngôn ngữ có trong translations (giữ lại để không phá vỡ code)
type AllLanguages = 'en' | 'vi' | 'zh' | 'th' | 'ja' | 'ko';

// Translations cho từng ngôn ngữ
const translations: Record<AllLanguages, Translations> = {
  en: {
    common: {
      search: 'Search',
      profile: 'Profile',
      settings: 'Settings',
      help: 'Help',
      logout: 'Logout',
      fullscreen: 'Fullscreen',
      messages: 'Messages',
      notifications: 'Notifications',
      viewAll: 'View All',
      language: 'Language',
      user: 'User',
      searchPlaceholder: 'Search...',
      searchBy: 'Search by',
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      editAction: 'Edit',
      detailsAction: 'Details',
      add: 'Add',
      create: 'Create',
      update: 'Update',
      submit: 'Submit',
      confirm: 'Confirm',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      view: 'View',
      actions: 'Actions',
      // Status
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      success: 'Success',
      error: 'Error',
      loading: 'Loading',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      // Login
      providerOperatorPortal: 'Provider & Operator Portal',
      login: 'Login',
      welcome: 'Welcome back!',
      emailOrUsername: 'Email or Username',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      loggingIn: 'Logging in...',
      // Messages
      pleaseFillAllFields: 'Please fill in all fields',
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed. Please check your login information.',
      checkLoginInfo: 'Login failed. Please check your login information.',
      logoutSuccess: 'Logged out successfully!',
      logoutLocal: 'Logged out locally',
      // Table & List
      filter: 'Filter',
      noData: 'No data available',
      loadingData: 'Loading data...',
      showing: 'Showing',
      to: 'to',
      of: 'of',
      page: 'Page',
      // Status
      paused: 'Paused',
      banned: 'Banned',
      suspicious: 'Suspicious Activity',
      // Actions
      creating: 'Creating...',
      deleting: 'Deleting...',
      updating: 'Updating...',
      saving: 'Saving...',
      // Forms
      name: 'Name',
      email: 'Email',
      code: 'Code',
      description: 'Description',
      phone: 'Phone',
      username: 'Username',
      // Modals
      addNew: 'Add New',
      confirmDelete: 'Confirm Delete',
      deleteConfirmMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
      deleteWarning: 'This action cannot be undone.',
      // Placeholders
      enterName: 'Enter name...',
      enterEmail: 'Enter email...',
      enterGameName: 'Enter game name...',
      enterProviderAccountEmail: 'Enter provider account email...',
      // Details
      createdAt: 'Created Date',
      lastLogin: 'Last Login',
      neverLoggedIn: 'Never logged in',
      additionalInfo: 'Additional Information',
      edit: 'Edit',
      // Dashboard
      overview: 'Overview',
      increased: 'Increased',
      decreased: 'Decreased',
      weeklySales: 'Weekly Sales',
      weeklyOrders: 'Weekly Orders',
      visitorsOnline: 'Visitors Online',
      visitAndSalesStatistics: 'Visit And Sales Statistics',
      trafficSources: 'Traffic Sources',
      searchEngines: 'Search Engines',
      directClick: 'Direct Click',
      bookmarksClick: 'Bookmarks Click',
      recentTickets: 'Recent Tickets',
      assignee: 'Assignee',
      subject: 'Subject',
      lastUpdate: 'Last Update',
      trackingId: 'Tracking ID',
      done: 'DONE',
    },
    pages: {
      dashboard: {
        title: 'Dashboard',
        overview: 'Overview',
        weeklySales: 'Weekly Sales',
        weeklyOrders: 'Weekly Orders',
        visitorsOnline: 'Visitors Online',
        visitAndSalesStatistics: 'Visit And Sales Statistics',
        trafficSources: 'Traffic Sources',
        searchEngines: 'Search Engines',
        directClick: 'Direct Click',
        bookmarksClick: 'Bookmarks Click',
        recentTickets: 'Recent Tickets',
        assignee: 'Assignee',
        subject: 'Subject',
        lastUpdate: 'Last Update',
        trackingId: 'Tracking ID',
        done: 'DONE',
        increased: 'Increased',
        decreased: 'Decreased',
        weeklyRevenue: 'Weekly Revenue',
        bookingsCount: 'Bookings Count',
        activeCustomers: 'Active Customers',
      },
      operators: {
        title: 'Karaoke Management',
        addOperator: 'Add Karaoke',
        createOperator: 'Create Karaoke',
        deleteOperator: 'Delete Karaoke',
        operatorDetails: 'Karaoke Details',
        searchPlaceholder: 'Search by name, email...',
        createSuccess: 'Karaoke created successfully!',
        createFailed: 'Failed to create karaoke. Please try again.',
        deleteSuccess: 'Karaoke deleted successfully!',
        deleteFailed: 'Failed to delete karaoke. Please try again.',
        viewDetails: 'View Details',
        deleteOperatorTitle: 'Delete Karaoke',
        description: 'Manage and track karaokes in the system',
        noOperatorsFound: 'No karaokes found',
        noOperatorsYet: 'No karaokes yet',
        operatorCode: 'Karaoke Code',
        operatorName: 'Karaoke Name',
        enterOperatorCode: 'Enter karaoke code...',
        enterOperatorName: 'Enter karaoke name...',
        randomData: 'Random data',
        random: 'Random',
        edit: 'Edit',
        userNotFound: 'User information not found',
        operatorsLabel: 'karaokes',
      },
      games: {
        title: 'Club Management',
        addGame: 'Add Club',
        createGame: 'Create Club',
        searchPlaceholder: 'Search club...',
        description: 'Manage and track clubs in the system',
        venueManagement: 'Club Management',
        venueName: 'Club Name',
        venueType: 'Club Type',
        venueTypeKaraoke: 'Karaoke',
        venueTypeMassage: 'Massage',
        venueTypeClub: 'Club',
        bookingsCount: 'Bookings',
        revenue: 'Revenue',
        addVenue: 'Add New Club',
        searchVenuePlaceholder: 'Search clubs...',
        enterVenueName: 'Enter club name',
        actions: 'Actions',
        noVenuesYet: 'No clubs yet',
        createSuccess: 'Created successfully',
        deleteSuccess: 'Deleted successfully',
        deleteFailed: 'Delete failed',
      },
      providerAccounts: {
        title: 'Massage Management',
        addAccount: 'Add Massage',
        createAccount: 'Create Massage',
        deleteAccount: 'Delete Massage',
        searchPlaceholder: 'Search by name, email, code...',
        createSuccess: 'Massage created successfully!',
        createFailed: 'Failed to create massage. Please try again.',
        deleteSuccess: 'Massage deleted successfully!',
        deleteFailed: 'Failed to delete massage. Please try again.',
        deleteAccountTitle: 'Delete Massage',
        description: 'Manage and track massage accounts in the system',
        totalAccounts: 'Total Accounts',
        activeAccounts: 'Active',
        loadingAccounts: 'Loading massage accounts list...',
        providerAccount: 'Massage',
        noAccountsFound: 'No massage accounts found',
        noAccountsYet: 'No massage accounts yet',
        randomData: 'Random data',
        random: 'Random',
      },
      roles: {
        title: 'Roles Management',
        addRole: 'Add Role',
        createRole: 'Create Role',
        editRole: 'Edit Role',
        deleteRole: 'Delete Role',
        searchPlaceholder: 'Search role...',
        createSuccess: 'Role created successfully!',
        createFailed: 'Failed to create role. Please try again.',
        updateSuccess: 'Role updated successfully!',
        updateFailed: 'Failed to update role. Please try again.',
        deleteSuccess: 'Role deleted successfully!',
        deleteFailed: 'Failed to delete role. Please try again.',
        role: 'Role',
        slug: 'Slug',
        description: 'Description',
        permissions: 'Permissions',
        noRolesFound: 'No roles found',
        noRolesYet: 'No roles yet',
        loadingRoles: 'Loading roles list...',
        loadingPermissions: 'Loading permissions list...',
        operatorAccounts: 'Operator Accounts',
        operatorAccount: 'Operator Account',
        selectPermissions: 'Select Permissions',
        // Assign permissions
        assignPermissions: 'Assign Permissions',
        assignPermissionsToRole: 'Assign permissions to role',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        selectAll: 'Select all',
        selectedCount: 'Selected',
        noPermissionsYet: 'No permissions in the system yet',
        assignSuccess: 'Permissions assigned successfully!',
        assignFailed: 'Failed to assign permissions. Please try again.',
        loadPermissionsFailed: 'Failed to load permissions list',
      },
      permissions: {
        title: 'Permissions Management',
        addPermission: 'Add Permission',
        createPermission: 'Create Permission',
        editPermission: 'Edit Permission',
        deletePermission: 'Delete Permission',
        searchPlaceholder: 'Search by name, slug, resource...',
        createSuccess: 'Permission created successfully!',
        createFailed: 'Failed to create permission. Please try again.',
        updateSuccess: 'Permission updated successfully!',
        updateFailed: 'Failed to update permission. Please try again.',
        deleteSuccess: 'Permission deleted successfully!',
        deleteFailed: 'Failed to delete permission. Please try again.',
        permission: 'Permission',
        slug: 'Slug',
        description: 'Description',
        resource: 'Resource',
        action: 'Action',
        content: 'Content',
        detailedContent: 'Detailed Content',
        selectAction: 'Select action...',
        selectResourceAndAction: 'Please select Resource and Action',
        enterPermissionName: 'Enter permission name...',
        enterSlug: 'e.g., users.view, venues.manage...',
        enterResource: 'e.g., users, venues, dashboard...',
        enterDescription: 'Enter description about permission...',
        enterDetailedContent: 'Enter detailed content about permission (optional)...',
        noPermissionsFound: 'No permissions found',
        noPermissionsYet: 'No permissions yet',
        loadingPermissions: 'Loading permissions list...',
        // Pagination
        showing: 'Showing',
        of: 'of',
        page: 'Page',
        previous: 'Previous',
        next: 'Next',
        // Delete confirmation
        deleteConfirmMessage: 'Are you sure you want to delete permission',
      },
      wallet: {
        title: 'Wallet & Payment',
        addMethod: 'Add Payment Method',
        totalMethods: 'Total Methods',
        activeMethods: 'Active Methods',
        totalDailyLimit: 'Total Daily Limit',
        dailyLimit: 'Daily Limit',
        monthlyLimit: 'Monthly Limit',
        bank: 'Bank',
        ewallet: 'E-Wallet',
        gateway: 'Payment Gateway',
        description: 'Manage payment methods and wallet settings',
      },
      promotions: {
        title: 'Promotions & Bonus',
        createPromotion: 'Create Promotion',
        totalPrograms: 'Total Programs',
        ongoing: 'Ongoing',
        totalParticipants: 'Total Participants',
        totalBonusAwarded: 'Total Bonus Awarded',
        programName: 'Program Name',
        bonus: 'Bonus',
        maxBonus: 'Max Bonus',
        participants: 'Participants',
        startDate: 'Start Date',
        endDate: 'End Date',
        firstDeposit: 'First Deposit',
        deposit: 'Deposit',
        cashback: 'Cashback',
        tournament: 'Tournament',
        rebate: 'Rebate',
        upcoming: 'Upcoming',
        expired: 'Expired',
        to: 'to',
        description: 'Manage promotions and bonus programs',
      },
      transactions: {
        title: 'Transactions',
        searchPlaceholder: 'Search transactions (ID, Player)...',
        exportReport: 'Export Report',
        totalTransactionsToday: 'Total Transactions Today',
        totalDeposit: 'Total Deposit',
        totalWithdraw: 'Total Withdraw',
        pendingProcessing: 'Pending Processing',
        transactionCode: 'Transaction Code',
        amount: 'Amount',
        paymentMethod: 'Payment Method',
        time: 'Time',
        deposit: 'Deposit',
        withdraw: 'Withdraw',
        bet: 'Bet',
        completed: 'Completed',
        rejected: 'Rejected',
        description: 'View and manage all transactions in the system',
        customer: 'Customer',
        venue: 'Venue',
        transactionTypeBooking: 'Booking',
        transactionTypeService: 'Service',
        transactionTypeDeposit: 'Deposit',
        transactionTypeWithdraw: 'Withdraw',
        transactionTypeRefund: 'Refund',
        paymentMethodCash: 'Cash',
        paymentMethodTransfer: 'Bank Transfer',
        paymentMethodEwallet: 'E-Wallet',
        statusPending: 'Pending',
        statusCompleted: 'Completed',
        statusRejected: 'Rejected',
        searchTransactionPlaceholder: 'Search transactions (code, customer, venue)...',
        totalRevenue: 'Total Revenue',
        totalRefund: 'Total Refund',
      },
      settings: {
        title: 'System Settings',
        saveSettings: 'Save Settings',
        generalSettings: 'General Settings',
        notificationSettings: 'Notification Settings',
        securitySettings: 'Security Settings',
        paymentSettings: 'Payment Settings',
        systemName: 'System Name',
        systemDescription: 'Description',
        defaultLanguage: 'Default Language',
        emailNotification: 'Email Notification',
        emailNotificationDesc: 'Send email for important events',
        pushNotification: 'Push Notification',
        pushNotificationDesc: 'Push notifications to admin',
        smsAlert: 'SMS Alert',
        smsAlertDesc: 'Send SMS for important alerts',
        security: 'Security',
        sessionTimeout: 'Session Timeout (minutes)',
        maxLoginAttempts: 'Max Failed Login Attempts',
        require2FA: 'Require 2FA',
        require2FADesc: 'Two-factor authentication for admin',
        minDepositLimit: 'Min Deposit Limit (VND)',
        minWithdrawLimit: 'Min Withdraw Limit (VND)',
        withdrawProcessingTime: 'Withdraw Processing Time (hours)',
        description: 'Configure system settings and preferences',
      },
      alerts: {
        totalAlerts: 'Total Alerts',
        unread: 'Unread',
        warning: 'Warning',
        totalAlertsLabel: 'Total Alerts',
        description: 'View and manage system alerts and notifications',
        alertHighSystemLoad: 'High System Load',
        alertPaymentGatewayTimeout: 'Payment Gateway Timeout',
        alertBackupCompleted: 'Backup Completed',
        alertRateLimitNear: 'Rate Limit Near',
        alertDeploymentSuccess: 'Deployment Success',
        alertHighSystemLoadMessage: 'CPU usage reached 85%',
        alertPaymentGatewayTimeoutMessage: 'Unable to connect to payment gateway',
        alertBackupCompletedMessage: 'Database backup completed successfully',
        alertRateLimitNearMessage: 'API rate limit reached 90%',
        alertDeploymentSuccessMessage: 'Version 2.1.0 has been deployed',
      },
      reports: {
        exportPdf: 'Export PDF',
        exportExcel: 'Export Excel',
        monthlyRevenue: 'Monthly Revenue',
        profit: 'Profit',
        revenueByMonth: 'Revenue by Month',
        revenue: 'Revenue',
        winRate: 'Win Rate',
        comparedToLastMonth: '↑ % compared to last month',
        description: 'View and export system reports and statistics',
      },
      analytics: {
        registration: 'Registration',
        firstDeposit: 'First Deposit',
        playGame: 'Play Game',
        activeUsers: 'Active Users',
        revenuePerDay: 'Revenue/Day',
        sessions: 'Sessions',
        conversionRate: 'Conversion Rate',
        performanceLast5Days: 'Performance Last 5 Days',
        conversionRateChart: 'Conversion Rate',
        revenueTrend: 'Revenue Trend',
        comparedToYesterday: '↑ % compared to yesterday',
        description: 'View performance analytics and metrics',
      },
      monitoring: {
        online: 'Online',
        offline: 'Offline',
        warning: 'Warning',
        systemStatus: 'System Status',
        service: 'Service',
        uptime: 'Uptime',
        latency: 'Latency',
        avgUptime: 'Avg Uptime',
        totalServices: 'Total Services',
        recentEvents: 'Recent Events',
        description: 'Monitor system services and performance',
        serviceGameServer: 'Game Server',
        servicePaymentGateway: 'Payment Gateway',
        serviceDatabase: 'Database',
        serviceApiGateway: 'API Gateway',
        serviceNotificationService: 'Notification Service',
        eventHighLoad: 'High load detected',
        eventBackupCompleted: 'Backup completed',
        eventTransactionProcessed: 'Transaction processed',
        eventRateLimitWarning: 'Rate limit warning',
        eventNewPlayerJoined: 'New player joined',
      },
      risk: {
        totalAlerts: 'Total Risk Alerts',
        fraud: 'Fraud',
        unusualPattern: 'Unusual Pattern',
        accountCompromise: 'Account Compromise',
        pending: 'Pending',
        investigating: 'Investigating',
        resolved: 'Resolved',
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        lockedAccounts: 'Locked Accounts',
        type: 'Type',
        severity: 'Severity',
        time: 'Time',
        title: 'Risk Management',
        description: 'Detect and handle security risks',
      },
      api: {
        title: 'API Management',
        createApiKey: 'Create New API Key',
        description: 'Manage API keys and endpoints',
        totalApiKeys: 'Total API Keys',
        activeKeys: 'Active Keys',
        totalRequestsToday: 'Total Requests Today',
        avgResponseTime: 'Avg Response Time',
        apiKeys: 'API Keys',
        apiKey: 'API Key',
        lastUsed: 'Last Used',
        requests: 'Requests',
        rateLimit: 'Rate Limit',
        apiEndpoints: 'API Endpoints',
        method: 'Method',
        path: 'Path',
        callsToday: 'Calls (Today)',
        avgResponse: 'Avg Response',
      },
      auditLogs: {
        title: 'Audit Logs',
        searchPlaceholder: 'Search logs (user, action, resource)...',
        description: 'System activity and access logs',
        exportLogs: 'Export Logs',
        time: 'Time',
        user: 'User',
        action: 'Action',
        resource: 'Resource',
        ipAddress: 'IP Address',
        login: 'Login',
        logout: 'Logout',
        updatePlayer: 'Update Player',
        createPromotion: 'Create Promotion',
        deleteGame: 'Delete Game',
        changeSettings: 'Change Settings',
        viewSensitiveData: 'View Sensitive Data',
      },
      players: {
        totalPlayers: 'Total Players',
        activePlayers: 'Active Players',
        inactivePlayers: 'Inactive Players',
        totalBalance: 'Total Balance',
        username: 'Username',
        balance: 'Balance',
        registrationDate: 'Registration Date',
        description: 'Manage and track players in the system',
      },
      profile: {
        description: 'View and manage your personal profile information',
        personalInfo: 'Personal Information',
        accountSecurity: 'Account Security',
        changePassword: 'Change Password',
        changePasswordDesc: 'Update your account password for better security',
        twoFactorAuth: 'Two-Factor Authentication',
        twoFactorAuthDesc: 'Add an extra layer of security to your account',
        changePhoto: 'Change Photo',
      },
      userSettings: {
        description: 'Manage your personal settings and preferences',
        notifications: 'Notifications',
        appearance: 'Appearance',
        privacy: 'Privacy',
        emailNotifications: 'Email Notifications',
        emailNotificationsDesc: 'Receive notifications via email',
        pushNotifications: 'Push Notifications',
        pushNotificationsDesc: 'Receive push notifications in browser',
        smsNotifications: 'SMS Notifications',
        smsNotificationsDesc: 'Receive notifications via SMS',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        showEmail: 'Show Email',
        showEmailDesc: 'Display your email address to other users',
        showPhone: 'Show Phone',
        showPhoneDesc: 'Display your phone number to other users',
      },
      helpSupport: {
        description: 'Get help and support for your account and services',
        emailSupport: 'Email Support',
        emailSupportDesc: 'Send us an email and we\'ll get back to you within 24 hours',
        liveChat: 'Live Chat',
        liveChatDesc: 'Chat with our support team in real-time',
        startChat: 'Start Chat',
        phoneSupport: 'Phone Support',
        phoneSupportDesc: 'Call us for immediate assistance',
        faq: 'Frequently Asked Questions',
        gettingStarted: 'Getting Started',
        accountManagement: 'Account Management',
        faq1Question: 'How do I create an account?',
        faq1Answer: 'You can create an account by clicking on the "Register" button on the login page and filling in your information.',
        faq2Question: 'How do I reset my password?',
        faq2Answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
        faq3Question: 'How do I update my profile?',
        faq3Answer: 'Go to "My Profile" from the user menu and click "Edit" to update your information.',
        faq4Question: 'How do I enable 2FA?',
        faq4Answer: 'Go to "My Profile" > "Account Security" and follow the setup instructions for Two-Factor Authentication.',
        resources: 'Resources',
        userGuide: 'User Guide',
        userGuideDesc: 'Complete guide to using the admin dashboard',
        apiDocumentation: 'API Documentation',
        apiDocumentationDesc: 'Technical documentation for API integration',
        community: 'Community Forum',
        communityDesc: 'Join our community to get help and share ideas',
      },
      tables: {
        id: 'ID',
        player: 'Player',
        type: 'Type',
        severity: 'Severity',
        description: 'Description',
        status: 'Status',
        time: 'Time',
        actions: 'Actions',
        service: 'Service',
        uptime: 'Uptime',
        latency: 'Latency',
        players: 'Players',
        gameName: 'Game Name',
        revenue: 'Revenue',
        totalWagered: 'Total Wagered',
        game: 'Game',
        wagered: 'Wagered',
      },
    },
    header: {
      providerPortal: 'VIPKA Club',
      operatorPortal: 'Operator Portal',
      adminPortal: 'Admin Portal',
      myProfile: 'My Profile',
      helpSupport: 'Help & Support',
    },
    menu: {
      dashboard: 'Dashboard',
      bookingsManagement: 'Bookings Management',
      venuesManagement: 'Club Management',

      gamesManagement: 'Games Management',
      operatorsManagement: 'Karaoke Management',
      providerAccountsManagement: 'Massage Management',
      rolesPermissionsManagement: 'Roles & Permissions Management',
      rolesManagement: 'Roles Management',
      permissionsManagement: 'Permissions Management',
      playersManagement: 'Players Management',
      transactions: 'Transactions',
      walletPayment: 'Wallet & Payment',
      promotionsBonus: 'Promotions & Bonus',
      reports: 'Reports & Statistics',
      analytics: 'Performance Analytics',
      articlesManagement: 'Articles Management',
      usersManagement: 'Users Management',
      commentsManagement: 'Comments Management',
      ratingsManagement: 'Ratings Management',
      notificationsManagement: 'Notifications Management',
      feedsManagement: 'Feeds Management',
      kycManagement: 'KYC Management',
      monitoring: 'Monitoring',
      riskManagement: 'Risk Management',
      apiManagement: 'API Management',
      alerts: 'Alerts & Warnings',
      auditLogs: 'Audit Logs',
      cachingManagement: 'Caching Management',
      systemStatus: 'System Status',
      systemSettings: 'System Settings',
    },
    languages: {
      en: 'English',
      vi: 'Vietnamese',
      zh: 'Chinese',
      th: 'Thai',
      ja: 'Japanese',
      ko: 'Korean',
    },
  },
  vi: {
    common: {
      search: 'Tìm kiếm',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      help: 'Trợ giúp',
      logout: 'Đăng xuất',
      fullscreen: 'Toàn màn hình',
      messages: 'Tin nhắn',
      notifications: 'Thông báo',
      viewAll: 'Xem tất cả',
      language: 'Ngôn ngữ',
      user: 'Người dùng',
      searchPlaceholder: 'Tìm kiếm...',
      searchBy: 'Tìm kiếm theo',
      // Actions
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      editAction: 'Sửa',
      add: 'Thêm',
      create: 'Tạo',
      update: 'Cập nhật',
      submit: 'Gửi',
      confirm: 'Xác nhận',
      close: 'Đóng',
      back: 'Quay lại',
      next: 'Tiếp',
      previous: 'Trước',
      view: 'Xem',
      detailsAction: 'Chi tiết',
      actions: 'Hành động',
      // Status
      status: 'Trạng thái',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      success: 'Thành công',
      error: 'Lỗi',
      loading: 'Đang tải',
      yes: 'Có',
      no: 'Không',
      ok: 'OK',
      // Login
      providerOperatorPortal: 'Cổng Nhà Cung Cấp & Nhà Vận Hành',
      login: 'Đăng Nhập',
      welcome: 'Chào mừng trở lại!',
      emailOrUsername: 'Email hoặc Username',
      password: 'Mật khẩu',
      forgotPassword: 'Quên mật khẩu?',
      loggingIn: 'Đang đăng nhập...',
      // Messages
      pleaseFillAllFields: 'Vui lòng điền đầy đủ thông tin',
      loginSuccess: 'Đăng nhập thành công!',
      loginFailed: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.',
      checkLoginInfo: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.',
      logoutSuccess: 'Đăng xuất thành công!',
      logoutLocal: 'Đã đăng xuất (có thể không đồng bộ với server)',
      // Table & List
      filter: 'Lọc',
      noData: 'Không có dữ liệu',
      loadingData: 'Đang tải dữ liệu...',
      showing: 'Hiển thị',
      to: 'đến',
      of: 'trong',
      page: 'Trang',
      // Status
      paused: 'Tạm dừng',
      banned: 'Đã cấm',
      suspicious: 'Hoạt động đáng ngờ',
      // Actions
      creating: 'Đang tạo...',
      deleting: 'Đang xóa...',
      updating: 'Đang cập nhật...',
      saving: 'Đang lưu...',
      // Forms
      name: 'Tên',
      email: 'Email',
      code: 'Mã',
      description: 'Mô tả',
      phone: 'Số điện thoại',
      username: 'Tên đăng nhập',
      // Modals
      addNew: 'Thêm mới',
      confirmDelete: 'Xác nhận xóa',
      deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
      deleteWarning: 'Hành động này không thể hoàn tác.',
      // Placeholders
      enterName: 'Nhập tên...',
      enterEmail: 'Nhập email...',
      enterGameName: 'Nhập tên game...',
      enterProviderAccountEmail: 'Nhập email provider account...',
      // Details
      createdAt: 'Ngày tạo',
      lastLogin: 'Đăng nhập cuối',
      neverLoggedIn: 'Chưa đăng nhập',
      additionalInfo: 'Thông tin bổ sung',
      edit: 'Chỉnh sửa',
      // Dashboard
      overview: 'Tổng quan',
      increased: 'Tăng',
      decreased: 'Giảm',
      weeklySales: 'Doanh thu tuần',
      weeklyOrders: 'Đơn hàng tuần',
      visitorsOnline: 'Khách truy cập trực tuyến',
      visitAndSalesStatistics: 'Thống kê Truy cập và Bán hàng',
      trafficSources: 'Nguồn lưu lượng',
      searchEngines: 'Công cụ tìm kiếm',
      directClick: 'Nhấp trực tiếp',
      bookmarksClick: 'Nhấp dấu trang',
      recentTickets: 'Vé gần đây',
      assignee: 'Người được giao',
      subject: 'Chủ đề',
      lastUpdate: 'Cập nhật lần cuối',
      trackingId: 'ID Theo dõi',
      done: 'HOÀN THÀNH',
    },
    pages: {
      dashboard: {
        title: 'Dashboard',
        overview: 'Tổng quan',
        weeklySales: 'Doanh thu tuần',
        weeklyOrders: 'Đơn hàng tuần',
        visitorsOnline: 'Khách truy cập trực tuyến',
        visitAndSalesStatistics: 'Thống kê Truy cập và Bán hàng',
        trafficSources: 'Nguồn lưu lượng',
        searchEngines: 'Công cụ tìm kiếm',
        directClick: 'Nhấp trực tiếp',
        bookmarksClick: 'Nhấp dấu trang',
        recentTickets: 'Vé gần đây',
        assignee: 'Người được giao',
        subject: 'Chủ đề',
        lastUpdate: 'Cập nhật lần cuối',
        trackingId: 'ID Theo dõi',
        done: 'HOÀN THÀNH',
        increased: 'Tăng',
        decreased: 'Giảm',
        weeklyRevenue: 'Doanh thu tuần này',
        bookingsCount: 'Số lượt đặt phòng',
        activeCustomers: 'Khách hàng đang sử dụng',
      },
      operators: {
        title: 'Quản lý Karaoke',
        addOperator: 'Thêm Karaoke',
        createOperator: 'Tạo Karaoke',
        deleteOperator: 'Xóa Karaoke',
        operatorDetails: 'Chi tiết Karaoke',
        searchPlaceholder: 'Tìm kiếm theo tên, email...',
        createSuccess: 'Tạo Karaoke thành công!',
        createFailed: 'Tạo Karaoke thất bại. Vui lòng thử lại.',
        deleteSuccess: 'Xóa Karaoke thành công!',
        deleteFailed: 'Xóa Karaoke thất bại. Vui lòng thử lại.',
        viewDetails: 'Xem chi tiết',
        deleteOperatorTitle: 'Xóa Karaoke',
        description: 'Quản lý và theo dõi các Karaoke trong hệ thống',
        noOperatorsFound: 'Không tìm thấy Karaoke nào',
        noOperatorsYet: 'Chưa có Karaoke nào',
        operatorCode: 'Mã Karaoke',
        operatorName: 'Tên Karaoke',
        enterOperatorCode: 'Nhập mã karaoke...',
        enterOperatorName: 'Nhập tên karaoke...',
        randomData: 'Random dữ liệu',
        random: 'Random',
        edit: 'Chỉnh sửa',
        userNotFound: 'Không tìm thấy thông tin người dùng',
        operatorsLabel: 'karaoke',
      },
      games: {
        title: 'Quản lý Games',
        addGame: 'Thêm Game',
        createGame: 'Tạo Game',
        searchPlaceholder: 'Tìm kiếm game...',
        description: 'Quản lý và theo dõi các club trong hệ thống',
        venueManagement: 'Quản lý Club',
        venueName: 'Tên Club',
        venueType: 'Loại Club',
        venueTypeKaraoke: 'Karaoke',
        venueTypeMassage: 'Massage',
        venueTypeClub: 'Club',
        bookingsCount: 'Số lượt đặt',
        revenue: 'Doanh thu',
        addVenue: 'Thêm Club mới',
        searchVenuePlaceholder: 'Tìm kiếm Club...',
        enterVenueName: 'Nhập tên Club',
        actions: 'Thao tác',
        noVenuesYet: 'Chưa có club nào',
        createSuccess: 'Tạo thành công',
        deleteSuccess: 'Xóa thành công',
        deleteFailed: 'Xóa thất bại',
      },
      providerAccounts: {
        title: 'Quản lý Massage',
        addAccount: 'Thêm Massage',
        createAccount: 'Tạo Massage',
        deleteAccount: 'Xóa Massage',
        searchPlaceholder: 'Tìm kiếm theo tên, email, mã...',
        createSuccess: 'Tạo Massage thành công!',
        createFailed: 'Tạo Massage thất bại. Vui lòng thử lại.',
        deleteSuccess: 'Xóa Massage thành công!',
        deleteFailed: 'Xóa Massage thất bại. Vui lòng thử lại.',
        deleteAccountTitle: 'Xóa Massage',
        description: 'Quản lý và theo dõi các Massage trong hệ thống',
        totalAccounts: 'Tổng số Account',
        activeAccounts: 'Đang hoạt động',
        loadingAccounts: 'Đang tải danh sách Massage...',
        providerAccount: 'Massage',
        noAccountsFound: 'Không tìm thấy Massage nào',
        noAccountsYet: 'Chưa có Massage nào',
        randomData: 'Random dữ liệu',
        random: 'Random',
      },
      roles: {
        title: 'Quản lý Role',
        addRole: 'Thêm Role',
        createRole: 'Tạo Role',
        editRole: 'Chỉnh sửa Role',
        deleteRole: 'Xóa Role',
        searchPlaceholder: 'Tìm kiếm role...',
        createSuccess: 'Tạo Role thành công!',
        createFailed: 'Tạo Role thất bại. Vui lòng thử lại.',
        updateSuccess: 'Cập nhật Role thành công!',
        updateFailed: 'Cập nhật Role thất bại. Vui lòng thử lại.',
        deleteSuccess: 'Xóa Role thành công!',
        deleteFailed: 'Xóa Role thất bại. Vui lòng thử lại.',
        role: 'Role',
        slug: 'Slug',
        description: 'Mô tả',
        permissions: 'Permissions',
        noRolesFound: 'Không tìm thấy Role nào',
        noRolesYet: 'Chưa có Role nào',
        loadingRoles: 'Đang tải danh sách Roles...',
        loadingPermissions: 'Đang tải danh sách Permissions...',
        operatorAccounts: 'Operator Accounts',
        operatorAccount: 'Operator Account',
        selectPermissions: 'Chọn Permissions',
        // Assign permissions
        assignPermissions: 'Gán Permissions',
        assignPermissionsToRole: 'Gán permissions cho role',
        saveChanges: 'Lưu thay đổi',
        saving: 'Đang lưu...',
        selectAll: 'Chọn tất cả',
        selectedCount: 'Đã chọn',
        noPermissionsYet: 'Chưa có permission nào trong hệ thống',
        assignSuccess: 'Gán permissions thành công!',
        assignFailed: 'Gán permissions thất bại. Vui lòng thử lại.',
        loadPermissionsFailed: 'Không thể tải danh sách permissions',
      },
      permissions: {
        title: 'Quản lý Permission',
        addPermission: 'Thêm Permission',
        createPermission: 'Tạo Permission',
        editPermission: 'Chỉnh sửa Permission',
        deletePermission: 'Xóa Permission',
        searchPlaceholder: 'Tìm kiếm theo tên, slug, resource...',
        createSuccess: 'Tạo Permission thành công!',
        createFailed: 'Tạo Permission thất bại. Vui lòng thử lại.',
        updateSuccess: 'Cập nhật Permission thành công!',
        updateFailed: 'Cập nhật Permission thất bại. Vui lòng thử lại.',
        deleteSuccess: 'Xóa Permission thành công!',
        deleteFailed: 'Xóa Permission thất bại. Vui lòng thử lại.',
        permission: 'Permission',
        slug: 'Slug',
        description: 'Mô tả',
        resource: 'Resource',
        action: 'Action',
        content: 'Nội dung',
        detailedContent: 'Nội dung chi tiết',
        selectAction: 'Chọn action...',
        selectResourceAndAction: 'Vui lòng chọn Resource và Action',
        enterPermissionName: 'Nhập tên permission...',
        enterSlug: 'vd: users.view, venues.manage...',
        enterResource: 'vd: users, venues, dashboard...',
        enterDescription: 'Nhập mô tả về permission...',
        enterDetailedContent: 'Nhập nội dung chi tiết về permission (tùy chọn)...',
        noPermissionsFound: 'Không tìm thấy permission nào',
        noPermissionsYet: 'Chưa có permission nào',
        loadingPermissions: 'Đang tải danh sách permissions...',
        // Pagination
        showing: 'Hiển thị',
        of: 'của',
        page: 'Trang',
        previous: 'Trước',
        next: 'Sau',
        // Delete confirmation
        deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa permission',
      },
      wallet: {
        title: 'Ví & Thanh toán',
        addMethod: 'Thêm phương thức',
        totalMethods: 'Tổng phương thức',
        activeMethods: 'Đang hoạt động',
        totalDailyLimit: 'Tổng hạn mức/ngày',
        dailyLimit: 'Hạn mức/ngày',
        monthlyLimit: 'Hạn mức/tháng',
        bank: 'Ngân hàng',
        ewallet: 'Ví điện tử',
        gateway: 'Cổng thanh toán',
        description: 'Quản lý các phương thức thanh toán và cài đặt ví',
      },
      promotions: {
        title: 'Khuyến mãi & Bonus',
        createPromotion: 'Tạo khuyến mãi',
        totalPrograms: 'Tổng chương trình',
        ongoing: 'Đang diễn ra',
        totalParticipants: 'Tổng tham gia',
        totalBonusAwarded: 'Tổng bonus đã trao',
        programName: 'Tên chương trình',
        bonus: 'Bonus',
        maxBonus: 'Bonus tối đa',
        participants: 'Tham gia',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        firstDeposit: 'Nạp đầu',
        deposit: 'Nạp tiền',
        cashback: 'Cashback',
        tournament: 'Giải đấu',
        rebate: 'Hoàn tiền',
        upcoming: 'Sắp tới',
        expired: 'Đã kết thúc',
        to: 'đến',
        description: 'Quản lý các chương trình khuyến mãi và bonus',
      },
      transactions: {
        title: 'Giao dịch',
        searchPlaceholder: 'Tìm kiếm giao dịch (ID, Player)...',
        exportReport: 'Xuất báo cáo',
        totalTransactionsToday: 'Tổng giao dịch hôm nay',
        totalDeposit: 'Tổng nạp',
        totalWithdraw: 'Tổng rút',
        pendingProcessing: 'Đang chờ xử lý',
        transactionCode: 'Mã GD',
        amount: 'Số tiền',
        paymentMethod: 'Phương thức',
        time: 'Thời gian',
        deposit: 'Nạp',
        withdraw: 'Rút',
        bet: 'Cược',
        completed: 'Hoàn thành',
        rejected: 'Từ chối',
        description: 'Xem và quản lý tất cả các giao dịch trong hệ thống',
        customer: 'Khách hàng',
        venue: 'Club',
        transactionTypeBooking: 'Đặt phòng',
        transactionTypeService: 'Dịch vụ',
        transactionTypeDeposit: 'Nạp tiền',
        transactionTypeWithdraw: 'Rút tiền',
        transactionTypeRefund: 'Hoàn tiền',
        paymentMethodCash: 'Tiền mặt',
        paymentMethodTransfer: 'Chuyển khoản',
        paymentMethodEwallet: 'Ví điện tử',
        statusPending: 'Đang chờ',
        statusCompleted: 'Hoàn thành',
        statusRejected: 'Từ chối',
        searchTransactionPlaceholder: 'Tìm kiếm giao dịch (mã, khách hàng, club)...',
        totalRevenue: 'Tổng doanh thu',
        totalRefund: 'Tổng hoàn tiền',
      },
      settings: {
        title: 'Cài đặt hệ thống',
        saveSettings: 'Lưu cài đặt',
        generalSettings: 'Cài đặt chung',
        notificationSettings: 'Cài đặt thông báo',
        securitySettings: 'Bảo mật',
        paymentSettings: 'Cài đặt thanh toán',
        systemName: 'Tên hệ thống',
        systemDescription: 'Mô tả',
        defaultLanguage: 'Ngôn ngữ mặc định',
        emailNotification: 'Email thông báo',
        emailNotificationDesc: 'Gửi email khi có sự kiện quan trọng',
        pushNotification: 'Push notification',
        pushNotificationDesc: 'Thông báo đẩy đến admin',
        smsAlert: 'SMS cảnh báo',
        smsAlertDesc: 'Gửi SMS cho các cảnh báo quan trọng',
        security: 'Bảo mật',
        sessionTimeout: 'Thời gian hết hạn session (phút)',
        maxLoginAttempts: 'Số lần đăng nhập sai tối đa',
        require2FA: 'Yêu cầu 2FA',
        require2FADesc: 'Xác thực hai yếu tố cho admin',
        minDepositLimit: 'Hạn mức nạp tối thiểu (VNĐ)',
        minWithdrawLimit: 'Hạn mức rút tối thiểu (VNĐ)',
        withdrawProcessingTime: 'Thời gian xử lý rút tiền (giờ)',
        description: 'Cấu hình các cài đặt và tùy chọn hệ thống',
      },
      alerts: {
        totalAlerts: 'Tổng cảnh báo',
        unread: 'Chưa đọc',
        warning: 'Cảnh báo',
        totalAlertsLabel: 'Tổng cảnh báo',
        description: 'Xem và quản lý các cảnh báo và thông báo hệ thống',
        alertHighSystemLoad: 'Hệ thống load cao',
        alertPaymentGatewayTimeout: 'Payment gateway timeout',
        alertBackupCompleted: 'Backup hoàn tất',
        alertRateLimitNear: 'Rate limit gần đạt',
        alertDeploymentSuccess: 'Deployment thành công',
        alertHighSystemLoadMessage: 'CPU usage đạt 85%',
        alertPaymentGatewayTimeoutMessage: 'Không thể kết nối đến payment gateway',
        alertBackupCompletedMessage: 'Database backup đã hoàn thành thành công',
        alertRateLimitNearMessage: 'API rate limit đạt 90%',
        alertDeploymentSuccessMessage: 'Version 2.1.0 đã được deploy',
      },
      reports: {
        exportPdf: 'Xuất PDF',
        exportExcel: 'Xuất Excel',
        monthlyRevenue: 'Doanh thu tháng này',
        profit: 'Lợi nhuận',
        revenueByMonth: 'Doanh thu theo tháng',
        revenue: 'Doanh thu',
        winRate: 'Tỷ lệ thắng',
        comparedToLastMonth: '↑ % so với tháng trước',
        description: 'Xem và xuất các báo cáo và thống kê hệ thống',
      },
      analytics: {
        registration: 'Đăng ký',
        firstDeposit: 'Nạp đầu',
        playGame: 'Chơi game',
        activeUsers: 'Người dùng hoạt động',
        revenuePerDay: 'Doanh thu/Ngày',
        sessions: 'Phiên',
        conversionRate: 'Tỷ lệ chuyển đổi',
        performanceLast5Days: 'Hiệu suất 5 ngày qua',
        conversionRateChart: 'Tỷ lệ chuyển đổi',
        revenueTrend: 'Xu hướng doanh thu',
        comparedToYesterday: '↑ % so với ngày trước',
        description: 'Xem phân tích hiệu suất và các chỉ số',
      },
      monitoring: {
        online: 'Online',
        offline: 'Offline',
        warning: 'Warning',
        systemStatus: 'Trạng thái hệ thống',
        service: 'Service',
        uptime: 'Uptime',
        latency: 'Latency',
        avgUptime: 'Avg Uptime',
        totalServices: 'Tổng Services',
        recentEvents: 'Sự kiện gần đây',
        description: 'Giám sát các dịch vụ và hiệu suất hệ thống',
        serviceGameServer: 'Game Server',
        servicePaymentGateway: 'Payment Gateway',
        serviceDatabase: 'Database',
        serviceApiGateway: 'API Gateway',
        serviceNotificationService: 'Notification Service',
        eventHighLoad: 'High load detected',
        eventBackupCompleted: 'Backup completed',
        eventTransactionProcessed: 'Transaction processed',
        eventRateLimitWarning: 'Rate limit warning',
        eventNewPlayerJoined: 'New player joined',
      },
      risk: {
        totalAlerts: 'Tổng cảnh báo rủi ro',
        fraud: 'Gian lận',
        unusualPattern: 'Mẫu bất thường',
        accountCompromise: 'Tài khoản bị xâm nhập',
        pending: 'Chờ xử lý',
        investigating: 'Đang điều tra',
        resolved: 'Đã giải quyết',
        critical: 'Nghiêm trọng',
        high: 'Cao',
        medium: 'Trung bình',
        low: 'Thấp',
        lockedAccounts: 'Tài khoản bị khóa',
        type: 'Loại',
        severity: 'Mức độ',
        time: 'Thời gian',
        title: 'Quản lý rủi ro',
        description: 'Phát hiện và xử lý các rủi ro bảo mật',
      },
      api: {
        title: 'API Management',
        createApiKey: 'Tạo API Key mới',
        description: 'Quản lý API keys và endpoints',
        totalApiKeys: 'Tổng API Keys',
        activeKeys: 'Active Keys',
        totalRequestsToday: 'Tổng requests hôm nay',
        avgResponseTime: 'Avg Response Time',
        apiKeys: 'API Keys',
        apiKey: 'API Key',
        lastUsed: 'Lần dùng cuối',
        requests: 'Requests',
        rateLimit: 'Rate Limit',
        apiEndpoints: 'API Endpoints',
        method: 'Method',
        path: 'Path',
        callsToday: 'Calls (hôm nay)',
        avgResponse: 'Avg Response',
      },
      auditLogs: {
        title: 'Audit Logs',
        searchPlaceholder: 'Tìm kiếm logs (user, action, resource)...',
        description: 'Nhật ký hoạt động và truy cập hệ thống',
        exportLogs: 'Xuất logs',
        time: 'Thời gian',
        user: 'User',
        action: 'Hành động',
        resource: 'Tài nguyên',
        ipAddress: 'IP Address',
        login: 'Đăng nhập',
        logout: 'Đăng xuất',
        updatePlayer: 'Cập nhật player',
        createPromotion: 'Tạo khuyến mãi',
        deleteGame: 'Xóa game',
        changeSettings: 'Thay đổi cài đặt',
        viewSensitiveData: 'Xem dữ liệu nhạy cảm',
      },
      players: {
        totalPlayers: 'Tổng Players',
        activePlayers: 'Active Players',
        inactivePlayers: 'Inactive Players',
        totalBalance: 'Tổng Balance',
        username: 'Username',
        balance: 'Balance',
        registrationDate: 'Ngày đăng ký',
        description: 'Quản lý và theo dõi các players trong hệ thống',
      },
      profile: {
        description: 'Xem và quản lý thông tin hồ sơ cá nhân của bạn',
        personalInfo: 'Thông tin cá nhân',
        accountSecurity: 'Bảo mật tài khoản',
        changePassword: 'Đổi mật khẩu',
        changePasswordDesc: 'Cập nhật mật khẩu tài khoản để bảo mật tốt hơn',
        twoFactorAuth: 'Xác thực hai yếu tố',
        twoFactorAuthDesc: 'Thêm một lớp bảo mật bổ sung cho tài khoản của bạn',
        changePhoto: 'Đổi ảnh',
      },
      userSettings: {
        description: 'Quản lý cài đặt và tùy chọn cá nhân của bạn',
        notifications: 'Thông báo',
        appearance: 'Giao diện',
        privacy: 'Quyền riêng tư',
        emailNotifications: 'Thông báo Email',
        emailNotificationsDesc: 'Nhận thông báo qua email',
        pushNotifications: 'Thông báo Push',
        pushNotificationsDesc: 'Nhận thông báo push trong trình duyệt',
        smsNotifications: 'Thông báo SMS',
        smsNotificationsDesc: 'Nhận thông báo qua SMS',
        language: 'Ngôn ngữ',
        theme: 'Giao diện',
        light: 'Sáng',
        dark: 'Tối',
        auto: 'Tự động',
        showEmail: 'Hiển thị Email',
        showEmailDesc: 'Hiển thị địa chỉ email của bạn cho người dùng khác',
        showPhone: 'Hiển thị Số điện thoại',
        showPhoneDesc: 'Hiển thị số điện thoại của bạn cho người dùng khác',
      },
      helpSupport: {
        description: 'Nhận trợ giúp và hỗ trợ cho tài khoản và dịch vụ của bạn',
        emailSupport: 'Hỗ trợ Email',
        emailSupportDesc: 'Gửi email cho chúng tôi và chúng tôi sẽ phản hồi trong vòng 24 giờ',
        liveChat: 'Trò chuyện trực tiếp',
        liveChatDesc: 'Trò chuyện với đội ngũ hỗ trợ của chúng tôi theo thời gian thực',
        startChat: 'Bắt đầu trò chuyện',
        phoneSupport: 'Hỗ trợ Điện thoại',
        phoneSupportDesc: 'Gọi cho chúng tôi để được hỗ trợ ngay lập tức',
        faq: 'Câu hỏi thường gặp',
        gettingStarted: 'Bắt đầu',
        accountManagement: 'Quản lý Tài khoản',
        faq1Question: 'Làm thế nào để tạo tài khoản?',
        faq1Answer: 'Bạn có thể tạo tài khoản bằng cách nhấp vào nút "Đăng ký" trên trang đăng nhập và điền thông tin của bạn.',
        faq2Question: 'Làm thế nào để đặt lại mật khẩu?',
        faq2Answer: 'Nhấp vào "Quên mật khẩu" trên trang đăng nhập và làm theo hướng dẫn được gửi đến email của bạn.',
        faq3Question: 'Làm thế nào để cập nhật hồ sơ?',
        faq3Answer: 'Đi tới "Hồ sơ của tôi" từ menu người dùng và nhấp "Chỉnh sửa" để cập nhật thông tin của bạn.',
        faq4Question: 'Làm thế nào để bật 2FA?',
        faq4Answer: 'Đi tới "Hồ sơ của tôi" > "Bảo mật tài khoản" và làm theo hướng dẫn thiết lập cho Xác thực hai yếu tố.',
        resources: 'Tài nguyên',
        userGuide: 'Hướng dẫn sử dụng',
        userGuideDesc: 'Hướng dẫn đầy đủ về cách sử dụng admin dashboard',
        apiDocumentation: 'Tài liệu API',
        apiDocumentationDesc: 'Tài liệu kỹ thuật cho tích hợp API',
        community: 'Diễn đàn Cộng đồng',
        communityDesc: 'Tham gia cộng đồng của chúng tôi để nhận trợ giúp và chia sẻ ý tưởng',
      },
      tables: {
        id: 'ID',
        player: 'Player',
        type: 'Loại',
        severity: 'Mức độ',
        description: 'Mô tả',
        status: 'Trạng thái',
        time: 'Thời gian',
        actions: 'Hành động',
        service: 'Service',
        uptime: 'Uptime',
        latency: 'Latency',
        players: 'Players',
        gameName: 'Tên Game',
        revenue: 'Doanh thu',
        totalWagered: 'Tổng cược',
        game: 'Game',
        wagered: 'Tổng cược',
      },
    },
    header: {
      providerPortal: 'VIPKA Club',
      operatorPortal: 'Operator Portal',
      adminPortal: 'Admin Portal',
      myProfile: 'Hồ sơ của tôi',
      helpSupport: 'Trợ giúp & Hỗ trợ',
    },
    menu: {
      dashboard: 'Dashboard',
      bookingsManagement: 'Quản lý Đặt phòng',
      venuesManagement: 'Quản lý Club',

      gamesManagement: 'Quản lý Games',
      operatorsManagement: 'Quản lý Karaoke',
      providerAccountsManagement: 'Quản lý Massage',
      rolesPermissionsManagement: 'Quản lý Role & Permission',
      rolesManagement: 'Quản lý Roles',
      permissionsManagement: 'Quản lý Permissions',
      playersManagement: 'Quản lý Players',
      transactions: 'Giao dịch',
      walletPayment: 'Ví & Thanh toán',
      promotionsBonus: 'Khuyến mãi & Bonus',
      reports: 'Báo cáo & Thống kê',
      analytics: 'Phân tích hiệu suất',
      articlesManagement: 'Quản lý Bài viết',
      usersManagement: 'Quản lý Người dùng',
      commentsManagement: 'Quản lý Bình luận',
      ratingsManagement: 'Quản lý Đánh giá',
      notificationsManagement: 'Quản lý Thông báo',
      feedsManagement: 'Quản lý Feeds',
      kycManagement: 'Quản lý KYC',
      monitoring: 'Monitoring',
      riskManagement: 'Quản lý rủi ro',
      apiManagement: 'API Management',
      alerts: 'Cảnh báo & Alerts',
      auditLogs: 'Audit Logs',
      cachingManagement: 'Quản lý Cache',
      systemStatus: 'Trạng thái hệ thống',
      systemSettings: 'Cài đặt hệ thống',
    },
    languages: {
      en: 'Tiếng Anh',
      vi: 'Tiếng Việt',
      zh: 'Tiếng Trung',
      th: 'Tiếng Thái',
      ja: 'Tiếng Nhật',
      ko: 'Tiếng Hàn',
    },
  },
  zh: {
    common: {
      search: '搜索',
      profile: '个人资料',
      settings: '设置',
      help: '帮助',
      logout: '登出',
      fullscreen: '全屏',
      messages: '消息',
      notifications: '通知',
      viewAll: '查看全部',
      language: '语言',
      user: '用户',
      searchPlaceholder: '搜索...',
      searchBy: '搜索',
      // Actions
      save: '保存',
      cancel: '取消',
      delete: '删除',
      editAction: '编辑',
      add: '添加',
      create: '创建',
      update: '更新',
      submit: '提交',
      confirm: '确认',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      view: '查看',
      detailsAction: '详情',
      actions: '操作',
      // Status
      status: '状态',
      active: '活跃',
      inactive: '非活跃',
      success: '成功',
      error: '错误',
      loading: '加载中',
      yes: '是',
      no: '否',
      ok: '确定',
      // Login
      providerOperatorPortal: '提供商和运营商门户',
      login: '登录',
      welcome: '欢迎回来！',
      emailOrUsername: '邮箱或用户名',
      password: '密码',
      forgotPassword: '忘记密码？',
      loggingIn: '登录中...',
      // Messages
      pleaseFillAllFields: '请填写所有字段',
      loginSuccess: '登录成功！',
      loginFailed: '登录失败。请检查您的登录信息。',
      checkLoginInfo: '登录失败。请检查您的登录信息。',
      // Table & List
      filter: '筛选',
      noData: '暂无数据',
      loadingData: '加载数据中...',
      showing: '显示',
      to: '到',
      of: '共',
      page: '页',
      // Status
      paused: '已暂停',
      banned: '已封禁',
      suspicious: '可疑活动',
      // Actions
      creating: '创建中...',
      deleting: '删除中...',
      updating: '更新中...',
      saving: '保存中...',
      // Forms
      name: '名称',
      email: '邮箱',
      code: '代码',
      description: '描述',
      phone: '电话',
      username: '用户名',
      // Modals
      addNew: '添加新',
      confirmDelete: '确认删除',
      deleteConfirmMessage: '您确定要删除此项吗？此操作无法撤销。',
      deleteWarning: '此操作无法撤销。',
      // Placeholders
      enterName: '输入名称...',
      enterEmail: '输入邮箱...',
      enterGameName: '输入游戏名称...',
      enterProviderAccountEmail: '输入提供商账户邮箱...',
      // Details
      createdAt: '创建日期',
      lastLogin: '最后登录',
      neverLoggedIn: '从未登录',
      additionalInfo: '附加信息',
      edit: '编辑',
      // Dashboard
      overview: '概览',
      increased: '增加',
      decreased: '减少',
      weeklySales: '周销售额',
      weeklyOrders: '周订单',
      visitorsOnline: '在线访客',
      visitAndSalesStatistics: '访问和销售统计',
      trafficSources: '流量来源',
      searchEngines: '搜索引擎',
      directClick: '直接点击',
      bookmarksClick: '书签点击',
      recentTickets: '最近工单',
      assignee: '受理人',
      subject: '主题',
      lastUpdate: '最后更新',
      trackingId: '跟踪ID',
      done: '已完成',
      logoutSuccess: '登出成功！',
      logoutLocal: '本地登出',
    },
    pages: {
      dashboard: {
        title: '仪表板',
        overview: '概览',
        weeklySales: '周销售额',
        weeklyOrders: '周订单',
        visitorsOnline: '在线访客',
        visitAndSalesStatistics: '访问和销售统计',
        trafficSources: '流量来源',
        searchEngines: '搜索引擎',
        directClick: '直接点击',
        bookmarksClick: '书签点击',
        recentTickets: '最近工单',
        assignee: '受理人',
        subject: '主题',
        lastUpdate: '最后更新',
        trackingId: '跟踪ID',
        done: '已完成',
        increased: '增加',
        decreased: '减少',
        weeklyRevenue: '周收入',
        bookingsCount: '预订数量',
        activeCustomers: '活跃客户',
      },
      operators: {
        title: '运营商管理',
        addOperator: '添加运营商',
        createOperator: '创建运营商',
        deleteOperator: '删除运营商',
        operatorDetails: '运营商详情',
        searchPlaceholder: '按名称、邮箱搜索...',
        createSuccess: '运营商创建成功！',
        createFailed: '创建运营商失败。请重试。',
        deleteSuccess: '运营商删除成功！',
        deleteFailed: '删除运营商失败。请重试。',
        viewDetails: '查看详情',
        deleteOperatorTitle: '删除运营商',
        description: '管理系统中的运营商',
        noOperatorsFound: '未找到运营商',
        noOperatorsYet: '暂无运营商',
        operatorCode: '运营商代码',
        operatorName: '运营商名称',
        enterOperatorCode: '输入运营商代码...',
        enterOperatorName: '输入运营商名称...',
        randomData: '随机数据',
        random: '随机',
        edit: '编辑',
        userNotFound: '未找到用户信息',
        operatorsLabel: '运营商',
      },
      games: {
        title: '游戏管理',
        addGame: '添加游戏',
        createGame: '创建游戏',
        searchPlaceholder: '搜索游戏...',
        description: '管理系统中的游戏',
        venueManagement: '场所管理',
        venueName: '场所名称',
        venueType: '场所类型',
        venueTypeKaraoke: '卡拉OK',
        venueTypeMassage: '按摩',
        venueTypeClub: '俱乐部',
        enterVenueName: '输入场所名称...',
        bookingsCount: '预订数量',
        revenue: '收入',
        actions: '操作',
        addVenue: '添加场所',
        searchVenuePlaceholder: '搜索场所...',
        noVenuesYet: '暂无场所',
        createSuccess: '创建成功',
        deleteSuccess: '删除成功',
        deleteFailed: '删除失败',
      },
      providerAccounts: {
        title: '提供商账户管理',
        addAccount: '添加提供商账户',
        createAccount: '创建提供商账户',
        deleteAccount: '删除提供商账户',
        searchPlaceholder: '按名称、邮箱、代码搜索...',
        createSuccess: '提供商账户创建成功！',
        createFailed: '创建提供商账户失败。请重试。',
        deleteSuccess: '提供商账户删除成功！',
        deleteFailed: '删除提供商账户失败。请重试。',
        deleteAccountTitle: '删除提供商账户',
        description: '管理系统中的提供商账户',
        totalAccounts: '总账户数',
        activeAccounts: '活跃',
        loadingAccounts: '正在加载提供商账户列表...',
        providerAccount: '提供商账户',
        noAccountsFound: '未找到提供商账户',
        noAccountsYet: '暂无提供商账户',
        randomData: '随机数据',
        random: '随机',
      },
      roles: {
        title: '角色管理',
        addRole: '添加角色',
        createRole: '创建角色',
        editRole: '编辑角色',
        deleteRole: '删除角色',
        searchPlaceholder: '搜索角色...',
        createSuccess: '角色创建成功！',
        createFailed: '创建角色失败。请重试。',
        updateSuccess: '角色更新成功！',
        updateFailed: '更新角色失败。请重试。',
        deleteSuccess: '角色删除成功！',
        deleteFailed: '删除角色失败。请重试。',
        role: '角色',
        slug: 'Slug',
        description: '描述',
        permissions: '权限',
        noRolesFound: '未找到角色',
        noRolesYet: '暂无角色',
        loadingRoles: '正在加载角色列表...',
        loadingPermissions: '正在加载权限列表...',
        operatorAccounts: '运营商账户',
        operatorAccount: '运营商账户',
        selectPermissions: '选择权限',
        // Assign permissions
        assignPermissions: '分配权限',
        assignPermissionsToRole: '为角色分配权限',
        saveChanges: '保存更改',
        saving: '保存中...',
        selectAll: '全选',
        selectedCount: '已选择',
        noPermissionsYet: '系统中暂无权限',
        assignSuccess: '权限分配成功！',
        assignFailed: '分配权限失败。请重试。',
        loadPermissionsFailed: '无法加载权限列表',
      },
      permissions: {
        title: '权限管理',
        addPermission: '添加权限',
        createPermission: '创建权限',
        editPermission: '编辑权限',
        deletePermission: '删除权限',
        searchPlaceholder: '按名称、slug、资源搜索...',
        createSuccess: '权限创建成功！',
        createFailed: '创建权限失败。请重试。',
        updateSuccess: '权限更新成功！',
        updateFailed: '更新权限失败。请重试。',
        deleteSuccess: '权限删除成功！',
        deleteFailed: '删除权限失败。请重试。',
        permission: '权限',
        slug: 'Slug',
        description: '描述',
        resource: '资源',
        action: '操作',
        content: '内容',
        detailedContent: '详细内容',
        selectAction: '选择操作...',
        selectResourceAndAction: '请选择资源和操作',
        enterPermissionName: '输入权限名称...',
        enterSlug: '例如: users.view, venues.manage...',
        enterResource: '例如: users, venues, dashboard...',
        enterDescription: '输入权限描述...',
        enterDetailedContent: '输入权限详细内容（可选）...',
        noPermissionsFound: '未找到权限',
        noPermissionsYet: '暂无权限',
        loadingPermissions: '正在加载权限列表...',
        // Pagination
        showing: '显示',
        of: '共',
        page: '页',
        previous: '上一页',
        next: '下一页',
        // Delete confirmation
        deleteConfirmMessage: '您确定要删除权限',
      },
      wallet: {
        title: '钱包和支付',
        addMethod: '添加支付方式',
        totalMethods: '总支付方式',
        activeMethods: '活跃方式',
        totalDailyLimit: '总每日限额',
        dailyLimit: '每日限额',
        monthlyLimit: '每月限额',
        bank: '银行',
        ewallet: '电子钱包',
        gateway: '支付网关',
        description: '管理支付方式和钱包设置',
      },
      promotions: {
        title: '促销和奖金',
        createPromotion: '创建促销',
        totalPrograms: '总计划数',
        ongoing: '进行中',
        totalParticipants: '总参与数',
        totalBonusAwarded: '已发放总奖金',
        programName: '计划名称',
        bonus: '奖金',
        maxBonus: '最大奖金',
        participants: '参与数',
        startDate: '开始日期',
        endDate: '结束日期',
        firstDeposit: '首存',
        deposit: '存款',
        cashback: '返现',
        tournament: '锦标赛',
        rebate: '返水',
        upcoming: '即将开始',
        expired: '已过期',
        to: '至',
        description: '管理促销和奖金计划',
      },
      transactions: {
        title: '交易',
        searchPlaceholder: '搜索交易（ID、玩家）...',
        exportReport: '导出报告',
        totalTransactionsToday: '今日总交易',
        totalDeposit: '总存款',
        totalWithdraw: '总提款',
        pendingProcessing: '待处理',
        transactionCode: '交易代码',
        amount: '金额',
        paymentMethod: '支付方式',
        time: '时间',
        deposit: '存款',
        withdraw: '提款',
        bet: '投注',
        completed: '已完成',
        rejected: '已拒绝',
        description: '查看和管理系统中的所有交易',
        customer: '客户',
        venue: '场所',
        transactionTypeBooking: '预订',
        transactionTypeService: '服务',
        transactionTypeDeposit: '存款',
        transactionTypeWithdraw: '提款',
        transactionTypeRefund: '退款',
        paymentMethodCash: '现金',
        paymentMethodTransfer: '转账',
        paymentMethodEwallet: '电子钱包',
        statusPending: '待处理',
        statusCompleted: '已完成',
        statusRejected: '已拒绝',
        searchTransactionPlaceholder: '搜索交易 (代码, 客户, 场所)...',
        totalRevenue: '总收入',
        totalRefund: '总退款',
      },
      auditLogs: {
        title: '审计日志',
        searchPlaceholder: '搜索日志（用户、操作、资源）...',
        description: '系统活动和访问日志',
        exportLogs: '导出日志',
        time: '时间',
        user: '用户',
        action: '操作',
        resource: '资源',
        ipAddress: 'IP地址',
        login: '登录',
        logout: '登出',
        updatePlayer: '更新玩家',
        createPromotion: '创建促销',
        deleteGame: '删除游戏',
        changeSettings: '更改设置',
        viewSensitiveData: '查看敏感数据',
      },
      settings: {
        title: '系统设置',
        saveSettings: '保存设置',
        generalSettings: '常规设置',
        notificationSettings: '通知设置',
        securitySettings: '安全设置',
        paymentSettings: '支付设置',
        systemName: '系统名称',
        systemDescription: '描述',
        defaultLanguage: '默认语言',
        emailNotification: '邮件通知',
        emailNotificationDesc: '重要事件时发送邮件',
        pushNotification: '推送通知',
        pushNotificationDesc: '向管理员推送通知',
        smsAlert: '短信警报',
        smsAlertDesc: '重要警报时发送短信',
        security: '安全',
        sessionTimeout: '会话超时（分钟）',
        maxLoginAttempts: '最大登录失败次数',
        require2FA: '要求2FA',
        require2FADesc: '管理员需要双因素认证',
        minDepositLimit: '最小存款限额（越南盾）',
        minWithdrawLimit: '最小提款限额（越南盾）',
        withdrawProcessingTime: '提款处理时间（小时）',
        description: '配置系统设置和首选项',
      },
      alerts: {
        totalAlerts: '总警报数',
        unread: '未读',
        warning: '警告',
        totalAlertsLabel: '总警报',
        description: '查看和管理系统警报和通知',
        alertHighSystemLoad: '系统负载高',
        alertPaymentGatewayTimeout: '支付网关超时',
        alertBackupCompleted: '备份完成',
        alertRateLimitNear: '速率限制接近',
        alertDeploymentSuccess: '部署成功',
        alertHighSystemLoadMessage: 'CPU使用率达到85%',
        alertPaymentGatewayTimeoutMessage: '支付网关响应超时',
        alertBackupCompletedMessage: '系统备份已成功完成',
        alertRateLimitNearMessage: 'API速率限制接近阈值',
        alertDeploymentSuccessMessage: '新版本已成功部署',
      },
      reports: {
        exportPdf: '导出PDF',
        exportExcel: '导出Excel',
        monthlyRevenue: '本月收入',
        profit: '利润',
        revenueByMonth: '按月收入',
        revenue: '收入',
        winRate: '胜率',
        comparedToLastMonth: '↑ % 与上月相比',
        description: '查看和导出系统报告和统计',
      },
      analytics: {
        registration: '注册',
        firstDeposit: '首存',
        playGame: '游戏',
        activeUsers: '活跃用户',
        revenuePerDay: '每日收入',
        sessions: '会话',
        conversionRate: '转化率',
        performanceLast5Days: '过去5天表现',
        conversionRateChart: '转化率',
        revenueTrend: '收入趋势',
        comparedToYesterday: '↑ % 与昨天相比',
        description: '查看性能分析和指标',
      },
      monitoring: {
        online: '在线',
        offline: '离线',
        warning: '警告',
        systemStatus: '系统状态',
        service: '服务',
        uptime: '运行时间',
        latency: '延迟',
        avgUptime: '平均运行时间',
        totalServices: '总服务数',
        recentEvents: '最近事件',
        description: '监控系统服务和性能',
        serviceGameServer: '游戏服务器',
        servicePaymentGateway: '支付网关',
        serviceDatabase: '数据库',
        serviceApiGateway: 'API网关',
        serviceNotificationService: '通知服务',
        eventHighLoad: '检测到高负载',
        eventBackupCompleted: '备份完成',
        eventTransactionProcessed: '交易已处理',
        eventRateLimitWarning: '速率限制警告',
        eventNewPlayerJoined: '新玩家加入',
      },
      risk: {
        totalAlerts: '总风险警报',
        fraud: '欺诈',
        unusualPattern: '异常模式',
        accountCompromise: '账户被入侵',
        pending: '待处理',
        investigating: '调查中',
        resolved: '已解决',
        critical: '严重',
        high: '高',
        medium: '中',
        low: '低',
        lockedAccounts: '已锁定账户',
        type: '类型',
        severity: '严重程度',
        time: '时间',
        title: '风险管理',
        description: '检测和处理安全风险',
      },
      api: {
        title: 'API管理',
        createApiKey: '创建新API密钥',
        description: '管理API密钥和端点',
        totalApiKeys: '总API密钥',
        activeKeys: '活跃密钥',
        totalRequestsToday: '今日总请求',
        avgResponseTime: '平均响应时间',
        apiKeys: 'API密钥',
        apiKey: 'API密钥',
        lastUsed: '最后使用',
        requests: '请求',
        rateLimit: '速率限制',
        apiEndpoints: 'API端点',
        method: '方法',
        path: '路径',
        callsToday: '今日调用',
        avgResponse: '平均响应',
      },
      players: {
        totalPlayers: '总玩家数',
        activePlayers: '活跃玩家',
        inactivePlayers: '非活跃玩家',
        totalBalance: '总余额',
        username: '用户名',
        balance: '余额',
        registrationDate: '注册日期',
        description: '管理系统中的玩家',
      },
      profile: {
        description: '查看和管理您的个人资料信息',
        personalInfo: '个人信息',
        accountSecurity: '账户安全',
        changePassword: '更改密码',
        changePasswordDesc: '更新您的账户密码以提高安全性',
        twoFactorAuth: '双因素认证',
        twoFactorAuthDesc: '为您的账户添加额外的安全层',
        changePhoto: '更改照片',
      },
      userSettings: {
        description: '管理您的个人设置和偏好',
        notifications: '通知',
        appearance: '外观',
        privacy: '隐私',
        emailNotifications: '邮件通知',
        emailNotificationsDesc: '通过邮件接收通知',
        pushNotifications: '推送通知',
        pushNotificationsDesc: '在浏览器中接收推送通知',
        smsNotifications: '短信通知',
        smsNotificationsDesc: '通过短信接收通知',
        language: '语言',
        theme: '主题',
        light: '浅色',
        dark: '深色',
        auto: '自动',
        showEmail: '显示邮箱',
        showEmailDesc: '向其他用户显示您的邮箱地址',
        showPhone: '显示电话',
        showPhoneDesc: '向其他用户显示您的电话号码',
      },
      tables: {
        id: 'ID',
        player: '玩家',
        type: '类型',
        severity: '严重程度',
        description: '描述',
        status: '状态',
        time: '时间',
        actions: '操作',
        service: '服务',
        uptime: '运行时间',
        latency: '延迟',
        players: '玩家',
        gameName: '游戏名称',
        revenue: '收入',
        totalWagered: '总投注',
        game: '游戏',
        wagered: '投注',
      },
      helpSupport: {
        description: '获取帐户和服务的帮助和支持',
        emailSupport: '电子邮件支持',
        emailSupportDesc: '给我们发送电子邮件，我们将在24小时内回复您',
        liveChat: '在线聊天',
        liveChatDesc: '与我们的支持团队实时聊天',
        startChat: '开始聊天',
        phoneSupport: '电话支持',
        phoneSupportDesc: '致电我们以获得即时帮助',
        faq: '常见问题',
        gettingStarted: '入门',
        accountManagement: '账户管理',
        faq1Question: '如何创建账户？',
        faq1Answer: '点击注册按钮并填写所需信息',
        faq2Question: '如何重置密码？',
        faq2Answer: '点击登录页面的"忘记密码"链接',
        faq3Question: '如何联系支持？',
        faq3Answer: '您可以通过电子邮件、实时聊天或电话联系我们',
        faq4Question: '如何启用2FA？',
        faq4Answer: '转到"我的个人资料" > "账户安全"并按照双因素认证的设置说明操作',
        resources: '资源',
        userGuide: '用户指南',
        userGuideDesc: '使用管理仪表板的完整指南',
        apiDocumentation: 'API文档',
        apiDocumentationDesc: 'API集成的技术文档',
        community: '社区论坛',
        communityDesc: '加入我们的社区以获得帮助和分享想法',
      },
    },
    header: {
      providerPortal: '提供商门户',
      operatorPortal: '运营商门户',
      adminPortal: '管理门户',
      myProfile: '我的资料',
      helpSupport: '帮助与支持',
    },
    menu: {
      dashboard: '仪表板',
      venuesManagement: '场所管理',
      gamesManagement: '游戏管理',
      operatorsManagement: '运营商管理',
      providerAccountsManagement: '提供商账户管理',
      rolesPermissionsManagement: '角色和权限管理',
      rolesManagement: '角色管理',
      permissionsManagement: '权限管理',
      playersManagement: '玩家管理',
      transactions: '交易',
      walletPayment: '钱包和支付',
      promotionsBonus: '促销和奖金',
      reports: '报告和统计',
      analytics: '性能分析',
      articlesManagement: '文章管理',
      usersManagement: '用户管理',
      commentsManagement: '评论管理',
      ratingsManagement: '评分管理',
      notificationsManagement: '通知管理',
      feedsManagement: '动态管理',
      kycManagement: 'KYC管理',
      monitoring: '监控',
      riskManagement: '风险管理',
      apiManagement: 'API管理',
      alerts: '警报和警告',
      auditLogs: '审计日志',
      cachingManagement: '缓存管理',
      systemStatus: '系统状态',
      systemSettings: '系统设置',
    },
    languages: {
      en: '英语',
      vi: '越南语',
      zh: '中文',
      th: '泰语',
      ja: '日语',
      ko: '韩语',
    },
  },
  th: {
    common: {
      search: 'ค้นหา',
      profile: 'โปรไฟล์',
      settings: 'การตั้งค่า',
      help: 'ช่วยเหลือ',
      logout: 'ออกจากระบบ',
      fullscreen: 'เต็มหน้าจอ',
      messages: 'ข้อความ',
      notifications: 'การแจ้งเตือน',
      viewAll: 'ดูทั้งหมด',
      language: 'ภาษา',
      user: 'ผู้ใช้',
      searchPlaceholder: 'ค้นหา...',
      searchBy: 'ค้นหาตาม',
      // Actions
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      delete: 'ลบ',
      editAction: 'แก้ไข',
      add: 'เพิ่ม',
      create: 'สร้าง',
      update: 'อัปเดต',
      submit: 'ส่ง',
      confirm: 'ยืนยัน',
      close: 'ปิด',
      back: 'กลับ',
      next: 'ถัดไป',
      previous: 'ก่อนหน้า',
      view: 'ดู',
      detailsAction: 'รายละเอียด',
      actions: 'การดำเนินการ',
      // Status
      status: 'สถานะ',
      active: 'ใช้งาน',
      inactive: 'ไม่ใช้งาน',
      success: 'สำเร็จ',
      error: 'ข้อผิดพลาด',
      loading: 'กำลังโหลด',
      yes: 'ใช่',
      no: 'ไม่',
      ok: 'ตกลง',
      // Login
      providerOperatorPortal: 'พอร์ทัลผู้ให้บริการและผู้ดำเนินการ',
      login: 'เข้าสู่ระบบ',
      welcome: 'ยินดีต้อนรับกลับ!',
      emailOrUsername: 'อีเมลหรือชื่อผู้ใช้',
      password: 'รหัสผ่าน',
      forgotPassword: 'ลืมรหัสผ่าน?',
      loggingIn: 'กำลังเข้าสู่ระบบ...',
      // Messages
      pleaseFillAllFields: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      loginSuccess: 'เข้าสู่ระบบสำเร็จ!',
      loginFailed: 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ',
      checkLoginInfo: 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลการเข้าสู่ระบบของคุณ',
      // Table & List
      filter: 'กรอง',
      noData: 'ไม่มีข้อมูล',
      loadingData: 'กำลังโหลดข้อมูล...',
      showing: 'แสดง',
      to: 'ถึง',
      of: 'จาก',
      page: 'หน้า',
      // Status
      paused: 'หยุดชั่วคราว',
      banned: 'ถูกแบน',
      suspicious: 'กิจกรรมน่าสงสัย',
      // Actions
      creating: 'กำลังสร้าง...',
      deleting: 'กำลังลบ...',
      updating: 'กำลังอัปเดต...',
      saving: 'กำลังบันทึก...',
      // Forms
      name: 'ชื่อ',
      email: 'อีเมล',
      code: 'รหัส',
      description: 'คำอธิบาย',
      phone: 'เบอร์โทรศัพท์',
      username: 'ชื่อผู้ใช้',
      // Modals
      addNew: 'เพิ่มใหม่',
      confirmDelete: 'ยืนยันการลบ',
      deleteConfirmMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถยกเลิกได้',
      deleteWarning: 'การกระทำนี้ไม่สามารถยกเลิกได้',
      // Placeholders
      enterName: 'ใส่ชื่อ...',
      enterEmail: 'ใส่อีเมล...',
      enterGameName: 'ใส่ชื่อเกม...',
      enterProviderAccountEmail: 'ใส่อีเมลบัญชีผู้ให้บริการ...',
      // Details
      createdAt: 'วันที่สร้าง',
      lastLogin: 'เข้าสู่ระบบล่าสุด',
      neverLoggedIn: 'ยังไม่เคยเข้าสู่ระบบ',
      additionalInfo: 'ข้อมูลเพิ่มเติม',
      edit: 'แก้ไข',
      // Dashboard
      overview: 'ภาพรวม',
      increased: 'เพิ่มขึ้น',
      decreased: 'ลดลง',
      weeklySales: 'ยอดขายรายสัปดาห์',
      weeklyOrders: 'คำสั่งซื้อรายสัปดาห์',
      visitorsOnline: 'ผู้เยี่ยมชมออนไลน์',
      visitAndSalesStatistics: 'สถิติการเยี่ยมชมและการขาย',
      trafficSources: 'แหล่งที่มาของการเข้าชม',
      searchEngines: 'เครื่องมือค้นหา',
      directClick: 'คลิกโดยตรง',
      bookmarksClick: 'คลิกบุ๊กมาร์ก',
      recentTickets: 'ตั๋วล่าสุด',
      assignee: 'ผู้รับผิดชอบ',
      subject: 'หัวข้อ',
      lastUpdate: 'อัปเดตล่าสุด',
      trackingId: 'ID ติดตาม',
      done: 'เสร็จสิ้น',
      logoutSuccess: 'ออกจากระบบสำเร็จ!',
      logoutLocal: 'ออกจากระบบในเครื่อง',
    },
    pages: {
      dashboard: {
        title: 'แดชบอร์ด',
        overview: 'ภาพรวม',
        weeklySales: 'ยอดขายรายสัปดาห์',
        weeklyOrders: 'คำสั่งซื้อรายสัปดาห์',
        visitorsOnline: 'ผู้เยี่ยมชมออนไลน์',
        visitAndSalesStatistics: 'สถิติการเยี่ยมชมและการขาย',
        trafficSources: 'แหล่งที่มาของการเข้าชม',
        searchEngines: 'เครื่องมือค้นหา',
        directClick: 'คลิกโดยตรง',
        bookmarksClick: 'คลิกบุ๊กมาร์ก',
        recentTickets: 'ตั๋วล่าสุด',
        assignee: 'ผู้รับผิดชอบ',
        subject: 'หัวข้อ',
        lastUpdate: 'อัปเดตล่าสุด',
        trackingId: 'ID ติดตาม',
        done: 'เสร็จสิ้น',
        increased: 'เพิ่มขึ้น',
        decreased: 'ลดลง',
        weeklyRevenue: 'รายได้รายสัปดาห์',
        bookingsCount: 'จำนวนการจอง',
        activeCustomers: 'ลูกค้าที่ใช้งาน',
      },
      operators: {
        title: 'จัดการผู้ดำเนินการ',
        addOperator: 'เพิ่มผู้ดำเนินการ',
        createOperator: 'สร้างผู้ดำเนินการ',
        deleteOperator: 'ลบผู้ดำเนินการ',
        operatorDetails: 'รายละเอียดผู้ดำเนินการ',
        searchPlaceholder: 'ค้นหาตามชื่อ อีเมล...',
        createSuccess: 'สร้างผู้ดำเนินการสำเร็จ!',
        createFailed: 'สร้างผู้ดำเนินการล้มเหลว กรุณาลองอีกครั้ง',
        deleteSuccess: 'ลบผู้ดำเนินการสำเร็จ!',
        deleteFailed: 'ลบผู้ดำเนินการล้มเหลว กรุณาลองอีกครั้ง',
        viewDetails: 'ดูรายละเอียด',
        deleteOperatorTitle: 'ลบผู้ดำเนินการ',
        description: 'จัดการและติดตามผู้ดำเนินการในระบบ',
        noOperatorsFound: 'ไม่พบผู้ดำเนินการ',
        noOperatorsYet: 'ยังไม่มีผู้ดำเนินการ',
        operatorCode: 'รหัสผู้ดำเนินการ',
        operatorName: 'ชื่อผู้ดำเนินการ',
        enterOperatorCode: 'ใส่รหัสผู้ดำเนินการ...',
        enterOperatorName: 'ใส่ชื่อผู้ดำเนินการ...',
        randomData: 'ข้อมูลแบบสุ่ม',
        random: 'สุ่ม',
        edit: 'แก้ไข',
        userNotFound: 'ไม่พบข้อมูลผู้ใช้',
        operatorsLabel: 'ผู้ดำเนินการ',
      },
      games: {
        title: 'จัดการเกม',
        addGame: 'เพิ่มเกม',
        createGame: 'สร้างเกม',
        searchPlaceholder: 'ค้นหาเกม...',
        description: 'จัดการและติดตามเกมในระบบ',
        venueManagement: 'การจัดการสถานที่',
        venueName: 'ชื่อสถานที่',
        venueType: 'ประเภทสถานที่',
        venueTypeKaraoke: 'คาราโอเกะ',
        venueTypeMassage: 'นวด',
        venueTypeClub: 'คลับ',
        enterVenueName: 'ใส่ชื่อสถานที่...',
        bookingsCount: 'จำนวนการจอง',
        revenue: 'รายได้',
        actions: 'การดำเนินการ',
        addVenue: 'เพิ่มสถานที่',
        searchVenuePlaceholder: 'ค้นหาสถานที่...',
        noVenuesYet: 'ยังไม่มีสถานที่',
        createSuccess: 'สร้างสำเร็จ',
        deleteSuccess: 'ลบสำเร็จ',
        deleteFailed: 'ลบไม่สำเร็จ',
      },
      providerAccounts: {
        title: 'จัดการบัญชีผู้ให้บริการ',
        addAccount: 'เพิ่มบัญชีผู้ให้บริการ',
        createAccount: 'สร้างบัญชีผู้ให้บริการ',
        deleteAccount: 'ลบบัญชีผู้ให้บริการ',
        searchPlaceholder: 'ค้นหาตามชื่อ อีเมล รหัส...',
        createSuccess: 'สร้างบัญชีผู้ให้บริการสำเร็จ!',
        createFailed: 'สร้างบัญชีผู้ให้บริการล้มเหลว กรุณาลองอีกครั้ง',
        deleteSuccess: 'ลบบัญชีผู้ให้บริการสำเร็จ!',
        deleteFailed: 'ลบบัญชีผู้ให้บริการล้มเหลว กรุณาลองอีกครั้ง',
        deleteAccountTitle: 'ลบบัญชีผู้ให้บริการ',
        description: 'จัดการและติดตามบัญชีผู้ให้บริการในระบบ',
        totalAccounts: 'บัญชีทั้งหมด',
        activeAccounts: 'กำลังใช้งาน',
        loadingAccounts: 'กำลังโหลดรายการบัญชีผู้ให้บริการ...',
        providerAccount: 'บัญชีผู้ให้บริการ',
        noAccountsFound: 'ไม่พบบัญชีผู้ให้บริการ',
        noAccountsYet: 'ยังไม่มีบัญชีผู้ให้บริการ',
        randomData: 'ข้อมูลแบบสุ่ม',
        random: 'สุ่ม',
      },
      roles: {
        title: 'จัดการบทบาท',
        addRole: 'เพิ่มบทบาท',
        createRole: 'สร้างบทบาท',
        editRole: 'แก้ไขบทบาท',
        deleteRole: 'ลบบทบาท',
        searchPlaceholder: 'ค้นหาบทบาท...',
        createSuccess: 'สร้างบทบาทสำเร็จ!',
        createFailed: 'สร้างบทบาทล้มเหลว กรุณาลองอีกครั้ง',
        updateSuccess: 'อัปเดตบทบาทสำเร็จ!',
        updateFailed: 'อัปเดตบทบาทล้มเหลว กรุณาลองอีกครั้ง',
        deleteSuccess: 'ลบบทบาทสำเร็จ!',
        deleteFailed: 'ลบบทบาทล้มเหลว กรุณาลองอีกครั้ง',
        role: 'บทบาท',
        slug: 'Slug',
        description: 'คำอธิบาย',
        permissions: 'สิทธิ์',
        noRolesFound: 'ไม่พบบทบาท',
        noRolesYet: 'ยังไม่มีบทบาท',
        loadingRoles: 'กำลังโหลดรายการบทบาท...',
        loadingPermissions: 'กำลังโหลดรายการสิทธิ์...',
        operatorAccounts: 'บัญชีผู้ดำเนินการ',
        operatorAccount: 'บัญชีผู้ดำเนินการ',
        selectPermissions: 'เลือกสิทธิ์',
        // Assign permissions
        assignPermissions: 'กำหนดสิทธิ์',
        assignPermissionsToRole: 'กำหนดสิทธิ์ให้บทบาท',
        saveChanges: 'บันทึกการเปลี่ยนแปลง',
        saving: 'กำลังบันทึก...',
        selectAll: 'เลือกทั้งหมด',
        selectedCount: 'เลือกแล้ว',
        noPermissionsYet: 'ยังไม่มีสิทธิ์ในระบบ',
        assignSuccess: 'กำหนดสิทธิ์สำเร็จ!',
        assignFailed: 'กำหนดสิทธิ์ล้มเหลว กรุณาลองอีกครั้ง',
        loadPermissionsFailed: 'ไม่สามารถโหลดรายการสิทธิ์',
      },
      permissions: {
        title: 'จัดการสิทธิ์',
        addPermission: 'เพิ่มสิทธิ์',
        createPermission: 'สร้างสิทธิ์',
        editPermission: 'แก้ไขสิทธิ์',
        deletePermission: 'ลบสิทธิ์',
        searchPlaceholder: 'ค้นหาตามชื่อ, slug, ทรัพยากร...',
        createSuccess: 'สร้างสิทธิ์สำเร็จ!',
        createFailed: 'สร้างสิทธิ์ล้มเหลว กรุณาลองอีกครั้ง',
        updateSuccess: 'อัปเดตสิทธิ์สำเร็จ!',
        updateFailed: 'อัปเดตสิทธิ์ล้มเหลว กรุณาลองอีกครั้ง',
        deleteSuccess: 'ลบสิทธิ์สำเร็จ!',
        deleteFailed: 'ลบสิทธิ์ล้มเหลว กรุณาลองอีกครั้ง',
        permission: 'สิทธิ์',
        slug: 'Slug',
        description: 'คำอธิบาย',
        resource: 'ทรัพยากร',
        action: 'การดำเนินการ',
        content: 'เนื้อหา',
        detailedContent: 'เนื้อหาโดยละเอียด',
        selectAction: 'เลือกการดำเนินการ...',
        selectResourceAndAction: 'กรุณาเลือกทรัพยากรและการดำเนินการ',
        enterPermissionName: 'ใส่ชื่อสิทธิ์...',
        enterSlug: 'เช่น: users.view, venues.manage...',
        enterResource: 'เช่น: users, venues, dashboard...',
        enterDescription: 'ใส่คำอธิบายเกี่ยวกับสิทธิ์...',
        enterDetailedContent: 'ใส่เนื้อหาโดยละเอียดเกี่ยวกับสิทธิ์ (ตัวเลือก)...',
        noPermissionsFound: 'ไม่พบสิทธิ์',
        noPermissionsYet: 'ยังไม่มีสิทธิ์',
        loadingPermissions: 'กำลังโหลดรายการสิทธิ์...',
        // Pagination
        showing: 'แสดง',
        of: 'จาก',
        page: 'หน้า',
        previous: 'ก่อนหน้า',
        next: 'ถัดไป',
        // Delete confirmation
        deleteConfirmMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบสิทธิ์',
      },
      wallet: {
        title: 'กระเป๋าเงินและการชำระเงิน',
        addMethod: 'เพิ่มวิธีการชำระเงิน',
        totalMethods: 'วิธีการชำระเงินทั้งหมด',
        activeMethods: 'วิธีการที่ใช้งาน',
        totalDailyLimit: 'ขีดจำกัดรายวันทั้งหมด',
        dailyLimit: 'ขีดจำกัดรายวัน',
        monthlyLimit: 'ขีดจำกัดรายเดือน',
        bank: 'ธนาคาร',
        ewallet: 'กระเป๋าเงินอิเล็กทรอนิกส์',
        gateway: 'เกตเวย์การชำระเงิน',
        description: 'จัดการวิธีการชำระเงินและการตั้งค่ากระเป๋าเงิน',
      },
      promotions: {
        title: 'โปรโมชั่นและโบนัส',
        createPromotion: 'สร้างโปรโมชั่น',
        totalPrograms: 'โปรแกรมทั้งหมด',
        ongoing: 'กำลังดำเนินการ',
        totalParticipants: 'ผู้เข้าร่วมทั้งหมด',
        totalBonusAwarded: 'โบนัสที่มอบให้ทั้งหมด',
        programName: 'ชื่อโปรแกรม',
        bonus: 'โบนัส',
        maxBonus: 'โบนัสสูงสุด',
        participants: 'ผู้เข้าร่วม',
        startDate: 'วันที่เริ่มต้น',
        endDate: 'วันที่สิ้นสุด',
        firstDeposit: 'การฝากครั้งแรก',
        deposit: 'การฝากเงิน',
        cashback: 'เงินคืน',
        tournament: 'การแข่งขัน',
        rebate: 'เงินคืน',
        upcoming: 'กำลังจะมาถึง',
        expired: 'หมดอายุ',
        to: 'ถึง',
        description: 'จัดการโปรโมชั่นและโปรแกรมโบนัส',
      },
      transactions: {
        title: 'ธุรกรรม',
        searchPlaceholder: 'ค้นหาธุรกรรม (ID, ผู้เล่น)...',
        exportReport: 'ส่งออกรายงาน',
        totalTransactionsToday: 'ธุรกรรมทั้งหมดวันนี้',
        totalDeposit: 'การฝากเงินทั้งหมด',
        totalWithdraw: 'การถอนเงินทั้งหมด',
        pendingProcessing: 'รอดำเนินการ',
        transactionCode: 'รหัสธุรกรรม',
        amount: 'จำนวนเงิน',
        paymentMethod: 'วิธีการชำระเงิน',
        time: 'เวลา',
        deposit: 'ฝากเงิน',
        withdraw: 'ถอนเงิน',
        bet: 'เดิมพัน',
        completed: 'เสร็จสมบูรณ์',
        rejected: 'ปฏิเสธ',
        description: 'ดูและจัดการธุรกรรมทั้งหมดในระบบ',
        customer: 'ลูกค้า',
        venue: 'สถานที่',
        transactionTypeBooking: 'การจอง',
        transactionTypeService: 'บริการ',
        transactionTypeDeposit: 'ฝากเงิน',
        transactionTypeWithdraw: 'ถอนเงิน',
        transactionTypeRefund: 'คืนเงิน',
        paymentMethodCash: 'เงินสด',
        paymentMethodTransfer: 'โอนเงิน',
        paymentMethodEwallet: 'กระเป๋าเงินอิเล็กทรอนิกส์',
        statusPending: 'รอดำเนินการ',
        statusCompleted: 'เสร็จสมบูรณ์',
        statusRejected: 'ปฏิเสธ',
        searchTransactionPlaceholder: 'ค้นหาธุรกรรม (รหัส, ลูกค้า, สถานที่)...',
        totalRevenue: 'รายได้ทั้งหมด',
        totalRefund: 'คืนเงินทั้งหมด',
      },
      auditLogs: {
        title: 'บันทึกการตรวจสอบ',
        searchPlaceholder: 'ค้นหาบันทึก (ผู้ใช้, การกระทำ, ทรัพยากร)...',
        description: 'บันทึกกิจกรรมและการเข้าถึงระบบ',
        exportLogs: 'ส่งออกบันทึก',
        time: 'เวลา',
        user: 'ผู้ใช้',
        action: 'การกระทำ',
        resource: 'ทรัพยากร',
        ipAddress: 'ที่อยู่ IP',
        login: 'เข้าสู่ระบบ',
        logout: 'ออกจากระบบ',
        updatePlayer: 'อัปเดตผู้เล่น',
        createPromotion: 'สร้างโปรโมชั่น',
        deleteGame: 'ลบเกม',
        changeSettings: 'เปลี่ยนการตั้งค่า',
        viewSensitiveData: 'ดูข้อมูลที่ละเอียดอ่อน',
      },
      settings: {
        title: 'การตั้งค่าระบบ',
        saveSettings: 'บันทึกการตั้งค่า',
        generalSettings: 'การตั้งค่าทั่วไป',
        notificationSettings: 'การตั้งค่าการแจ้งเตือน',
        securitySettings: 'ความปลอดภัย',
        paymentSettings: 'การตั้งค่าการชำระเงิน',
        systemName: 'ชื่อระบบ',
        systemDescription: 'คำอธิบาย',
        defaultLanguage: 'ภาษาเริ่มต้น',
        emailNotification: 'การแจ้งเตือนทางอีเมล',
        emailNotificationDesc: 'ส่งอีเมลเมื่อมีเหตุการณ์สำคัญ',
        pushNotification: 'การแจ้งเตือนแบบ Push',
        pushNotificationDesc: 'แจ้งเตือนไปยังผู้ดูแลระบบ',
        smsAlert: 'การแจ้งเตือน SMS',
        smsAlertDesc: 'ส่ง SMS สำหรับการแจ้งเตือนที่สำคัญ',
        security: 'ความปลอดภัย',
        sessionTimeout: 'เวลาหมดอายุของเซสชัน (นาที)',
        maxLoginAttempts: 'จำนวนครั้งที่เข้าสู่ระบบผิดพลาดสูงสุด',
        require2FA: 'ต้องการ 2FA',
        require2FADesc: 'การยืนยันตัวตนสองปัจจัยสำหรับผู้ดูแลระบบ',
        minDepositLimit: 'ขีดจำกัดการฝากขั้นต่ำ (บาท)',
        minWithdrawLimit: 'ขีดจำกัดการถอนขั้นต่ำ (บาท)',
        withdrawProcessingTime: 'เวลาประมวลผลการถอน (ชั่วโมง)',
        description: 'กำหนดค่าการตั้งค่าและความชอบของระบบ',
      },
      alerts: {
        totalAlerts: 'การแจ้งเตือนทั้งหมด',
        unread: 'ยังไม่ได้อ่าน',
        warning: 'คำเตือน',
        totalAlertsLabel: 'การแจ้งเตือนทั้งหมด',
        description: 'ดูและจัดการการแจ้งเตือนและแจ้งเตือนระบบ',
        alertHighSystemLoad: 'โหลดระบบสูง',
        alertPaymentGatewayTimeout: 'Payment gateway timeout',
        alertBackupCompleted: 'สำรองข้อมูลเสร็จสมบูรณ์',
        alertRateLimitNear: 'Rate limit ใกล้ถึง',
        alertDeploymentSuccess: 'Deployment สำเร็จ',
        alertHighSystemLoadMessage: 'การใช้ CPU ถึง 85%',
        alertPaymentGatewayTimeoutMessage: 'Payment gateway timeout',
        alertBackupCompletedMessage: 'สำรองข้อมูลเสร็จสมบูรณ์',
        alertRateLimitNearMessage: 'API rate limit ใกล้ถึง',
        alertDeploymentSuccessMessage: 'Deployment สำเร็จ',
      },
      reports: {
        exportPdf: 'ส่งออก PDF',
        exportExcel: 'ส่งออก Excel',
        monthlyRevenue: 'รายได้เดือนนี้',
        profit: 'กำไร',
        revenueByMonth: 'รายได้ตามเดือน',
        revenue: 'รายได้',
        winRate: 'อัตราชนะ',
        comparedToLastMonth: '↑ % เทียบกับเดือนที่แล้ว',
        description: 'ดูและส่งออกรายงานและสถิติระบบ',
      },
      analytics: {
        registration: 'การลงทะเบียน',
        firstDeposit: 'การฝากครั้งแรก',
        playGame: 'เล่นเกม',
        activeUsers: 'ผู้ใช้ที่ใช้งาน',
        revenuePerDay: 'รายได้/วัน',
        sessions: 'เซสชัน',
        conversionRate: 'อัตราการแปลง',
        performanceLast5Days: 'ประสิทธิภาพ 5 วันที่ผ่านมา',
        conversionRateChart: 'อัตราการแปลง',
        revenueTrend: 'แนวโน้มรายได้',
        comparedToYesterday: '↑ % เทียบกับเมื่อวาน',
        description: 'ดูการวิเคราะห์ประสิทธิภาพและตัวชี้วัด',
      },
      monitoring: {
        online: 'ออนไลน์',
        offline: 'ออฟไลน์',
        warning: 'คำเตือน',
        systemStatus: 'สถานะระบบ',
        service: 'บริการ',
        uptime: 'เวลาทำงาน',
        latency: 'ความหน่วง',
        avgUptime: 'เวลาทำงานเฉลี่ย',
        totalServices: 'บริการทั้งหมด',
        recentEvents: 'เหตุการณ์ล่าสุด',
        description: 'ตรวจสอบบริการและประสิทธิภาพของระบบ',
        serviceGameServer: 'Game Server',
        servicePaymentGateway: 'Payment Gateway',
        serviceDatabase: 'Database',
        serviceApiGateway: 'API Gateway',
        serviceNotificationService: 'Notification Service',
        eventHighLoad: 'High load detected',
        eventBackupCompleted: 'Backup completed',
        eventTransactionProcessed: 'Transaction processed',
        eventRateLimitWarning: 'Rate limit warning',
        eventNewPlayerJoined: 'New player joined',
      },
      risk: {
        totalAlerts: 'การแจ้งเตือนความเสี่ยงทั้งหมด',
        fraud: 'การฉ้อโกง',
        unusualPattern: 'รูปแบบผิดปกติ',
        accountCompromise: 'บัญชีถูกบุกรุก',
        pending: 'รอดำเนินการ',
        investigating: 'กำลังสอบสวน',
        resolved: 'แก้ไขแล้ว',
        critical: 'วิกฤต',
        high: 'สูง',
        medium: 'ปานกลาง',
        low: 'ต่ำ',
        lockedAccounts: 'บัญชีที่ถูกล็อค',
        type: 'ประเภท',
        severity: 'ระดับความรุนแรง',
        time: 'เวลา',
        title: 'การจัดการความเสี่ยง',
        description: 'ตรวจจับและจัดการความเสี่ยงด้านความปลอดภัย',
      },
      api: {
        title: 'การจัดการ API',
        createApiKey: 'สร้าง API Key ใหม่',
        description: 'จัดการ API keys และ endpoints',
        totalApiKeys: 'API Keys ทั้งหมด',
        activeKeys: 'Keys ที่ใช้งาน',
        totalRequestsToday: 'คำขอทั้งหมดวันนี้',
        avgResponseTime: 'เวลาตอบสนองเฉลี่ย',
        apiKeys: 'API Keys',
        apiKey: 'API Key',
        lastUsed: 'ใช้งานล่าสุด',
        requests: 'คำขอ',
        rateLimit: 'อัตราการจำกัด',
        apiEndpoints: 'API Endpoints',
        method: 'วิธี',
        path: 'เส้นทาง',
        callsToday: 'การเรียกวันนี้',
        avgResponse: 'การตอบสนองเฉลี่ย',
      },
      players: {
        totalPlayers: 'ผู้เล่นทั้งหมด',
        activePlayers: 'ผู้เล่นที่ใช้งาน',
        inactivePlayers: 'ผู้เล่นที่ไม่ใช้งาน',
        totalBalance: 'ยอดรวม',
        username: 'ชื่อผู้ใช้',
        balance: 'ยอดเงิน',
        registrationDate: 'วันที่ลงทะเบียน',
        description: 'จัดการและติดตามผู้เล่นในระบบ',
      },
      profile: {
        description: 'ดูและจัดการข้อมูลโปรไฟล์ส่วนตัวของคุณ',
        personalInfo: 'ข้อมูลส่วนตัว',
        accountSecurity: 'ความปลอดภัยของบัญชี',
        changePassword: 'เปลี่ยนรหัสผ่าน',
        changePasswordDesc: 'อัปเดตรหัสผ่านบัญชีของคุณเพื่อความปลอดภัยที่ดีขึ้น',
        twoFactorAuth: 'การยืนยันตัวตนสองปัจจัย',
        twoFactorAuthDesc: 'เพิ่มชั้นความปลอดภัยเพิ่มเติมให้กับบัญชีของคุณ',
        changePhoto: 'เปลี่ยนรูปภาพ',
      },
      userSettings: {
        description: 'จัดการการตั้งค่าและความชอบส่วนตัวของคุณ',
        notifications: 'การแจ้งเตือน',
        appearance: 'รูปลักษณ์',
        privacy: 'ความเป็นส่วนตัว',
        emailNotifications: 'การแจ้งเตือนทางอีเมล',
        emailNotificationsDesc: 'รับการแจ้งเตือนทางอีเมล',
        pushNotifications: 'การแจ้งเตือนแบบ Push',
        pushNotificationsDesc: 'รับการแจ้งเตือนแบบ push ในเบราว์เซอร์',
        smsNotifications: 'การแจ้งเตือน SMS',
        smsNotificationsDesc: 'รับการแจ้งเตือนทาง SMS',
        language: 'ภาษา',
        theme: 'ธีม',
        light: 'สว่าง',
        dark: 'มืด',
        auto: 'อัตโนมัติ',
        showEmail: 'แสดงอีเมล',
        showEmailDesc: 'แสดงที่อยู่อีเมลของคุณให้ผู้ใช้คนอื่นเห็น',
        showPhone: 'แสดงเบอร์โทรศัพท์',
        showPhoneDesc: 'แสดงเบอร์โทรศัพท์ของคุณให้ผู้ใช้คนอื่นเห็น',
      },
      tables: {
        id: 'ID',
        player: 'ผู้เล่น',
        type: 'ประเภท',
        severity: 'ระดับความรุนแรง',
        description: 'คำอธิบาย',
        status: 'สถานะ',
        time: 'เวลา',
        actions: 'การดำเนินการ',
        service: 'บริการ',
        uptime: 'เวลาทำงาน',
        latency: 'ความหน่วง',
        players: 'ผู้เล่น',
        gameName: 'ชื่อเกม',
        revenue: 'รายได้',
        totalWagered: 'ยอดเดิมพันรวม',
        game: 'เกม',
        wagered: 'ยอดเดิมพัน',
      },
      helpSupport: {
        description: 'รับความช่วยเหลือและสนับสนุนสำหรับบัญชีและบริการของคุณ',
        emailSupport: 'การสนับสนุนทางอีเมล',
        emailSupportDesc: 'ส่งอีเมลถึงเราและเราจะตอบกลับภายใน 24 ชั่วโมง',
        liveChat: 'แชทสด',
        liveChatDesc: 'แชทกับทีมสนับสนุนของเราแบบเรียลไทม์',
        startChat: 'เริ่มแชท',
        phoneSupport: 'การสนับสนุนทางโทรศัพท์',
        phoneSupportDesc: 'โทรหาเราเพื่อรับความช่วยเหลือทันที',
        faq: 'คำถามที่พบบ่อย',
        gettingStarted: 'เริ่มต้นใช้งาน',
        accountManagement: 'การจัดการบัญชี',
        faq1Question: 'ฉันจะสร้างบัญชีได้อย่างไร?',
        faq1Answer: 'คลิกปุ่มลงทะเบียนและกรอกข้อมูลที่จำเป็น',
        faq2Question: 'ฉันจะรีเซ็ตรหัสผ่านได้อย่างไร?',
        faq2Answer: 'คลิกลิงก์ "ลืมรหัสผ่าน" บนหน้าเข้าสู่ระบบ',
        faq3Question: 'ฉันจะติดต่อฝ่ายสนับสนุนได้อย่างไร?',
        faq3Answer: 'คุณสามารถติดต่อเราผ่านอีเมล แชทสด หรือโทรศัพท์',
        faq4Question: 'ฉันจะเปิดใช้งาน 2FA ได้อย่างไร?',
        faq4Answer: 'ไปที่ "โปรไฟล์ของฉัน" > "ความปลอดภัยบัญชี" และทำตามคำแนะนำในการตั้งค่าการยืนยันตัวตนแบบสองปัจจัย',
        resources: 'ทรัพยากร',
        userGuide: 'คู่มือผู้ใช้',
        userGuideDesc: 'คู่มือฉบับสมบูรณ์สำหรับการใช้แดชบอร์ดผู้ดูแลระบบ',
        apiDocumentation: 'เอกสาร API',
        apiDocumentationDesc: 'เอกสารทางเทคนิคสำหรับการรวม API',
        community: 'ฟอรัมชุมชน',
        communityDesc: 'เข้าร่วมชุมชนของเราเพื่อรับความช่วยเหลือและแบ่งปันความคิด',
      },
    },
    header: {
      providerPortal: 'พอร์ทัลผู้ให้บริการ',
      operatorPortal: 'พอร์ทัลผู้ดำเนินการ',
      adminPortal: 'พอร์ทัลผู้ดูแลระบบ',
      myProfile: 'โปรไฟล์ของฉัน',
      helpSupport: 'ช่วยเหลือและสนับสนุน',
    },
    menu: {
      dashboard: 'แดชบอร์ด',
      venuesManagement: 'การจัดการสถานที่',
      gamesManagement: 'จัดการเกม',
      operatorsManagement: 'จัดการผู้ดำเนินการ',
      providerAccountsManagement: 'จัดการบัญชีผู้ให้บริการ',
      rolesPermissionsManagement: 'จัดการบทบาทและสิทธิ์',
      rolesManagement: 'จัดการบทบาท',
      permissionsManagement: 'จัดการสิทธิ์',
      playersManagement: 'จัดการผู้เล่น',
      transactions: 'ธุรกรรม',
      walletPayment: 'กระเป๋าเงินและการชำระเงิน',
      promotionsBonus: 'โปรโมชั่นและโบนัส',
      reports: 'รายงานและสถิติ',
      analytics: 'การวิเคราะห์ประสิทธิภาพ',
      articlesManagement: 'จัดการบทความ',
      usersManagement: 'จัดการผู้ใช้',
      commentsManagement: 'จัดการความคิดเห็น',
      ratingsManagement: 'จัดการการให้คะแนน',
      notificationsManagement: 'จัดการการแจ้งเตือน',
      feedsManagement: 'จัดการ Feeds',
      kycManagement: 'จัดการ KYC',
      monitoring: 'การตรวจสอบ',
      riskManagement: 'การจัดการความเสี่ยง',
      apiManagement: 'การจัดการ API',
      alerts: 'การแจ้งเตือนและคำเตือน',
      auditLogs: 'บันทึกการตรวจสอบ',
      cachingManagement: 'การจัดการแคช',
      systemStatus: 'สถานะระบบ',
      systemSettings: 'การตั้งค่าระบบ',
    },
    languages: {
      en: 'อังกฤษ',
      vi: 'เวียดนาม',
      zh: 'จีน',
      th: 'ไทย',
      ja: 'ญี่ปุ่น',
      ko: 'เกาหลี',
    },
  },
  ja: {
    common: {
      search: '検索',
      profile: 'プロフィール',
      settings: '設定',
      help: 'ヘルプ',
      logout: 'ログアウト',
      fullscreen: '全画面',
      messages: 'メッセージ',
      notifications: '通知',
      viewAll: 'すべて表示',
      language: '言語',
      user: 'ユーザー',
      searchPlaceholder: '検索...',
      searchBy: '検索',
      // Actions
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      editAction: '編集',
      add: '追加',
      create: '作成',
      update: '更新',
      submit: '送信',
      confirm: '確認',
      close: '閉じる',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      view: '表示',
      detailsAction: '詳細',
      actions: '操作',
      // Status
      status: 'ステータス',
      active: 'アクティブ',
      inactive: '非アクティブ',
      success: '成功',
      error: 'エラー',
      loading: '読み込み中',
      yes: 'はい',
      no: 'いいえ',
      ok: 'OK',
      // Login
      providerOperatorPortal: 'プロバイダー＆オペレーター ポータル',
      login: 'ログイン',
      welcome: 'おかえりなさい！',
      emailOrUsername: 'メールアドレスまたはユーザー名',
      password: 'パスワード',
      forgotPassword: 'パスワードを忘れた場合',
      loggingIn: 'ログイン中...',
      // Messages
      pleaseFillAllFields: 'すべてのフィールドに入力してください',
      loginSuccess: 'ログインに成功しました！',
      loginFailed: 'ログインに失敗しました。ログイン情報を確認してください。',
      checkLoginInfo: 'ログインに失敗しました。ログイン情報を確認してください。',
      // Table & List
      filter: 'フィルター',
      noData: 'データがありません',
      loadingData: 'データを読み込み中...',
      showing: '表示中',
      to: 'から',
      of: '件中',
      page: 'ページ',
      // Status
      paused: '一時停止',
      banned: '禁止',
      suspicious: '不審な活動',
      // Actions
      creating: '作成中...',
      deleting: '削除中...',
      updating: '更新中...',
      saving: '保存中...',
      // Forms
      name: '名前',
      email: 'メール',
      code: 'コード',
      description: '説明',
      phone: '電話',
      username: 'ユーザー名',
      // Modals
      addNew: '新規追加',
      confirmDelete: '削除の確認',
      deleteConfirmMessage: 'この項目を削除してもよろしいですか？この操作は元に戻せません。',
      deleteWarning: 'この操作は元に戻せません。',
      // Placeholders
      enterName: '名前を入力...',
      enterEmail: 'メールを入力...',
      enterGameName: 'ゲーム名を入力...',
      enterProviderAccountEmail: 'プロバイダーアカウントのメールを入力...',
      // Details
      createdAt: '作成日',
      lastLogin: '最終ログイン',
      neverLoggedIn: 'ログインしたことがありません',
      additionalInfo: '追加情報',
      edit: '編集',
      // Dashboard
      overview: '概要',
      increased: '増加',
      decreased: '減少',
      weeklySales: '週間売上',
      weeklyOrders: '週間注文',
      visitorsOnline: 'オンライン訪問者',
      visitAndSalesStatistics: '訪問と売上の統計',
      trafficSources: 'トラフィックソース',
      searchEngines: '検索エンジン',
      directClick: '直接クリック',
      bookmarksClick: 'ブックマーククリック',
      recentTickets: '最近のチケット',
      assignee: '担当者',
      subject: '件名',
      lastUpdate: '最終更新',
      trackingId: 'トラッキングID',
      done: '完了',
      logoutSuccess: 'ログアウト成功！',
      logoutLocal: 'ローカルログアウト',
    },
    pages: {
      dashboard: {
        title: 'ダッシュボード',
        overview: '概要',
        weeklySales: '週間売上',
        weeklyOrders: '週間注文',
        visitorsOnline: 'オンライン訪問者',
        visitAndSalesStatistics: '訪問と売上の統計',
        trafficSources: 'トラフィックソース',
        searchEngines: '検索エンジン',
        directClick: '直接クリック',
        bookmarksClick: 'ブックマーククリック',
        recentTickets: '最近のチケット',
        assignee: '担当者',
        subject: '件名',
        lastUpdate: '最終更新',
        trackingId: 'トラッキングID',
        done: '完了',
        increased: '増加',
        decreased: '減少',
        weeklyRevenue: '週間収益',
        bookingsCount: '予約数',
        activeCustomers: 'アクティブ顧客',
      },
      operators: {
        title: 'オペレーター管理',
        addOperator: 'オペレーターを追加',
        createOperator: 'オペレーターを作成',
        deleteOperator: 'オペレーターを削除',
        operatorDetails: 'オペレーター詳細',
        searchPlaceholder: '名前、メールで検索...',
        createSuccess: 'オペレーターの作成に成功しました！',
        createFailed: 'オペレーターの作成に失敗しました。もう一度お試しください。',
        deleteSuccess: 'オペレーターの削除に成功しました！',
        deleteFailed: 'オペレーターの削除に失敗しました。もう一度お試しください。',
        viewDetails: '詳細を表示',
        deleteOperatorTitle: 'オペレーターを削除',
        description: 'システム内のオペレーターを管理および追跡',
        noOperatorsFound: 'オペレーターが見つかりません',
        noOperatorsYet: 'オペレーターがまだありません',
        operatorCode: 'オペレーターコード',
        operatorName: 'オペレーター名',
        enterOperatorCode: 'オペレーターコードを入力...',
        enterOperatorName: 'オペレーター名を入力...',
        randomData: 'ランダムデータ',
        random: 'ランダム',
        edit: '編集',
        userNotFound: 'ユーザー情報が見つかりません',
        operatorsLabel: 'オペレーター',
      },
      games: {
        title: 'ゲーム管理',
        addGame: 'ゲームを追加',
        createGame: 'ゲームを作成',
        searchPlaceholder: 'ゲームを検索...',
        description: 'システム内のゲームを管理および追跡',
        venueManagement: '会場管理',
        venueName: '会場名',
        venueType: '会場タイプ',
        venueTypeKaraoke: 'カラオケ',
        venueTypeMassage: 'マッサージ',
        venueTypeClub: 'クラブ',
        enterVenueName: '会場名を入力...',
        bookingsCount: '予約数',
        revenue: '収益',
        actions: '操作',
        addVenue: '会場を追加',
        searchVenuePlaceholder: '会場を検索...',
        noVenuesYet: '会場がまだありません',
        createSuccess: '作成成功',
        deleteSuccess: '削除成功',
        deleteFailed: '削除失敗',
      },
      providerAccounts: {
        title: 'プロバイダーアカウント管理',
        addAccount: 'プロバイダーアカウントを追加',
        createAccount: 'プロバイダーアカウントを作成',
        deleteAccount: 'プロバイダーアカウントを削除',
        searchPlaceholder: '名前、メール、コードで検索...',
        createSuccess: 'プロバイダーアカウントの作成に成功しました！',
        createFailed: 'プロバイダーアカウントの作成に失敗しました。もう一度お試しください。',
        deleteSuccess: 'プロバイダーアカウントの削除に成功しました！',
        deleteFailed: 'プロバイダーアカウントの削除に失敗しました。もう一度お試しください。',
        deleteAccountTitle: 'プロバイダーアカウントを削除',
        description: 'システム内のプロバイダーアカウントを管理および追跡',
        totalAccounts: '総アカウント数',
        activeAccounts: 'アクティブ',
        loadingAccounts: 'プロバイダーアカウントリストを読み込み中...',
        providerAccount: 'プロバイダーアカウント',
        noAccountsFound: 'プロバイダーアカウントが見つかりません',
        noAccountsYet: 'プロバイダーアカウントがまだありません',
        randomData: 'ランダムデータ',
        random: 'ランダム',
      },
      roles: {
        title: 'ロール管理',
        addRole: 'ロールを追加',
        createRole: 'ロールを作成',
        editRole: 'ロールを編集',
        deleteRole: 'ロールを削除',
        searchPlaceholder: 'ロールを検索...',
        createSuccess: 'ロールの作成に成功しました！',
        createFailed: 'ロールの作成に失敗しました。もう一度お試しください。',
        updateSuccess: 'ロールの更新に成功しました！',
        updateFailed: 'ロールの更新に失敗しました。もう一度お試しください。',
        deleteSuccess: 'ロールの削除に成功しました！',
        deleteFailed: 'ロールの削除に失敗しました。もう一度お試しください。',
        role: 'ロール',
        slug: 'Slug',
        description: '説明',
        permissions: '権限',
        noRolesFound: 'ロールが見つかりません',
        noRolesYet: 'ロールがまだありません',
        loadingRoles: 'ロールリストを読み込み中...',
        loadingPermissions: '権限リストを読み込み中...',
        operatorAccounts: 'オペレーターアカウント',
        operatorAccount: 'オペレーターアカウント',
        selectPermissions: '権限を選択',
        // Assign permissions
        assignPermissions: '権限を割り当て',
        assignPermissionsToRole: 'ロールに権限を割り当て',
        saveChanges: '変更を保存',
        saving: '保存中...',
        selectAll: '全選択',
        selectedCount: '選択済み',
        noPermissionsYet: 'システムに権限がまだありません',
        assignSuccess: '権限の割り当てに成功しました！',
        assignFailed: '権限の割り当てに失敗しました。もう一度お試しください。',
        loadPermissionsFailed: '権限リストを読み込めませんでした',
      },
      permissions: {
        title: '権限管理',
        addPermission: '権限を追加',
        createPermission: '権限を作成',
        editPermission: '権限を編集',
        deletePermission: '権限を削除',
        searchPlaceholder: '名前、slug、リソースで検索...',
        createSuccess: '権限の作成に成功しました！',
        createFailed: '権限の作成に失敗しました。もう一度お試しください。',
        updateSuccess: '権限の更新に成功しました！',
        updateFailed: '権限の更新に失敗しました。もう一度お試しください。',
        deleteSuccess: '権限の削除に成功しました！',
        deleteFailed: '権限の削除に失敗しました。もう一度お試しください。',
        permission: '権限',
        slug: 'Slug',
        description: '説明',
        resource: 'リソース',
        action: 'アクション',
        content: 'コンテンツ',
        detailedContent: '詳細コンテンツ',
        selectAction: 'アクションを選択...',
        selectResourceAndAction: 'リソースとアクションを選択してください',
        enterPermissionName: '権限名を入力...',
        enterSlug: '例: users.view, venues.manage...',
        enterResource: '例: users, venues, dashboard...',
        enterDescription: '権限の説明を入力...',
        enterDetailedContent: '権限の詳細コンテンツを入力（オプション）...',
        noPermissionsFound: '権限が見つかりません',
        noPermissionsYet: '権限がまだありません',
        loadingPermissions: '権限リストを読み込み中...',
        // Pagination
        showing: '表示中',
        of: '/',
        page: 'ページ',
        previous: '前へ',
        next: '次へ',
        // Delete confirmation
        deleteConfirmMessage: '権限を削除してもよろしいですか',
      },
      wallet: {
        title: 'ウォレットと支払い',
        addMethod: '支払い方法を追加',
        totalMethods: '総支払い方法',
        activeMethods: 'アクティブ方法',
        totalDailyLimit: '総日次制限',
        dailyLimit: '日次制限',
        monthlyLimit: '月次制限',
        bank: '銀行',
        ewallet: '電子ウォレット',
        gateway: '支払いゲートウェイ',
        description: '支払い方法とウォレット設定の管理',
      },
      promotions: {
        title: 'プロモーションとボーナス',
        createPromotion: 'プロモーションを作成',
        totalPrograms: 'プログラム総数',
        ongoing: '進行中',
        totalParticipants: '総参加者数',
        totalBonusAwarded: '付与された総ボーナス',
        programName: 'プログラム名',
        bonus: 'ボーナス',
        maxBonus: '最大ボーナス',
        participants: '参加者',
        startDate: '開始日',
        endDate: '終了日',
        firstDeposit: '初回入金',
        deposit: '入金',
        cashback: 'キャッシュバック',
        tournament: 'トーナメント',
        rebate: 'リベート',
        upcoming: '近日開始',
        expired: '期限切れ',
        to: 'まで',
        description: 'プロモーションとボーナスプログラムの管理',
      },
      transactions: {
        title: '取引',
        searchPlaceholder: '取引を検索（ID、プレイヤー）...',
        exportReport: 'レポートをエクスポート',
        totalTransactionsToday: '今日の総取引',
        totalDeposit: '総入金',
        totalWithdraw: '総出金',
        pendingProcessing: '処理待ち',
        transactionCode: '取引コード',
        amount: '金額',
        paymentMethod: '支払い方法',
        time: '時間',
        deposit: '入金',
        withdraw: '出金',
        bet: 'ベット',
        completed: '完了',
        rejected: '拒否',
        description: 'システム内のすべての取引を表示および管理',
        customer: '顧客',
        venue: '会場',
        transactionTypeBooking: '予約',
        transactionTypeService: 'サービス',
        transactionTypeDeposit: '入金',
        transactionTypeWithdraw: '出金',
        transactionTypeRefund: '返金',
        paymentMethodCash: '現金',
        paymentMethodTransfer: '振込',
        paymentMethodEwallet: '電子財布',
        statusPending: '保留中',
        statusCompleted: '完了',
        statusRejected: '拒否',
        searchTransactionPlaceholder: '取引を検索 (コード、顧客、会場)...',
        totalRevenue: '総収益',
        totalRefund: '総返金',
      },
      auditLogs: {
        title: '監査ログ',
        searchPlaceholder: 'ログを検索（ユーザー、アクション、リソース）...',
        description: 'システム活動とアクセスログ',
        exportLogs: 'ログをエクスポート',
        time: '時間',
        user: 'ユーザー',
        action: 'アクション',
        resource: 'リソース',
        ipAddress: 'IPアドレス',
        login: 'ログイン',
        logout: 'ログアウト',
        updatePlayer: 'プレイヤーを更新',
        createPromotion: 'プロモーションを作成',
        deleteGame: 'ゲームを削除',
        changeSettings: '設定を変更',
        viewSensitiveData: '機密データを表示',
      },
      settings: {
        title: 'システム設定',
        saveSettings: '設定を保存',
        generalSettings: '一般設定',
        notificationSettings: '通知設定',
        securitySettings: 'セキュリティ',
        paymentSettings: '支払い設定',
        systemName: 'システム名',
        systemDescription: '説明',
        defaultLanguage: 'デフォルト言語',
        emailNotification: 'メール通知',
        emailNotificationDesc: '重要なイベント時にメールを送信',
        pushNotification: 'プッシュ通知',
        pushNotificationDesc: '管理者にプッシュ通知を送信',
        smsAlert: 'SMSアラート',
        smsAlertDesc: '重要なアラート時にSMSを送信',
        security: 'セキュリティ',
        sessionTimeout: 'セッションタイムアウト（分）',
        maxLoginAttempts: '最大ログイン試行回数',
        require2FA: '2FAを要求',
        require2FADesc: '管理者に二要素認証を要求',
        minDepositLimit: '最小入金限度額（VND）',
        minWithdrawLimit: '最小出金限度額（VND）',
        withdrawProcessingTime: '出金処理時間（時間）',
        description: 'システム設定と環境設定の構成',
      },
      alerts: {
        totalAlerts: 'アラート総数',
        unread: '未読',
        warning: '警告',
        totalAlertsLabel: 'アラート総数',
        description: 'システムアラートと通知の表示と管理',
        alertHighSystemLoad: 'システム負荷が高い',
        alertPaymentGatewayTimeout: '決済ゲートウェイタイムアウト',
        alertBackupCompleted: 'バックアップ完了',
        alertRateLimitNear: 'レート制限に近い',
        alertDeploymentSuccess: 'デプロイ成功',
        alertHighSystemLoadMessage: 'CPU使用率が85%に達しました',
        alertPaymentGatewayTimeoutMessage: '決済ゲートウェイがタイムアウトしました',
        alertBackupCompletedMessage: 'システムバックアップが正常に完了しました',
        alertRateLimitNearMessage: 'APIレート制限がしきい値に近づいています',
        alertDeploymentSuccessMessage: '新しいバージョンが正常にデプロイされました',
      },
      reports: {
        exportPdf: 'PDFをエクスポート',
        exportExcel: 'Excelをエクスポート',
        monthlyRevenue: '今月の収益',
        profit: '利益',
        revenueByMonth: '月別収益',
        revenue: '収益',
        winRate: '勝率',
        comparedToLastMonth: '↑ % 先月比',
        description: 'システムレポートと統計の表示とエクスポート',
      },
      analytics: {
        registration: '登録',
        firstDeposit: '初回入金',
        playGame: 'ゲーム',
        activeUsers: 'アクティブユーザー',
        revenuePerDay: '1日あたりの収益',
        sessions: 'セッション',
        conversionRate: 'コンバージョン率',
        performanceLast5Days: '過去5日のパフォーマンス',
        conversionRateChart: 'コンバージョン率',
        revenueTrend: '収益トレンド',
        comparedToYesterday: '↑ % 昨日比',
        description: 'パフォーマンス分析とメトリクスの表示',
      },
      monitoring: {
        online: 'オンライン',
        offline: 'オフライン',
        warning: '警告',
        systemStatus: 'システム状態',
        service: 'サービス',
        uptime: '稼働時間',
        latency: 'レイテンシ',
        avgUptime: '平均稼働時間',
        totalServices: 'サービス総数',
        recentEvents: '最近のイベント',
        description: 'システムサービスとパフォーマンスの監視',
        serviceGameServer: 'ゲームサーバー',
        servicePaymentGateway: '決済ゲートウェイ',
        serviceDatabase: 'データベース',
        serviceApiGateway: 'APIゲートウェイ',
        serviceNotificationService: '通知サービス',
        eventHighLoad: '高負荷が検出されました',
        eventBackupCompleted: 'バックアップ完了',
        eventTransactionProcessed: '取引処理済み',
        eventRateLimitWarning: 'レート制限警告',
        eventNewPlayerJoined: '新しいプレイヤーが参加しました',
      },
      risk: {
        totalAlerts: 'リスクアラート総数',
        fraud: '詐欺',
        unusualPattern: '異常パターン',
        accountCompromise: 'アカウント侵害',
        pending: '保留中',
        investigating: '調査中',
        resolved: '解決済み',
        critical: '重大',
        high: '高',
        medium: '中',
        low: '低',
        lockedAccounts: 'ロックされたアカウント',
        type: 'タイプ',
        severity: '深刻度',
        time: '時間',
        title: 'リスク管理',
        description: 'セキュリティリスクの検出と処理',
      },
      api: {
        title: 'API管理',
        createApiKey: '新しいAPIキーを作成',
        description: 'APIキーとエンドポイントの管理',
        totalApiKeys: 'APIキー総数',
        activeKeys: 'アクティブキー',
        totalRequestsToday: '今日の総リクエスト',
        avgResponseTime: '平均応答時間',
        apiKeys: 'APIキー',
        apiKey: 'APIキー',
        lastUsed: '最終使用',
        requests: 'リクエスト',
        rateLimit: 'レート制限',
        apiEndpoints: 'APIエンドポイント',
        method: 'メソッド',
        path: 'パス',
        callsToday: '今日の呼び出し',
        avgResponse: '平均応答',
      },
      players: {
        totalPlayers: '総プレイヤー数',
        activePlayers: 'アクティブプレイヤー',
        inactivePlayers: '非アクティブプレイヤー',
        totalBalance: '総残高',
        username: 'ユーザー名',
        balance: '残高',
        registrationDate: '登録日',
        description: 'システム内のプレイヤーを管理および追跡',
      },
      profile: {
        description: '個人プロフィール情報の表示と管理',
        personalInfo: '個人情報',
        accountSecurity: 'アカウントセキュリティ',
        changePassword: 'パスワード変更',
        changePasswordDesc: 'アカウントのセキュリティを向上させるためにパスワードを更新',
        twoFactorAuth: '二要素認証',
        twoFactorAuthDesc: 'アカウントに追加のセキュリティ層を追加',
        changePhoto: '写真を変更',
      },
      userSettings: {
        description: '個人設定と環境設定の管理',
        notifications: '通知',
        appearance: '外観',
        privacy: 'プライバシー',
        emailNotifications: 'メール通知',
        emailNotificationsDesc: 'メールで通知を受信',
        pushNotifications: 'プッシュ通知',
        pushNotificationsDesc: 'ブラウザでプッシュ通知を受信',
        smsNotifications: 'SMS通知',
        smsNotificationsDesc: 'SMSで通知を受信',
        language: '言語',
        theme: 'テーマ',
        light: 'ライト',
        dark: 'ダーク',
        auto: '自動',
        showEmail: 'メールを表示',
        showEmailDesc: '他のユーザーにメールアドレスを表示',
        showPhone: '電話を表示',
        showPhoneDesc: '他のユーザーに電話番号を表示',
      },
      tables: {
        id: 'ID',
        player: 'プレイヤー',
        type: 'タイプ',
        severity: '深刻度',
        description: '説明',
        status: 'ステータス',
        time: '時間',
        actions: '操作',
        service: 'サービス',
        uptime: '稼働時間',
        latency: 'レイテンシ',
        players: 'プレイヤー',
        gameName: 'ゲーム名',
        revenue: '収益',
        totalWagered: '総ベット',
        game: 'ゲーム',
        wagered: 'ベット',
      },
      helpSupport: {
        description: 'アカウントとサービスのヘルプとサポートを取得',
        emailSupport: 'メールサポート',
        emailSupportDesc: 'メールを送信していただければ、24時間以内に返信いたします',
        liveChat: 'ライブチャット',
        liveChatDesc: 'サポートチームとリアルタイムでチャット',
        startChat: 'チャットを開始',
        phoneSupport: '電話サポート',
        phoneSupportDesc: '即座のサポートのためにお電話ください',
        faq: 'よくある質問',
        gettingStarted: '始めましょう',
        accountManagement: 'アカウント管理',
        faq1Question: 'アカウントを作成するにはどうすればよいですか？',
        faq1Answer: '登録ボタンをクリックして必要な情報を入力してください',
        faq2Question: 'パスワードをリセットするにはどうすればよいですか？',
        faq2Answer: 'ログインページの「パスワードを忘れた」リンクをクリックしてください',
        faq3Question: 'サポートに連絡するにはどうすればよいですか？',
        faq3Answer: 'メール、ライブチャット、または電話でお問い合わせいただけます',
        faq4Question: '2FAを有効にするにはどうすればよいですか？',
        faq4Answer: '「マイプロフィール」>「アカウントセキュリティ」に移動し、二要素認証のセットアップ手順に従ってください',
        resources: 'リソース',
        userGuide: 'ユーザーガイド',
        userGuideDesc: '管理ダッシュボードの使用に関する完全なガイド',
        apiDocumentation: 'APIドキュメント',
        apiDocumentationDesc: 'API統合のための技術ドキュメント',
        community: 'コミュニティフォーラム',
        communityDesc: 'コミュニティに参加してヘルプを得たりアイデアを共有したりしましょう',
      },
    },
    header: {
      providerPortal: 'プロバイダーポータル',
      operatorPortal: 'オペレーターポータル',
      adminPortal: '管理者ポータル',
      myProfile: 'マイプロフィール',
      helpSupport: 'ヘルプとサポート',
    },
    menu: {
      dashboard: 'ダッシュボード',
      venuesManagement: '店舗管理',
      gamesManagement: 'ゲーム管理',
      operatorsManagement: 'オペレーター管理',
      providerAccountsManagement: 'プロバイダーアカウント管理',
      rolesPermissionsManagement: 'ロールと権限管理',
      rolesManagement: 'ロール管理',
      permissionsManagement: '権限管理',
      playersManagement: 'プレイヤー管理',
      transactions: '取引',
      walletPayment: 'ウォレットと支払い',
      promotionsBonus: 'プロモーションとボーナス',
      reports: 'レポートと統計',
      analytics: 'パフォーマンス分析',
      articlesManagement: '記事管理',
      usersManagement: 'ユーザー管理',
      commentsManagement: 'コメント管理',
      ratingsManagement: '評価管理',
      notificationsManagement: '通知管理',
      feedsManagement: 'フィード管理',
      kycManagement: 'KYC管理',
      monitoring: 'モニタリング',
      riskManagement: 'リスク管理',
      apiManagement: 'API管理',
      alerts: 'アラートと警告',
      auditLogs: '監査ログ',
      cachingManagement: 'キャッシュ管理',
      systemStatus: 'システムステータス',
      systemSettings: 'システム設定',
    },
    languages: {
      en: '英語',
      vi: 'ベトナム語',
      zh: '中国語',
      th: 'タイ語',
      ja: '日本語',
      ko: '韓国語',
    },
  },
  ko: {
    common: {
      search: '검색',
      profile: '프로필',
      settings: '설정',
      help: '도움말',
      logout: '로그아웃',
      fullscreen: '전체 화면',
      messages: '메시지',
      notifications: '알림',
      viewAll: '모두 보기',
      language: '언어',
      user: '사용자',
      searchPlaceholder: '검색...',
      searchBy: '검색',
      // Actions
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      editAction: '편집',
      add: '추가',
      create: '생성',
      update: '업데이트',
      submit: '제출',
      confirm: '확인',
      close: '닫기',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      view: '보기',
      detailsAction: '세부 정보',
      actions: '작업',
      // Status
      status: '상태',
      active: '활성',
      inactive: '비활성',
      success: '성공',
      error: '오류',
      loading: '로딩 중',
      yes: '예',
      no: '아니오',
      ok: '확인',
      // Login
      providerOperatorPortal: '제공자 및 운영자 포털',
      login: '로그인',
      welcome: '다시 오신 것을 환영합니다!',
      emailOrUsername: '이메일 또는 사용자 이름',
      password: '비밀번호',
      forgotPassword: '비밀번호를 잊으셨나요?',
      loggingIn: '로그인 중...',
      // Messages
      pleaseFillAllFields: '모든 필드를 입력해주세요',
      loginSuccess: '로그인 성공!',
      loginFailed: '로그인 실패. 로그인 정보를 확인해주세요.',
      checkLoginInfo: '로그인 실패. 로그인 정보를 확인해주세요.',
      // Table & List
      filter: '필터',
      noData: '데이터가 없습니다',
      loadingData: '데이터 로딩 중...',
      showing: '표시',
      to: '부터',
      of: '중',
      page: '페이지',
      // Status
      paused: '일시 중지',
      banned: '차단됨',
      suspicious: '의심스러운 활동',
      // Actions
      creating: '생성 중...',
      deleting: '삭제 중...',
      updating: '업데이트 중...',
      saving: '저장 중...',
      // Forms
      name: '이름',
      email: '이메일',
      code: '코드',
      description: '설명',
      phone: '전화번호',
      username: '사용자 이름',
      // Modals
      addNew: '새로 추가',
      confirmDelete: '삭제 확인',
      deleteConfirmMessage: '이 항목을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
      deleteWarning: '이 작업은 취소할 수 없습니다.',
      // Placeholders
      enterName: '이름 입력...',
      enterEmail: '이메일 입력...',
      enterGameName: '게임 이름 입력...',
      enterProviderAccountEmail: '제공자 계정 이메일 입력...',
      // Details
      createdAt: '생성일',
      lastLogin: '마지막 로그인',
      neverLoggedIn: '로그인한 적 없음',
      additionalInfo: '추가 정보',
      edit: '편집',
      // Dashboard
      overview: '개요',
      increased: '증가',
      decreased: '감소',
      weeklySales: '주간 매출',
      weeklyOrders: '주간 주문',
      visitorsOnline: '온라인 방문자',
      visitAndSalesStatistics: '방문 및 매출 통계',
      trafficSources: '트래픽 소스',
      searchEngines: '검색 엔진',
      directClick: '직접 클릭',
      bookmarksClick: '북마크 클릭',
      recentTickets: '최근 티켓',
      assignee: '담당자',
      subject: '제목',
      lastUpdate: '마지막 업데이트',
      trackingId: '추적 ID',
      done: '완료',
      logoutSuccess: '로그아웃 성공!',
      logoutLocal: '로컬 로그아웃',
    },
    pages: {
      dashboard: {
        title: '대시보드',
        overview: '개요',
        weeklySales: '주간 매출',
        weeklyOrders: '주간 주문',
        visitorsOnline: '온라인 방문자',
        visitAndSalesStatistics: '방문 및 매출 통계',
        trafficSources: '트래픽 소스',
        searchEngines: '검색 엔진',
        directClick: '직접 클릭',
        bookmarksClick: '북마크 클릭',
        recentTickets: '최근 티켓',
        assignee: '담당자',
        subject: '제목',
        lastUpdate: '마지막 업데이트',
        trackingId: '추적 ID',
        done: '완료',
        increased: '증가',
        decreased: '감소',
        weeklyRevenue: '주간 수익',
        bookingsCount: '예약 수',
        activeCustomers: '활성 고객',
      },
      operators: {
        title: '운영자 관리',
        addOperator: '운영자 추가',
        createOperator: '운영자 생성',
        deleteOperator: '운영자 삭제',
        operatorDetails: '운영자 세부 정보',
        searchPlaceholder: '이름, 이메일로 검색...',
        createSuccess: '운영자 생성 성공!',
        createFailed: '운영자 생성 실패. 다시 시도해주세요.',
        deleteSuccess: '운영자 삭제 성공!',
        deleteFailed: '운영자 삭제 실패. 다시 시도해주세요.',
        viewDetails: '세부 정보 보기',
        deleteOperatorTitle: '운영자 삭제',
        description: '시스템의 운영자 관리 및 추적',
        noOperatorsFound: '운영자를 찾을 수 없음',
        noOperatorsYet: '아직 운영자 없음',
        operatorCode: '운영자 코드',
        operatorName: '운영자 이름',
        enterOperatorCode: '운영자 코드 입력...',
        enterOperatorName: '운영자 이름 입력...',
        randomData: '랜덤 데이터',
        random: '랜덤',
        edit: '편집',
        userNotFound: '사용자 정보를 찾을 수 없음',
        operatorsLabel: '운영자',
      },
      games: {
        title: '게임 관리',
        addGame: '게임 추가',
        createGame: '게임 생성',
        searchPlaceholder: '게임 검색...',
        description: '시스템의 게임 관리 및 추적',
        venueManagement: '장소 관리',
        venueName: '장소 이름',
        venueType: '장소 유형',
        venueTypeKaraoke: '노래방',
        venueTypeMassage: '마사지',
        venueTypeClub: '클럽',
        enterVenueName: '장소 이름 입력...',
        bookingsCount: '예약 수',
        revenue: '수익',
        actions: '작업',
        addVenue: '장소 추가',
        searchVenuePlaceholder: '장소 검색...',
        noVenuesYet: '아직 장소가 없습니다',
        createSuccess: '생성 성공',
        deleteSuccess: '삭제 성공',
        deleteFailed: '삭제 실패',
      },
      providerAccounts: {
        title: '제공자 계정 관리',
        addAccount: '제공자 계정 추가',
        createAccount: '제공자 계정 생성',
        deleteAccount: '제공자 계정 삭제',
        searchPlaceholder: '이름, 이메일, 코드로 검색...',
        createSuccess: '제공자 계정 생성 성공!',
        createFailed: '제공자 계정 생성 실패. 다시 시도해주세요.',
        deleteSuccess: '제공자 계정 삭제 성공!',
        deleteFailed: '제공자 계정 삭제 실패. 다시 시도해주세요.',
        deleteAccountTitle: '제공자 계정 삭제',
        description: '시스템의 제공자 계정 관리 및 추적',
        totalAccounts: '총 계정 수',
        activeAccounts: '활성',
        loadingAccounts: '제공자 계정 목록 로딩 중...',
        providerAccount: '제공자 계정',
        noAccountsFound: '제공자 계정을 찾을 수 없음',
        noAccountsYet: '아직 제공자 계정 없음',
        randomData: '랜덤 데이터',
        random: '랜덤',
      },
      roles: {
        title: '역할 관리',
        addRole: '역할 추가',
        createRole: '역할 생성',
        editRole: '역할 편집',
        deleteRole: '역할 삭제',
        searchPlaceholder: '역할 검색...',
        createSuccess: '역할 생성 성공!',
        createFailed: '역할 생성 실패. 다시 시도해주세요.',
        updateSuccess: '역할 업데이트 성공!',
        updateFailed: '역할 업데이트 실패. 다시 시도해주세요.',
        deleteSuccess: '역할 삭제 성공!',
        deleteFailed: '역할 삭제 실패. 다시 시도해주세요.',
        role: '역할',
        slug: 'Slug',
        description: '설명',
        permissions: '권한',
        noRolesFound: '역할을 찾을 수 없음',
        noRolesYet: '아직 역할 없음',
        loadingRoles: '역할 목록 로딩 중...',
        loadingPermissions: '권한 목록 로딩 중...',
        operatorAccounts: '운영자 계정',
        operatorAccount: '운영자 계정',
        selectPermissions: '권한 선택',
        // Assign permissions
        assignPermissions: '권한 할당',
        assignPermissionsToRole: '역할에 권한 할당',
        saveChanges: '변경사항 저장',
        saving: '저장 중...',
        selectAll: '전체 선택',
        selectedCount: '선택됨',
        noPermissionsYet: '시스템에 아직 권한이 없음',
        assignSuccess: '권한 할당 성공!',
        assignFailed: '권한 할당 실패. 다시 시도해주세요.',
        loadPermissionsFailed: '권한 목록을 로드할 수 없음',
      },
      permissions: {
        title: '권한 관리',
        addPermission: '권한 추가',
        createPermission: '권한 생성',
        editPermission: '권한 편집',
        deletePermission: '권한 삭제',
        searchPlaceholder: '이름, slug, 리소스로 검색...',
        createSuccess: '권한 생성 성공!',
        createFailed: '권한 생성 실패. 다시 시도해주세요.',
        updateSuccess: '권한 업데이트 성공!',
        updateFailed: '권한 업데이트 실패. 다시 시도해주세요.',
        deleteSuccess: '권한 삭제 성공!',
        deleteFailed: '권한 삭제 실패. 다시 시도해주세요.',
        permission: '권한',
        slug: 'Slug',
        description: '설명',
        resource: '리소스',
        action: '액션',
        content: '콘텐츠',
        detailedContent: '상세 콘텐츠',
        selectAction: '액션 선택...',
        selectResourceAndAction: '리소스와 액션을 선택해주세요',
        enterPermissionName: '권한 이름 입력...',
        enterSlug: '예: users.view, venues.manage...',
        enterResource: '예: users, venues, dashboard...',
        enterDescription: '권한에 대한 설명 입력...',
        enterDetailedContent: '권한에 대한 상세 콘텐츠 입력 (선택사항)...',
        noPermissionsFound: '권한을 찾을 수 없음',
        noPermissionsYet: '아직 권한 없음',
        loadingPermissions: '권한 목록 로딩 중...',
        // Pagination
        showing: '표시',
        of: '/',
        page: '페이지',
        previous: '이전',
        next: '다음',
        // Delete confirmation
        deleteConfirmMessage: '권한을 삭제하시겠습니까',
      },
      wallet: {
        title: '지갑 및 결제',
        addMethod: '결제 방법 추가',
        totalMethods: '총 결제 방법',
        activeMethods: '활성 방법',
        totalDailyLimit: '총 일일 한도',
        dailyLimit: '일일 한도',
        monthlyLimit: '월 한도',
        bank: '은행',
        ewallet: '전자 지갑',
        gateway: '결제 게이트웨이',
        description: '결제 방법 및 지갑 설정 관리',
      },
      promotions: {
        title: '프로모션 및 보너스',
        createPromotion: '프로모션 생성',
        totalPrograms: '총 프로그램',
        ongoing: '진행 중',
        totalParticipants: '총 참가자',
        totalBonusAwarded: '지급된 총 보너스',
        programName: '프로그램 이름',
        bonus: '보너스',
        maxBonus: '최대 보너스',
        participants: '참가자',
        startDate: '시작 날짜',
        endDate: '종료 날짜',
        firstDeposit: '첫 입금',
        deposit: '입금',
        cashback: '캐시백',
        tournament: '토너먼트',
        rebate: '리베이트',
        upcoming: '예정',
        expired: '만료됨',
        to: '까지',
        description: '프로모션 및 보너스 프로그램 관리',
      },
      transactions: {
        title: '거래',
        searchPlaceholder: '거래 검색 (ID, 플레이어)...',
        exportReport: '보고서 내보내기',
        totalTransactionsToday: '오늘 총 거래',
        totalDeposit: '총 입금',
        totalWithdraw: '총 출금',
        pendingProcessing: '처리 대기 중',
        transactionCode: '거래 코드',
        amount: '금액',
        paymentMethod: '결제 방법',
        time: '시간',
        deposit: '입금',
        withdraw: '출금',
        bet: '베팅',
        completed: '완료',
        rejected: '거부됨',
        description: '시스템의 모든 거래 보기 및 관리',
        customer: '고객',
        venue: '장소',
        transactionTypeBooking: '예약',
        transactionTypeService: '서비스',
        transactionTypeDeposit: '입금',
        transactionTypeWithdraw: '출금',
        transactionTypeRefund: '환불',
        paymentMethodCash: '현금',
        paymentMethodTransfer: '이체',
        paymentMethodEwallet: '전자지갑',
        statusPending: '대기 중',
        statusCompleted: '완료',
        statusRejected: '거부됨',
        searchTransactionPlaceholder: '거래 검색 (코드, 고객, 장소)...',
        totalRevenue: '총 수익',
        totalRefund: '총 환불',
      },
      auditLogs: {
        title: '감사 로그',
        searchPlaceholder: '로그 검색 (사용자, 작업, 리소스)...',
        description: '시스템 활동 및 액세스 로그',
        exportLogs: '로그 내보내기',
        time: '시간',
        user: '사용자',
        action: '작업',
        resource: '리소스',
        ipAddress: 'IP 주소',
        login: '로그인',
        logout: '로그아웃',
        updatePlayer: '플레이어 업데이트',
        createPromotion: '프로모션 생성',
        deleteGame: '게임 삭제',
        changeSettings: '설정 변경',
        viewSensitiveData: '민감한 데이터 보기',
      },
      settings: {
        title: '시스템 설정',
        saveSettings: '설정 저장',
        generalSettings: '일반 설정',
        notificationSettings: '알림 설정',
        securitySettings: '보안',
        paymentSettings: '결제 설정',
        systemName: '시스템 이름',
        systemDescription: '설명',
        defaultLanguage: '기본 언어',
        emailNotification: '이메일 알림',
        emailNotificationDesc: '중요한 이벤트 시 이메일 전송',
        pushNotification: '푸시 알림',
        pushNotificationDesc: '관리자에게 푸시 알림 전송',
        smsAlert: 'SMS 알림',
        smsAlertDesc: '중요한 알림 시 SMS 전송',
        security: '보안',
        sessionTimeout: '세션 타임아웃 (분)',
        maxLoginAttempts: '최대 로그인 시도 횟수',
        require2FA: '2FA 요구',
        require2FADesc: '관리자에게 이중 인증 요구',
        minDepositLimit: '최소 입금 한도 (VND)',
        minWithdrawLimit: '최소 출금 한도 (VND)',
        withdrawProcessingTime: '출금 처리 시간 (시간)',
        description: '시스템 설정 및 기본 설정 구성',
      },
      alerts: {
        totalAlerts: '총 알림 수',
        unread: '읽지 않음',
        warning: '경고',
        totalAlertsLabel: '총 알림',
        description: '시스템 알림 및 알림 보기 및 관리',
        alertHighSystemLoad: '시스템 부하 높음',
        alertPaymentGatewayTimeout: '결제 게이트웨이 타임아웃',
        alertBackupCompleted: '백업 완료',
        alertRateLimitNear: '속도 제한 근접',
        alertDeploymentSuccess: '배포 성공',
        alertHighSystemLoadMessage: 'CPU 사용률이 85%에 도달했습니다',
        alertPaymentGatewayTimeoutMessage: '결제 게이트웨이가 타임아웃되었습니다',
        alertBackupCompletedMessage: '시스템 백업이 성공적으로 완료되었습니다',
        alertRateLimitNearMessage: 'API 속도 제한이 임계값에 가까워지고 있습니다',
        alertDeploymentSuccessMessage: '새 버전이 성공적으로 배포되었습니다',
      },
      reports: {
        exportPdf: 'PDF 내보내기',
        exportExcel: 'Excel 내보내기',
        monthlyRevenue: '이번 달 수익',
        profit: '이익',
        revenueByMonth: '월별 수익',
        revenue: '수익',
        winRate: '승률',
        comparedToLastMonth: '↑ % 전월 대비',
        description: '시스템 보고서 및 통계 보기 및 내보내기',
      },
      analytics: {
        registration: '등록',
        firstDeposit: '첫 입금',
        playGame: '게임',
        activeUsers: '활성 사용자',
        revenuePerDay: '일일 수익',
        sessions: '세션',
        conversionRate: '전환율',
        performanceLast5Days: '최근 5일 성과',
        conversionRateChart: '전환율',
        revenueTrend: '수익 추세',
        comparedToYesterday: '↑ % 전일 대비',
        description: '성능 분석 및 지표 보기',
      },
      monitoring: {
        online: '온라인',
        offline: '오프라인',
        warning: '경고',
        systemStatus: '시스템 상태',
        service: '서비스',
        uptime: '가동 시간',
        latency: '지연 시간',
        avgUptime: '평균 가동 시간',
        totalServices: '총 서비스',
        recentEvents: '최근 이벤트',
        description: '시스템 서비스 및 성능 모니터링',
        serviceGameServer: '게임 서버',
        servicePaymentGateway: '결제 게이트웨이',
        serviceDatabase: '데이터베이스',
        serviceApiGateway: 'API 게이트웨이',
        serviceNotificationService: '알림 서비스',
        eventHighLoad: '높은 부하 감지됨',
        eventBackupCompleted: '백업 완료',
        eventTransactionProcessed: '거래 처리됨',
        eventRateLimitWarning: '속도 제한 경고',
        eventNewPlayerJoined: '새 플레이어 가입',
      },
      risk: {
        totalAlerts: '총 위험 알림',
        fraud: '사기',
        unusualPattern: '비정상 패턴',
        accountCompromise: '계정 침해',
        pending: '대기 중',
        investigating: '조사 중',
        resolved: '해결됨',
        critical: '심각',
        high: '높음',
        medium: '보통',
        low: '낮음',
        lockedAccounts: '잠긴 계정',
        type: '유형',
        severity: '심각도',
        time: '시간',
        title: '위험 관리',
        description: '보안 위험 감지 및 처리',
      },
      api: {
        title: 'API 관리',
        createApiKey: '새 API 키 생성',
        description: 'API 키 및 엔드포인트 관리',
        totalApiKeys: '총 API 키',
        activeKeys: '활성 키',
        totalRequestsToday: '오늘 총 요청',
        avgResponseTime: '평균 응답 시간',
        apiKeys: 'API 키',
        apiKey: 'API 키',
        lastUsed: '마지막 사용',
        requests: '요청',
        rateLimit: '속도 제한',
        apiEndpoints: 'API 엔드포인트',
        method: '방법',
        path: '경로',
        callsToday: '오늘 호출',
        avgResponse: '평균 응답',
      },
      players: {
        totalPlayers: '총 플레이어 수',
        activePlayers: '활성 플레이어',
        inactivePlayers: '비활성 플레이어',
        totalBalance: '총 잔액',
        username: '사용자 이름',
        balance: '잔액',
        registrationDate: '등록 날짜',
        description: '시스템의 플레이어 관리 및 추적',
      },
      profile: {
        description: '개인 프로필 정보 보기 및 관리',
        personalInfo: '개인 정보',
        accountSecurity: '계정 보안',
        changePassword: '비밀번호 변경',
        changePasswordDesc: '보안을 강화하기 위해 계정 비밀번호 업데이트',
        twoFactorAuth: '이중 인증',
        twoFactorAuthDesc: '계정에 추가 보안 계층 추가',
        changePhoto: '사진 변경',
      },
      userSettings: {
        description: '개인 설정 및 기본 설정 관리',
        notifications: '알림',
        appearance: '모양',
        privacy: '개인정보 보호',
        emailNotifications: '이메일 알림',
        emailNotificationsDesc: '이메일로 알림 수신',
        pushNotifications: '푸시 알림',
        pushNotificationsDesc: '브라우저에서 푸시 알림 수신',
        smsNotifications: 'SMS 알림',
        smsNotificationsDesc: 'SMS로 알림 수신',
        language: '언어',
        theme: '테마',
        light: '밝은',
        dark: '어두운',
        auto: '자동',
        showEmail: '이메일 표시',
        showEmailDesc: '다른 사용자에게 이메일 주소 표시',
        showPhone: '전화번호 표시',
        showPhoneDesc: '다른 사용자에게 전화번호 표시',
      },
      tables: {
        id: 'ID',
        player: '플레이어',
        type: '유형',
        severity: '심각도',
        description: '설명',
        status: '상태',
        time: '시간',
        actions: '작업',
        service: '서비스',
        uptime: '가동 시간',
        latency: '지연 시간',
        players: '플레이어',
        gameName: '게임 이름',
        revenue: '수익',
        totalWagered: '총 베팅',
        game: '게임',
        wagered: '베팅',
      },
      helpSupport: {
        description: '계정 및 서비스에 대한 도움말 및 지원 받기',
        emailSupport: '이메일 지원',
        emailSupportDesc: '이메일을 보내주시면 24시간 이내에 답변드리겠습니다',
        liveChat: '실시간 채팅',
        liveChatDesc: '지원 팀과 실시간으로 채팅',
        startChat: '채팅 시작',
        phoneSupport: '전화 지원',
        phoneSupportDesc: '즉시 지원을 받으려면 전화주세요',
        faq: '자주 묻는 질문',
        gettingStarted: '시작하기',
        accountManagement: '계정 관리',
        faq1Question: '계정을 만들려면 어떻게 해야 하나요?',
        faq1Answer: '등록 버튼을 클릭하고 필요한 정보를 입력하세요',
        faq2Question: '비밀번호를 재설정하려면 어떻게 해야 하나요?',
        faq2Answer: '로그인 페이지의 "비밀번호 찾기" 링크를 클릭하세요',
        faq3Question: '지원팀에 연락하려면 어떻게 해야 하나요?',
        faq3Answer: '이메일, 실시간 채팅 또는 전화로 문의하실 수 있습니다',
        faq4Question: '2FA를 활성화하려면 어떻게 해야 하나요?',
        faq4Answer: '"내 프로필" > "계정 보안"으로 이동하여 이중 인증 설정 지침을 따르세요',
        resources: '리소스',
        userGuide: '사용자 가이드',
        userGuideDesc: '관리 대시보드 사용에 대한 완전한 가이드',
        apiDocumentation: 'API 문서',
        apiDocumentationDesc: 'API 통합을 위한 기술 문서',
        community: '커뮤니티 포럼',
        communityDesc: '커뮤니티에 가입하여 도움을 받고 아이디어를 공유하세요',
      },
    },
    header: {
      providerPortal: '제공자 포털',
      operatorPortal: '운영자 포털',
      adminPortal: '관리자 포털',
      myProfile: '내 프로필',
      helpSupport: '도움말 및 지원',
    },
    menu: {
      dashboard: '대시보드',
      venuesManagement: '매장 관리',
      gamesManagement: '게임 관리',
      operatorsManagement: '운영자 관리',
      providerAccountsManagement: '제공자 계정 관리',
      rolesPermissionsManagement: '역할 및 권한 관리',
      rolesManagement: '역할 관리',
      permissionsManagement: '권한 관리',
      playersManagement: '플레이어 관리',
      transactions: '거래',
      walletPayment: '지갑 및 결제',
      promotionsBonus: '프로모션 및 보너스',
      reports: '보고서 및 통계',
      analytics: '성능 분석',
      articlesManagement: '기사 관리',
      usersManagement: '사용자 관리',
      commentsManagement: '댓글 관리',
      ratingsManagement: '평점 관리',
      notificationsManagement: '알림 관리',
      feedsManagement: '피드 관리',
      kycManagement: 'KYC 관리',
      monitoring: '모니터링',
      riskManagement: '위험 관리',
      apiManagement: 'API 관리',
      alerts: '경고 및 알림',
      auditLogs: '감사 로그',
      cachingManagement: '캐시 관리',
      systemStatus: '시스템 상태',
      systemSettings: '시스템 설정',
    },
    languages: {
      en: '영어',
      vi: '베트남어',
      zh: '중국어',
      th: '태국어',
      ja: '일본어',
      ko: '한국어',
    },
  },
};

// Export default để dễ import
export default translations;

// Helper function để lấy translation
export const getTranslation = (lang: SupportedLanguage, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

// Helper function để lấy danh sách ngôn ngữ được hỗ trợ
export const getSupportedLanguages = (): Array<{ code: SupportedLanguage; name: string }> => {
  return [
    { code: 'en', name: translations.en.languages.en },
    { code: 'vi', name: translations.en.languages.vi },
  ];
};

// Helper function để lấy tên ngôn ngữ theo ngôn ngữ hiện tại
export const getLanguageName = (langCode: SupportedLanguage, currentLang: SupportedLanguage = 'en'): string => {
  return translations[currentLang]?.languages[langCode] || langCode;
};
