/**
 * @sygnl/normalizer
 * 
 * PII normalization and SHA256 hashing for Meta CAPI and ad platforms.
 * 
 * @example
 * ```typescript
 * import { Normalizer } from '@sygnl/normalizer';
 * 
 * const normalizer = new Normalizer();
 * 
 * // Normalize and hash user data
 * const normalized = await normalizer.normalize({
 *   email: 'JOHN@EXAMPLE.COM',
 *   phone: '555-123-4567',
 *   first_name: 'John',
 *   last_name: 'Doe',
 * });
 * 
 * // Or use individual methods
 * const emailHash = await normalizer.hashEmail('john@example.com');
 * const phoneHash = await normalizer.hashPhone('555-123-4567');
 * ```
 */

export { Normalizer } from './Normalizer';
export { sha256, isSha256 } from './hash';
export type {
  Sha256Hash,
  RawUserData,
  NormalizedUserData,
  NormalizerOptions,
} from './types';
