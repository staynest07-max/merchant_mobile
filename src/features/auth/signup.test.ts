// @ts-expect-error Vitest executes this file in Node.
import { readdirSync, readFileSync, statSync } from 'node:fs';
// @ts-expect-error Vitest executes this file in Node.
import { extname, join } from 'node:path';
// @ts-expect-error Vitest executes this file in Node.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { merchantSignupFormSchema, merchantSignupPayload } from './validation';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const skipped = new Set(['node_modules', '.expo', 'dist', 'coverage', 'android', 'ios', '.git']);
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry: string) => {
    if (skipped.has(entry)) return [];
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return sourceExtensions.has(extname(path)) ? [path] : [];
  });
}

describe('merchant signup', () => {
  it('builds a signup payload without a client role or identity', () => {
    const payload = merchantSignupPayload('9876543210', '654321', { fullName: ' New Owner ', businessName: ' New Stay ', email: '' });
    expect(payload).toEqual({ phone: '9876543210', otp: '654321', fullName: 'New Owner', businessName: 'New Stay' });
    expect(payload).not.toHaveProperty('role');
    expect(payload).not.toHaveProperty('accountId');
    expect(payload).not.toHaveProperty('merchantId');
    expect(merchantSignupFormSchema.safeParse({ fullName: 'A', businessName: 'Stay', email: '' }).success).toBe(false);
  });

  it('does not hardcode a development OTP in the merchant app', () => {
    const bypassOtp = `${160}${999}`;
    const hits = sourceFiles(root).flatMap((path) => readFileSync(path, 'utf8').includes(bypassOtp) ? [path] : []);
    expect(hits).toEqual([]);
  });
});
