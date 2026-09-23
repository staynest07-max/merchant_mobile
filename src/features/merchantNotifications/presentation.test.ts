import { describe, expect, it } from 'vitest';
import type { MerchantNotificationDto } from '../../contracts/merchantNotification';
import { notificationListParams, relatedNotificationRoute } from './presentation';

const notification = { id: 'n1', type: 'ENQUIRY_CREATED', title: 'New enquiry', body: 'A user enquired', relatedEntity: { type: 'ENQUIRY', id: 'e1' }, isRead: false, readAt: null, createdAt: '2026-01-01' } satisfies MerchantNotificationDto;
describe('native merchant notification presentation', () => {
  it('maps list filters to canonical query parameters', () => { expect(notificationListParams(2, 'all')).toEqual({ page: 2, limit: 20 }); expect(notificationListParams(1, 'unread')).toEqual({ page: 1, limit: 20, unread: true }); expect(notificationListParams(1, 'read')).toEqual({ page: 1, limit: 20, unread: false }); });
  it('routes only supported related entities', () => { expect(relatedNotificationRoute(notification)).toEqual({ pathname: '/(merchant)/enquiries/[id]', params: { id: 'e1' } }); expect(relatedNotificationRoute({ ...notification, relatedEntity: { type: 'VISIT', id: 'v1' } })?.pathname).toContain('/visits/'); expect(relatedNotificationRoute({ ...notification, relatedEntity: null })).toBeNull(); });
});
