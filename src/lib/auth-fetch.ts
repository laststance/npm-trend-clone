"use client";

/**
 * Auth-aware fetch wrapper that handles session expiration.
 *
 * When a 401 response is received, redirects to the login page
 * with the current URL as the return URL.
 *
 * @param input - Fetch input (URL or Request)
 * @param init - Fetch init options
 * @returns Promise<Response>
 *
 * @example
 * ```ts
 * const response = await authFetch("/api/presets");
 * if (!response.ok) throw new Error("Failed to fetch");
 * const data = await response.json();
 * ```
 */
export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  // Handle 401 Unauthorized - session expired or invalid
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
    // Return the response anyway for SSR/edge cases
    return response;
  }

  return response;
}

/**
 * JSON fetch helper with auth handling.
 *
 * @param url - API endpoint URL
 * @param options - Fetch options (method, body, etc.)
 * @returns Promise<T> - Parsed JSON response
 * @throws Error if response is not ok (except 401 which redirects)
 *
 * @example
 * ```ts
 * const presets = await authFetchJson<Preset[]>("/api/presets");
 * ```
 */
export async function authFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await authFetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
