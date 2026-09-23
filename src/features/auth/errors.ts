import { ApiError } from '../../api/errors';

export function authMessage(error: unknown): string {
  if (error instanceof Error && error.message === 'ROLE_FORBIDDEN') {
    return 'This account is not authorized for StayNest Merchant.';
  }
  if (error instanceof ApiError) {
    const messages: Record<string, string> = {
      INVALID_OTP: 'The OTP is invalid or expired.',
      SESSION_REVOKED: 'Your session has ended. Please sign in again.',
      SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
      ROLE_FORBIDDEN: 'This account is not authorized for StayNest Merchant.',
      VALIDATION_ERROR: 'Please check the information and try again.',
    };
    return messages[error.code] ?? (error.status === 0 ? 'Unable to connect to StayNest.' : error.message);
  }
  return 'Authentication could not be completed.';
}
