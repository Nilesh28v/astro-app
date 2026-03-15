/**
 * API client for backend communication.
 * Configure EXPO_PUBLIC_API_BASE_URL in .env or app.config.js extra.apiUrl.
 */

import Constants from 'expo-constants';

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ||
  '';

const DEFAULT_TIMEOUT = 10000;

export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeout = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export async function apiGet<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    return { ok: false, error: 'API not configured', status: 0 };
  }
  try {
    const res = await fetchWithTimeout(`${API_BASE}${path}`, {
      ...options,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: data?.message ?? `Request failed (${res.status})`, status: res.status };
    }
    return { ok: true, data: data as T };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: msg, status: 0 };
  }
}

export async function apiPost<T>(path: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    return { ok: false, error: 'API not configured', status: 0 };
  }
  try {
    const res = await fetchWithTimeout(`${API_BASE}${path}`, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: data?.message ?? `Request failed (${res.status})`, status: res.status };
    }
    return { ok: true, data: data as T };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: msg, status: 0 };
  }
}
