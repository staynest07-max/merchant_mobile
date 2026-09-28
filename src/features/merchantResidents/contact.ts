export interface ResidentUrlOpener {
  canOpenURL(url: string): Promise<boolean>;
  openURL(url: string): Promise<unknown>;
}

export interface ResidentContactResult {
  ok: boolean;
  message?: string;
}

const normalizeResidentPhone = (phone: string | null | undefined) => {
  const digits = phone?.trim().replace(/\D/g, '') ?? '';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
};

export const residentContactUrls = (phone: string | null | undefined) => {
  const normalized = normalizeResidentPhone(phone);
  if (!normalized) return null;
  return {
    dialer: `tel:+${normalized}`,
    whatsapp: `whatsapp://send?phone=${normalized}`,
  } as const;
};

const openContactUrl = async (url: string, unavailableMessage: string, opener: ResidentUrlOpener): Promise<ResidentContactResult> => {
  try {
    if (!(await opener.canOpenURL(url))) return { ok: false, message: unavailableMessage };
    await opener.openURL(url);
    return { ok: true };
  } catch {
    return { ok: false, message: unavailableMessage };
  }
};

export const openResidentDialer = async (phone: string | null | undefined, opener: ResidentUrlOpener): Promise<ResidentContactResult> => {
  const urls = residentContactUrls(phone);
  if (!urls) return { ok: false, message: 'A valid resident phone number is unavailable.' };
  return openContactUrl(urls.dialer, 'The phone dialer is unavailable on this device.', opener);
};

export const openResidentWhatsApp = async (phone: string | null | undefined, opener: ResidentUrlOpener): Promise<ResidentContactResult> => {
  const urls = residentContactUrls(phone);
  if (!urls) return { ok: false, message: 'A valid resident phone number is unavailable.' };
  return openContactUrl(urls.whatsapp, 'WhatsApp is unavailable on this device.', opener);
};
