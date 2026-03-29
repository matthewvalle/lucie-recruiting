import { ALLOWED_EMAILS } from './config';

export interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

const AUTH_KEY = 'lucie_auth_user';

export function getStoredUser(): UserProfile | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeUser(user: UserProfile): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isEmailAllowed(email: string): boolean {
  // If no whitelist configured, allow all (dev mode)
  if (ALLOWED_EMAILS.length === 0) return true;
  return ALLOWED_EMAILS.some(
    (allowed) => allowed.toLowerCase() === email.toLowerCase()
  );
}
