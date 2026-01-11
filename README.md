# @hammr/normalizer

PII normalization and SHA256 hashing for ad platforms (Meta CAPI, Google, TikTok).

## Install

```bash
npm install @hammr/normalizer
```

## Quick Start

```typescript
import { Normalizer } from '@hammr/normalizer';

const normalizer = new Normalizer();

// Normalize and hash user data
const result = await normalizer.normalize({
  email: ' Test@Example.COM ',
  phone: '+1 (555) 123-4567',
  firstName: 'John',
  lastName: 'Doe',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  country: 'US'
});

console.log(result);
// {
//   em: 'b4c9a289323b21a01c3e807f0769a8be...',  // SHA256 hash
//   ph: '15551234567',                           // E.164 format
//   fn: 'john',
//   ln: 'doe',
//   ct: 'sanfrancisco',
//   st: 'ca',
//   zp: '94102',
//   country: 'us'
// }
```

## Features

- Email normalization (trim, lowercase, hash)
- Phone normalization (E.164 format, hash)
- Name normalization (lowercase, no spaces)
- Address normalization (city, state, zip, country)
- SHA256 hashing via Web Crypto API
- Gender and DOB normalization
- Type-safe with TypeScript

## API

### `Normalizer`

```typescript
const normalizer = new Normalizer();

// Normalize full user data
const result = await normalizer.normalize(userData);

// Individual normalizers
normalizer.normalizeEmail('test@example.com');           // 'test@example.com'
normalizer.normalizePhone('+1 555-123-4567');           // '15551234567'
normalizer.normalizeName('John Doe');                   // 'johndoe'
normalizer.normalizeCity('San Francisco');              // 'sanfrancisco'
normalizer.normalizeState('CA');                        // 'ca'
normalizer.normalizeZipCode('94102-1234');              // '94102'
normalizer.normalizeCountry('United States');           // 'us'
normalizer.normalizeGender('Male');                     // 'm'
normalizer.normalizeDateOfBirth('1990-01-15');          // '19900115'
```

### `sha256(input: string): Promise<string>`

```typescript
import { sha256 } from '@hammr/normalizer';

const hash = await sha256('test@example.com');
// 'b4c9a289323b21a01c3e807f0769a8be7e60c8ece9eb35e14e9f3b7e5c1d2e3f'
```

## Use Cases

- CDN Artifact Hashing
- Authentication systems
- Meta Conversions API (CAPI)
- Google Enhanced Conversions
- TikTok Events API
- Snapchat Conversions API
- Any platform requiring hashed PII

## License

Apache-2.0

Copyright 2026 Edge Foundry, Inc.
