// In-memory sliding window rate limiter for security critical endpoints (Login / Auth)

interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
  firstAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes window
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Checks whether an identifier (e.g., mobile number) is rate-limited.
 * Returns { allowed: true } or { allowed: false, retryAfterSeconds: number }.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true };
  }

  // Check if currently blocked
  if (record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // If window has passed, reset record
  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Records a failed login attempt for an identifier.
 * Triggers a 15-minute block after 5 failed attempts.
 */
export function recordFailedLogin(identifier: string): {
  isBlocked: boolean;
  remainingAttempts: number;
} {
  const now = Date.now();
  let record = loginAttempts.get(identifier);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    record = {
      attempts: 1,
      blockedUntil: 0,
      firstAttemptAt: now,
    };
    loginAttempts.set(identifier, record);
    return {
      isBlocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS - 1,
    };
  }

  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      isBlocked: true,
      remainingAttempts: 0,
    };
  }

  return {
    isBlocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.attempts,
  };
}

/**
 * Clears failed attempts upon successful authentication.
 */
export function resetLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}
