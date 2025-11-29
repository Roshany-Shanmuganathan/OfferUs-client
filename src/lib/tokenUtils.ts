/**
 * Token Utility Functions
 * 
 * Note: Tokens are stored in HTTP-only cookies for security.
 * HTTP-only cookies cannot be accessed via JavaScript, which prevents XSS attacks.
 * The browser automatically sends cookies with requests when withCredentials is true.
 * 
 * This utility provides helper functions for token-related operations.
 */

/**
 * Check if user is authenticated
 * Makes an API call to verify the token is valid
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Clear authentication token
 * Calls the logout endpoint which clears the HTTP-only cookie
 * @returns Promise<void>
 */
export async function clearToken(): Promise<void> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Continue even if logout API call fails
    // The cookie will be cleared by the browser on logout
    console.error('Error clearing token:', error);
  }
}

/**
 * Get authentication status from server
 * Returns user data if authenticated, null otherwise
 * @returns Promise<{ user: any } | null>
 */
export async function getAuthStatus(): Promise<{ user: any } | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data || null;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Token Storage Information
 * 
 * IMPORTANT: Tokens are stored in HTTP-only cookies, NOT in localStorage.
 * 
 * Benefits of HTTP-only cookies:
 * - Cannot be accessed via JavaScript (prevents XSS attacks)
 * - Automatically sent with requests (no manual header management)
 * - More secure than localStorage
 * 
 * Token is set by the backend on successful login/registration.
 * Token is cleared by the backend on logout.
 * 
 * Cookie name: 'token'
 * Cookie attributes:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true (HTTPS only in production)
 * - sameSite: 'strict' (CSRF protection)
 * - maxAge: 30 days
 * - path: '/'
 */

