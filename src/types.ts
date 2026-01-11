/**
 * Type definitions for PII normalization and hashing
 */

/**
 * SHA256 hash: 64 lowercase hex characters
 */
export type Sha256Hash = string & { __brand: 'Sha256Hash' };

/**
 * Raw user data (before normalization/hashing)
 * 
 * Fields to HASH (according to Meta CAPI requirements):
 * - email, phone, first_name, last_name, gender, date_of_birth
 * - city, state, zip_code, country, external_id
 * 
 * Fields to NOT hash (pass through as-is):
 * - ip_address, user_agent, fbc, fbp, subscription_id, lead_id, anonymous_id
 */
export interface RawUserData {
  // Contact info (WILL be hashed)
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  external_id?: string;

  // Address fields (normalized but NOT hashed by default)
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;

  // Tracking IDs (NEVER hashed)
  ip_address?: string;
  user_agent?: string;
  subscription_id?: string;
  lead_id?: string;
  anonymous_id?: string;

  // Platform-specific tracking IDs and custom fields
  traits?: Record<string, unknown>;
}

/**
 * Normalized user data (after hashing)
 * 
 * All PII fields are hashed with SHA256.
 * Tracking IDs and non-PII fields pass through unchanged.
 */
export interface NormalizedUserData {
  // Contact info (hashed)
  email?: Sha256Hash;
  phone?: Sha256Hash;
  first_name?: Sha256Hash;
  last_name?: Sha256Hash;
  gender?: Sha256Hash;
  date_of_birth?: Sha256Hash;
  external_id?: Sha256Hash;

  // Address fields (normalized, not hashed - platforms handle this differently)
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;

  // Tracking IDs (never hashed)
  ip_address?: string;
  user_agent?: string;
  subscription_id?: string;
  lead_id?: string;
  anonymous_id?: string;

  // Platform-specific tracking IDs and custom fields
  traits?: Record<string, unknown>;
}

/**
 * Options for the Normalizer
 */
export interface NormalizerOptions {
  /**
   * Default country code for phone normalization (e.g., '1' for USA)
   * @default '1'
   */
  defaultCountryCode?: string;

  /**
   * Whether to hash address fields (city, state, zip, country)
   * Some platforms require raw values, others require hashed
   * @default false
   */
  hashAddressFields?: boolean;
}
