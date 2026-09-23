import { ApiError } from '../../api/errors';
import type { MerchantNotificationDto } from '../../contracts/merchantNotification';

export type MerchantNotificationFilter = 'all' | 'unread' | 'read';
export const notificationListParams = (page: number, filter: MerchantNotificationFilter) => ({ page, limit: 20, ...(filter === 'all' ? {} : { unread: filter === 'unread' }) });
export const merchantNotificationError = (error: unknown) => error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'Unable to load notifications. Please try again.';
export const relatedNotificationRoute = (notification: MerchantNotificationDto) => notification.relatedEntity ? notification.relatedEntity.type === 'ENQUIRY' ? { pathname: '/(merchant)/enquiries/[id]' as const, params: { id: notification.relatedEntity.id } } : { pathname: '/(merchant)/visits/[id]' as const, params: { id: notification.relatedEntity.id } } : null;
