/**
 * Security utilities for Paris Paint Studio
 * Protects against XSS, CSRF, and input injection
 */

// ── Input Sanitization ──
// Strips HTML tags and limits length
export function sanitizeText(input, maxLength = 1000) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<[^>]*>/g, '')          // Strip HTML tags
        .replace(/&/g, '&amp;')           // Encode ampersands
        .replace(/</g, '&lt;')            // Encode <
        .replace(/>/g, '&gt;')            // Encode >
        .replace(/"/g, '&quot;')          // Encode quotes
        .replace(/'/g, '&#x27;')          // Encode single quotes
        .trim()
        .slice(0, maxLength);
}

// ── Email Validation ──
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(email) {
    return typeof email === 'string' && email.length <= 254 && EMAIL_REGEX.test(email);
}

// ── CSRF: Origin Verification ──
// Verifies the request origin matches allowed origins
export function verifyOrigin(request) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    // Get allowed host from the request
    const host = request.headers.get('host');

    if (origin) {
        try {
            const originUrl = new URL(origin);
            return originUrl.host === host;
        } catch {
            return false;
        }
    }

    if (referer) {
        try {
            const refererUrl = new URL(referer);
            return refererUrl.host === host;
        } catch {
            return false;
        }
    }

    // No origin or referer — reject (could be a direct API call / bot)
    return false;
}

// ── Rate Limiting (in-memory, per-IP) ──
const rateLimitMap = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // 1 min

// Periodically clean old entries
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, data] of rateLimitMap) {
            if (now - data.lastReset > 60000) {
                rateLimitMap.delete(key);
            }
        }
    }, CLEANUP_INTERVAL);
}

/**
 * Simple rate limiter
 * @param {string} identifier - IP or user ID
 * @param {number} maxRequests - Max requests per window
 * @param {number} windowMs - Time window in ms (default: 60s)
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function rateLimit(identifier, maxRequests = 5, windowMs = 60000) {
    const now = Date.now();
    const data = rateLimitMap.get(identifier);

    if (!data || now - data.lastReset > windowMs) {
        rateLimitMap.set(identifier, { count: 1, lastReset: now });
        return { allowed: true, remaining: maxRequests - 1 };
    }

    data.count++;

    if (data.count > maxRequests) {
        return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: maxRequests - data.count };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request) {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}
