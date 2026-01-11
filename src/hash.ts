/**
 * SHA256 Hashing Utilities
 * 
 * Uses Web Crypto API (available in modern browsers and Node.js 18+)
 * Works in both browser and Cloudflare Workers environments.
 * 
 * All PII MUST be normalized before hashing to ensure consistent results.
 */

import type { Sha256Hash } from './types';

/**
 * SHA256 hash a string using Web Crypto API
 * 
 * Returns 64 lowercase hex characters.
 * Works in both browser and Node.js 18+ (Web Crypto API).
 * 
 * @param input - String to hash (should be normalized first)
 * @returns Promise resolving to 64-character lowercase hex string
 * 
 * @example
 * ```typescript
 * const hash = await sha256('hello@example.com');
 * // Returns: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
 * ```
 */
export async function sha256(input: string): Promise<Sha256Hash> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex as Sha256Hash;
}

/**
 * Validate that a string is a valid SHA256 hash
 * 
 * Checks for 64 lowercase hexadecimal characters.
 * 
 * @param value - String to validate
 * @returns true if valid SHA256 hash format
 * 
 * @example
 * ```typescript
 * isSha256('abc123');  // false
 * isSha256('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');  // true
 * ```
 */
export function isSha256(value: string): value is Sha256Hash {
  return /^[a-f0-9]{64}$/.test(value);
}
