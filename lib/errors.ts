/**
 * Centralized error handling utilities.
 * Ensures consistent error handling across the app.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly recoverable = true
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network unavailable') {
    super(message, 'NETWORK_ERROR', true);
    this.name = 'NetworkError';
  }
}

export class SubscriptionError extends AppError {
  constructor(message = 'Subscription check failed') {
    super(message, 'SUBSCRIPTION_ERROR', true);
    this.name = 'SubscriptionError';
  }
}

/**
 * Safe async wrapper - catches errors and returns Result type.
 */
export async function tryAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<{ data: T; error: null } | { data: null; error: Error }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (__DEV__) {
      console.warn('[tryAsync]', err);
    }
    return { data: fallback ?? null, error: err };
  }
}
