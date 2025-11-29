/**
 * Cookie utility functions for parsing and managing browser cookies
 */

export interface CookieInfo {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  maxAge?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Parse all cookies from document.cookie
 */
export function getAllCookies(): CookieInfo[] {
  if (typeof document === 'undefined') {
    return [];
  }

  const cookies: CookieInfo[] = [];
  const cookieString = document.cookie;

  if (!cookieString) {
    return cookies;
  }

  // Split cookies by semicolon
  const cookiePairs = cookieString.split(';');

  for (const pair of cookiePairs) {
    const trimmedPair = pair.trim();
    if (!trimmedPair) continue;

    const [name, ...valueParts] = trimmedPair.split('=');
    const value = valueParts.join('='); // Handle values that contain '='

    if (name) {
      cookies.push({
        name: decodeURIComponent(name),
        value: decodeURIComponent(value || ''),
      });
    }
  }

  return cookies;
}

/**
 * Get a specific cookie by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = getAllCookies();
  const cookie = cookies.find((c) => c.name === name);
  return cookie ? cookie.value : null;
}

/**
 * Set a cookie
 */
export function setCookie(
  name: string,
  value: string,
  options?: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }
): void {
  if (typeof document === 'undefined') {
    return;
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options?.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options?.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options?.path) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += `; path=/`;
  }

  if (options?.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options?.secure) {
    cookieString += `; secure`;
  }

  if (options?.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Set cookie with expiration date in the past
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Clear all cookies
 */
export function clearAllCookies(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const cookies = getAllCookies();
  cookies.forEach((cookie) => {
    deleteCookie(cookie.name, cookie.path || '/');
  });
}

