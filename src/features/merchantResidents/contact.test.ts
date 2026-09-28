import { describe, expect, it, vi } from 'vitest';
import { openResidentDialer, openResidentWhatsApp, residentContactUrls, type ResidentUrlOpener } from './contact';

const opener = (available = true): ResidentUrlOpener => ({
  canOpenURL: vi.fn().mockResolvedValue(available),
  openURL: vi.fn().mockResolvedValue(undefined),
});

describe('resident native contact actions', () => {
  it('builds dialer and WhatsApp URLs from the backend resident phone', () => {
    expect(residentContactUrls('+91 90000 00000')).toEqual({
      dialer: 'tel:+919000000000',
      whatsapp: 'whatsapp://send?phone=919000000000',
    });
  });

  it('opens the dialer without placing a call', async () => {
    const links = opener();
    await expect(openResidentDialer('9000000000', links)).resolves.toEqual({ ok: true });
    expect(links.canOpenURL).toHaveBeenCalledWith('tel:+919000000000');
    expect(links.openURL).toHaveBeenCalledWith('tel:+919000000000');
  });

  it('opens WhatsApp without claiming a message was sent', async () => {
    const links = opener();
    await expect(openResidentWhatsApp('9000000000', links)).resolves.toEqual({ ok: true });
    expect(links.openURL).toHaveBeenCalledWith('whatsapp://send?phone=919000000000');
  });

  it('does not introduce ownership or account identifiers', () => {
    const serialized = JSON.stringify(residentContactUrls('9000000000'));
    expect(serialized).not.toMatch(/merchantId|accountId|userId/);
  });

  it.each([undefined, null, '', 'not-a-phone', '123'])('handles a missing or invalid phone safely', async (phone) => {
    const links = opener();
    await expect(openResidentDialer(phone, links)).resolves.toEqual({ ok: false, message: 'A valid resident phone number is unavailable.' });
    expect(links.openURL).not.toHaveBeenCalled();
  });

  it('returns a clear fallback when WhatsApp is unavailable', async () => {
    const links = opener(false);
    await expect(openResidentWhatsApp('9000000000', links)).resolves.toEqual({ ok: false, message: 'WhatsApp is unavailable on this device.' });
    expect(links.openURL).not.toHaveBeenCalled();
  });

  it('handles external linking failures without throwing', async () => {
    const links: ResidentUrlOpener = {
      canOpenURL: vi.fn().mockResolvedValue(true),
      openURL: vi.fn().mockRejectedValue(new Error('link failed')),
    };
    await expect(openResidentDialer('9000000000', links)).resolves.toEqual({ ok: false, message: 'The phone dialer is unavailable on this device.' });
  });
});
