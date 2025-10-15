# Novitus SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/@novitus/sdk.svg)](https://www.npmjs.com/package/@novitus/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

UnOfficial TypeScript/JavaScript SDK for the Novitus Fiscal Printer API. This SDK provides a clean, type-safe interface for interacting with Novitus fiscal printers.

## Features

- 🔒 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🚀 **Easy to Use** - Simple, intuitive API design
- ✅ **Built-in Validation** - Automatic validation of documents before sending
- 🔄 **Auto Token Management** - Automatic token refresh and expiration handling
- 🛡️ **Error Handling** - Custom error classes for better error management
- 📝 **Well Documented** - Extensive documentation and examples

## Installation

```bash
npm install @novitus/sdk
```

Or with yarn:

```bash
yarn add @novitus/sdk
```

## Quick Start

```typescript
import { NovitusClient, Receipt, VATRate } from '@novitus/sdk';

// Initialize the client
const client = new NovitusClient({
  host: 'http://localhost:8888',
});

// Initialize (obtains token automatically)
await client.initialize();

// Create a receipt
const receipt: Receipt = {
  items: [
    {
      article: {
        name: 'Tasty Pizza',
        ptu: VATRate.B,
        quantity: '2',
        price: '25.00',
        value: '50.00',
      },
    },
  ],
  summary: {
    total: '50.00',
    payIn: '50.00',
  },
};

// Send receipt with auto-confirm
const response = await client.sendReceipt(receipt, true);
console.log('Receipt sent!', response.request.id);
```

## API Documentation

### Client Initialization

```typescript
import { NovitusClient } from '@novitus/sdk';

const client = new NovitusClient({
  host: 'http://localhost:8888',
  token: 'optional-token', // Optional: provide existing token
  timeout: 30000, // Optional: request timeout in ms (default: 30000)
});

// Initialize the client (obtains token if not provided)
await client.initialize();
```

### Token Management

The SDK automatically handles token management, including:
- Automatic token obtaining on initialization
- Token refresh before expiration
- Fallback to new token if refresh fails

```typescript
// Manual token operations (usually not needed)
const tokenResponse = await client.obtainToken();
await client.refreshToken();
```

### Sending Documents

#### Receipt

```typescript
import { Receipt, VATRate } from '@novitus/sdk';

const receipt: Receipt = {
  items: [
    {
      article: {
        name: 'Product Name',
        ptu: VATRate.A, // 23% VAT
        quantity: '1',
        price: '100.00',
        value: '100.00',
      },
    },
  ],
  summary: {
    total: '100.00',
  },
};

// Send with auto-confirm
const response = await client.sendReceipt(receipt, true);
```

#### Invoice

```typescript
import { Invoice, VATRate } from '@novitus/sdk';

const invoice: Invoice = {
  info: {
    number: 'INV/2025/001',
    dateOfSell: '2025-10-13',
  },
  buyer: {
    name: 'ABC Company Ltd.',
    nip: '1234567890',
  },
  items: [
    {
      article: {
        name: 'Service',
        ptu: VATRate.A,
        quantity: '1',
        price: '1000.00',
        value: '1000.00',
      },
    },
  ],
  summary: {
    total: '1000.00',
  },
};

const response = await client.sendInvoice(invoice, true);
```

#### Non-Fiscal Printout

```typescript
import { Printout } from '@novitus/sdk';

const printout: Printout = {
  lines: [
    {
      textLine: {
        text: 'Hello World',
        bold: true,
        center: true,
        masked: false,
      },
    },
  ],
};

const response = await client.sendNFPrintout(printout, true);
```

### Queue Management

```typescript
// Get queue status
const queueStatus = await client.getQueueStatus();
console.log('Requests in queue:', queueStatus.requestsInQueue);

// Delete queue
const deleteResponse = await client.deleteQueue();
console.log('Status:', deleteResponse.status);
```

### Document Operations

```typescript
// Check document status
const status = await client.checkDocumentStatus('receipt', requestId);

// Confirm document
await client.confirm('receipt', requestId);

// Delete document
await client.deleteDocument('receipt', requestId);
```

## VAT Rates

The SDK provides an enum for Polish VAT rates:

```typescript
import { VATRate } from '@novitus/sdk';

VATRate.A // 23%
VATRate.B // 8%
VATRate.C // 5%
VATRate.D // 0%
VATRate.E // Exempt
VATRate.F // Not subject to VAT
VATRate.G // Special
```

## Payment Methods

```typescript
import { PaymentMethod } from '@novitus/sdk';

PaymentMethod.Card
PaymentMethod.Cash
PaymentMethod.Transfer
PaymentMethod.Mobile
// ... and more
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import {
  NovitusValidationError,
  NovitusApiError,
  NovitusNetworkError,
  NovitusAuthError,
} from '@novitus/sdk';

try {
  await client.sendReceipt(receipt, true);
} catch (error) {
  if (error instanceof NovitusValidationError) {
    console.error('Validation failed:', error.field, error.message);
  } else if (error instanceof NovitusApiError) {
    console.error('API error:', error.statusCode, error.errorDescription);
  } else if (error instanceof NovitusNetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof NovitusAuthError) {
    console.error('Auth error:', error.message);
  }
}
```

## Examples

Check out the [examples](./examples) directory for more usage examples:

- [Basic Receipt](./examples/basic-receipt.ts)
- [Advanced Receipt](./examples/advanced-receipt.ts)
- [Invoice](./examples/invoice.ts)
- [Non-Fiscal Printout](./examples/nf-printout.ts)
- [Queue Management](./examples/queue-management.ts)
- [Error Handling](./examples/error-handling.ts)

## Type Definitions

The SDK is fully typed. All types are exported from the main package:

```typescript
import {
  // Documents
  Receipt,
  Invoice,
  Printout,
  
  // Items
  Article,
  Advance,
  Container,
  
  // Payments
  Cash,
  TypicalPayment,
  Currency,
  
  // Common
  Summary,
  Buyer,
  SystemInfo,
  
  // Enums
  VATRate,
  PaymentMethod,
  Unit,
  
  // Responses
  TokenResponse,
  QueueResponse,
  CheckDocumentStatusResponse,
} from '@novitus/sdk';
```

## Validation

The SDK automatically validates documents before sending:

```typescript
// This will throw a NovitusValidationError
const invalidReceipt: Receipt = {
  items: [], // Error: items are required
  summary: {
    total: '0.00',
  },
};

await client.sendReceipt(invalidReceipt); // Throws error
```

## API Reference

For detailed API documentation, visit: [https://noviapi.novitus.pl/en/](https://noviapi.novitus.pl/en/)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: [https://noviapi.novitus.pl/en/](https://noviapi.novitus.pl/en/)


