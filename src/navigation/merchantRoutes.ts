export const merchantRoutes = {
  home: '/(merchant)/(tabs)',
  pgs: '/(merchant)/(tabs)/pgs',
  addPg: '/(merchant)/pgs/create',
  pgDetail: '/(merchant)/pgs/[id]',
  editPg: '/(merchant)/pgs/[id]/edit',
  enquiries: '/(merchant)/(tabs)/enquiries',
  enquiryDetail: '/(merchant)/enquiries/[id]',
  visits: '/(merchant)/(tabs)/visits',
  visitDetail: '/(merchant)/visits/[id]',
  more: '/(merchant)/(tabs)/more',
  availability: '/(merchant)/availability',
  residents: '/(merchant)/residents',
  residentDetail: '/(merchant)/residents/[id]',
  money: '/(merchant)/money',
  reviews: '/(merchant)/reviews',
  notifications: '/(merchant)/notifications',
  notificationDetail: '/(merchant)/notifications/[id]',
  profile: '/(merchant)/profile',
  preferences: '/(merchant)/preferences',
  onboarding: '/(merchant-onboarding)',
} as const;

export type MerchantDestination = keyof typeof merchantRoutes;

export const merchantHomeMetricRoutes = {
  residents: merchantRoutes.residents,
} as const;

export const merchantNavigationMatrix = [
  { web: 'Home', mobile: merchantRoutes.home, access: 'Home bottom tab' },
  { web: 'My PGs', mobile: merchantRoutes.pgs, access: 'My PGs bottom tab' },
  { web: 'Add PG', mobile: merchantRoutes.addPg, access: 'Home and My PGs actions' },
  { web: 'PG Detail', mobile: merchantRoutes.pgDetail, access: 'My PGs listing' },
  { web: 'Edit PG', mobile: merchantRoutes.editPg, access: 'PG detail or My PGs action' },
  { web: 'Availability', mobile: merchantRoutes.availability, access: 'More' },
  { web: 'Enquiries', mobile: merchantRoutes.enquiries, access: 'Enquiries bottom tab' },
  { web: 'Enquiry Detail', mobile: merchantRoutes.enquiryDetail, access: 'Enquiries listing' },
  { web: 'Visits', mobile: merchantRoutes.visits, access: 'Visits bottom tab' },
  { web: 'Visit Detail', mobile: merchantRoutes.visitDetail, access: 'Visits listing' },
  { web: 'Residents', mobile: merchantRoutes.residents, access: 'More' },
  { web: 'Resident Detail', mobile: merchantRoutes.residentDetail, access: 'Residents listing' },
  { web: 'Money', mobile: merchantRoutes.money, access: 'More' },
  { web: 'Reviews', mobile: merchantRoutes.reviews, access: 'More' },
  { web: 'Notifications', mobile: merchantRoutes.notifications, access: 'Global bell and More' },
  { web: 'Notification Detail', mobile: merchantRoutes.notificationDetail, access: 'Notifications listing' },
  { web: 'Profile', mobile: merchantRoutes.profile, access: 'More' },
  { web: 'Preferences', mobile: merchantRoutes.preferences, access: 'More' },
  { web: 'Onboarding', mobile: merchantRoutes.onboarding, access: 'More' },
] as const;
