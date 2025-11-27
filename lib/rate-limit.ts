import { NextResponse } from 'next/server';

// Simple in-memory rate limiter
// For production with multiple servers, consider using @upstash/ratelimit with Redis

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  /**
   * Custom message for rate limit exceeded
   */
  message?: string;
}

/**
 * Simple rate limiting middleware
 *
 * @param identifier - Unique identifier for the client (e.g., IP, user ID, API key)
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limit exceeded, null otherwise
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): NextResponse | null {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // No entry or entry expired, create new one
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs
    });
    return null;
  }

  if (entry.count >= config.max) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    return NextResponse.json(
      {
        error: config.message || 'Too many requests',
        retryAfter: retryAfter
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(entry.resetAt / 1000).toString()
        }
      }
    );
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return null;
}

/**
 * Get client identifier from request
 * Tries to get user ID from session, falls back to IP address
 */
export function getClientIdentifier(
  request: Request,
  userId?: string
): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() :
             request.headers.get('x-real-ip') ||
             'unknown';

  return `ip:${ip}`;
}

/**
 * Pre-configured rate limit configs
 */
export const RateLimitPresets = {
  /**
   * Strict limits for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: {
    max: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Too many authentication attempts. Please try again later.'
  },

  /**
   * Standard API limits
   * 100 requests per minute
   */
  API: {
    max: 100,
    windowMs: 60 * 1000,
    message: 'API rate limit exceeded. Please try again later.'
  },

  /**
   * Generous limits for read operations
   * 300 requests per minute
   */
  READ: {
    max: 300,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please slow down.'
  },

  /**
   * Stricter limits for write operations
   * 30 requests per minute
   */
  WRITE: {
    max: 30,
    windowMs: 60 * 1000,
    message: 'Too many updates. Please try again later.'
  },

  /**
   * Very strict limits for expensive operations
   * 10 requests per hour
   */
  EXPENSIVE: {
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Rate limit exceeded for this operation. Please try again later.'
  }
};
