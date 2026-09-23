import { describe, expect, it } from 'vitest';
import { merchantNavigationMatrix, merchantRoutes } from './merchantRoutes';

describe('Merchant navigation inventory', () => {
  it('keeps every approved Merchant destination reachable', () => {
    expect(merchantNavigationMatrix.map((item) => item.web)).toEqual([
      'Home', 'My PGs', 'Add PG', 'PG Detail', 'Edit PG', 'Availability',
      'Enquiries', 'Enquiry Detail', 'Visits', 'Visit Detail', 'Residents',
      'Money', 'Reviews', 'Notifications', 'Notification Detail', 'Profile', 'Preferences', 'Onboarding',
    ]);
    expect(merchantNavigationMatrix.every((item) => item.mobile.startsWith('/(merchant'))).toBe(true);
    expect(merchantNavigationMatrix.every((item) => item.access.length > 0)).toBe(true);
  });

  it('uses real Expo Router destinations for core navigation', () => {
    expect(merchantRoutes.home).toBe('/(merchant)/(tabs)');
    expect(merchantRoutes.addPg).toBe('/(merchant)/pgs/create');
    expect(merchantRoutes.notifications).toBe('/(merchant)/notifications');
    expect(merchantRoutes.preferences).toBe('/(merchant)/preferences');
    expect(merchantRoutes.onboarding).toBe('/(merchant-onboarding)');
  });
});
