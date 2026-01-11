/**
 * Normalizer Class
 * 
 * Normalizes and hashes PII fields for ad platform APIs (Meta CAPI, Google Ads, etc.)
 * 
 * Normalization rules ensure consistent hashing:
 * - Email: lowercase, trim
 * - Phone: E.164 format (+15551234567)
 * - Name: lowercase, trim, single spaces
 * - Gender: single char (m/f)
 * - Date of Birth: YYYYMMDD format
 * - Address: lowercase, trim, format-specific rules
 * 
 * Meta CAPI Hashing Requirements:
 * - HASH: email, phone, first_name, last_name, gender, date_of_birth, city, state, zip_code, country, external_id
 * - DO NOT HASH: ip_address, user_agent, fbc, fbp, subscription_id, lead_id
 */

import type { NormalizerOptions, RawUserData, NormalizedUserData, Sha256Hash } from './types';
import { sha256 } from './hash';

export class Normalizer {
  private options: Required<NormalizerOptions>;

  constructor(options: NormalizerOptions = {}) {
    this.options = {
      defaultCountryCode: options.defaultCountryCode ?? '1',
      hashAddressFields: options.hashAddressFields ?? false,
    };
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * NORMALIZATION METHODS
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /**
   * Normalize email: lowercase, trim whitespace
   * Returns null if invalid format
   */
  normalizeEmail(email: string): string | null {
    if (!email || typeof email !== 'string') return null;
    const normalized = email.toLowerCase().trim();
    if (!normalized.includes('@') || normalized.length < 5) return null;
    return normalized;
  }

  /**
   * Normalize phone to E.164 format (+15551234567)
   * Returns null if invalid
   */
  normalizePhone(phone: string, countryCode?: string): string | null {
    if (!phone || typeof phone !== 'string') return null;
    const code = countryCode ?? this.options.defaultCountryCode;
    let digits = phone.replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) digits = digits.slice(1);
    if (digits.length < 10) return null;
    if (digits.length === 10) digits = code + digits;
    return '+' + digits;
  }

  /**
   * Normalize name: lowercase, trim, remove extra spaces
   * Returns null if empty
   */
  normalizeName(name: string): string | null {
    if (!name || typeof name !== 'string') return null;
    const normalized = name.toLowerCase().trim().replace(/\s+/g, ' ');
    if (normalized.length === 0) return null;
    return normalized;
  }

  /**
   * Normalize gender: single lowercase char (m/f)
   * Accepts: m, male, f, female
   * Returns null if invalid
   */
  normalizeGender(gender: string): string | null {
    if (!gender || typeof gender !== 'string') return null;
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'male') return 'm';
    if (g === 'f' || g === 'female') return 'f';
    return null;
  }

  /**
   * Normalize date of birth: YYYYMMDD format
   * Accepts formats: YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD, YYYYMMDD
   * Returns null if invalid
   */
  normalizeDateOfBirth(dob: string): string | null {
    if (!dob || typeof dob !== 'string') return null;
    const cleaned = dob.replace(/[-\/\.]/g, '');
    if (!/^\d{8}$/.test(cleaned)) return null;
    return cleaned;
  }

  /**
   * Normalize city: lowercase, trim
   */
  normalizeCity(city: string): string | null {
    if (!city || typeof city !== 'string') return null;
    const normalized = city.toLowerCase().trim();
    if (normalized.length === 0) return null;
    return normalized;
  }

  /**
   * Normalize state/region: lowercase, trim
   */
  normalizeState(state: string): string | null {
    if (!state || typeof state !== 'string') return null;
    const normalized = state.toLowerCase().trim();
    if (normalized.length === 0) return null;
    return normalized;
  }

  /**
   * Normalize zip/postal code: lowercase, no spaces
   */
  normalizeZipCode(zip: string): string | null {
    if (!zip || typeof zip !== 'string') return null;
    const normalized = zip.toLowerCase().trim().replace(/\s+/g, '');
    if (normalized.length === 0) return null;
    return normalized;
  }

  /**
   * Normalize country: 2-letter code, lowercase
   * Returns null if not exactly 2 characters
   */
  normalizeCountry(country: string): string | null {
    if (!country || typeof country !== 'string') return null;
    const normalized = country.toLowerCase().trim();
    if (normalized.length !== 2) return null;
    return normalized;
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * HASH METHODS
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /**
   * Hash email (normalize then hash)
   */
  async hashEmail(email: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeEmail(email);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash phone (normalize then hash)
   */
  async hashPhone(phone: string, countryCode?: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizePhone(phone, countryCode);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash name (normalize then hash)
   */
  async hashName(name: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeName(name);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash gender (normalize then hash)
   */
  async hashGender(gender: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeGender(gender);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash date of birth (normalize then hash)
   */
  async hashDateOfBirth(dob: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeDateOfBirth(dob);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash city (normalize then hash)
   */
  async hashCity(city: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeCity(city);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash state (normalize then hash)
   */
  async hashState(state: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeState(state);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash zip code (normalize then hash)
   */
  async hashZipCode(zip: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeZipCode(zip);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash country (normalize then hash)
   */
  async hashCountry(country: string): Promise<Sha256Hash | null> {
    const normalized = this.normalizeCountry(country);
    return normalized ? sha256(normalized) : null;
  }

  /**
   * Hash external ID (trim only, no other normalization)
   */
  async hashExternalId(externalId: string): Promise<Sha256Hash | null> {
    if (!externalId || typeof externalId !== 'string') return null;
    return sha256(externalId.trim());
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * BATCH NORMALIZATION
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /**
   * Normalize and hash all user data
   * 
   * Raw PII in, hashed data out.
   * 
   * @param raw - Raw user data (unhashed PII)
   * @returns Normalized and hashed user data
   * 
   * @example
   * ```typescript
   * const normalizer = new Normalizer();
   * const normalized = await normalizer.normalize({
   *   email: 'JOHN@EXAMPLE.COM',
   *   phone: '555-123-4567',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   city: 'San Francisco',
   *   state: 'CA',
   *   country: 'US',
   * });
   * 
   * // Result:
   * // {
   * //   email: '5e884898...', (hashed)
   * //   phone: 'a1b2c3d4...', (hashed)
   * //   first_name: 'e5f6g7h8...', (hashed)
   * //   last_name: 'i9j0k1l2...', (hashed)
   * //   city: 'san francisco', (normalized, not hashed by default)
   * //   state: 'ca', (normalized, not hashed by default)
   * //   country: 'us', (normalized, not hashed by default)
   * // }
   * ```
   */
  async normalize(raw: RawUserData): Promise<NormalizedUserData> {
    const result: NormalizedUserData = {};

    // Hash contact PII
    if (raw.email) {
      const h = await this.hashEmail(raw.email);
      if (h) result.email = h;
    }
    if (raw.phone) {
      const h = await this.hashPhone(raw.phone);
      if (h) result.phone = h;
    }
    if (raw.first_name) {
      const h = await this.hashName(raw.first_name);
      if (h) result.first_name = h;
    }
    if (raw.last_name) {
      const h = await this.hashName(raw.last_name);
      if (h) result.last_name = h;
    }
    if (raw.gender) {
      const h = await this.hashGender(raw.gender);
      if (h) result.gender = h;
    }
    if (raw.date_of_birth) {
      const h = await this.hashDateOfBirth(raw.date_of_birth);
      if (h) result.date_of_birth = h;
    }
    if (raw.external_id) {
      const h = await this.hashExternalId(raw.external_id);
      if (h) result.external_id = h;
    }

    // Address fields - hash only if configured to do so
    if (raw.city) {
      if (this.options.hashAddressFields) {
        const h = await this.hashCity(raw.city);
        if (h) result.city = h as unknown as string;
      } else {
        result.city = raw.city;
      }
    }
    if (raw.state) {
      if (this.options.hashAddressFields) {
        const h = await this.hashState(raw.state);
        if (h) result.state = h as unknown as string;
      } else {
        result.state = raw.state;
      }
    }
    if (raw.zip_code) {
      if (this.options.hashAddressFields) {
        const h = await this.hashZipCode(raw.zip_code);
        if (h) result.zip_code = h as unknown as string;
      } else {
        result.zip_code = raw.zip_code;
      }
    }
    if (raw.country) {
      if (this.options.hashAddressFields) {
        const h = await this.hashCountry(raw.country);
        if (h) result.country = h as unknown as string;
      } else {
        result.country = raw.country;
      }
    }

    // Pass through unhashed fields
    if (raw.ip_address) result.ip_address = raw.ip_address;
    if (raw.user_agent) result.user_agent = raw.user_agent;
    if (raw.subscription_id) result.subscription_id = raw.subscription_id;
    if (raw.lead_id) result.lead_id = raw.lead_id;
    if (raw.anonymous_id) result.anonymous_id = raw.anonymous_id;
    if (raw.traits) result.traits = raw.traits;

    return result;
  }
}
