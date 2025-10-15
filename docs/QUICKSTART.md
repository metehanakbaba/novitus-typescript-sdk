# Quick Start Guide

Get started with Novitus SDK in 5 minutes!

## Installation

```bash
npm install @novitus/sdk
```

## Basic Usage

### 1. Import and Initialize

```typescript
import { NovitusClient, Receipt, VATRate } from '@novitus/sdk';

const client = new NovitusClient({
  host: 'http://localhost:8888', // Your Novitus API server
});

// Initialize (obtains token automatically)
await client.initialize();
```

### 2. Send a Simple Receipt

```typescript
const receipt: Receipt = {
  items: [
    {
      article: {
        name: 'Coffee',
        ptu: VATRate.B,    // 8% VAT
        quantity: '2',
        price: '5.00',
        value: '10.00',
      },
    },
  ],
  summary: {
    total: '10.00',
    payIn: '10.00',
  },
};

const response = await client.sendReceipt(receipt, true); // true = auto-confirm
console.log('Receipt ID:', response.request.id);
console.log('Status:', response.request.status);
```

## Common Use Cases

### Receipt with Payment

```typescript
import { PaymentMethod } from '@novitus/sdk';

const receipt: Receipt = {
  items: [
    {
      article: {
        name: 'Product',
        ptu: VATRate.A,
        quantity: '1',
        price: '100.00',
        value: '100.00',
      },
    },
  ],
  payments: [
    {
      card: {
        name: PaymentMethod.Card,
        value: '100.00',
      },
    },
  ],
  summary: {
    total: '100.00',
  },
};

await client.sendReceipt(receipt, true);
```

### Invoice

```typescript
const invoice: Invoice = {
  info: {
    number: 'INV/2025/001',
  },
  buyer: {
    name: 'Company Name',
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

await client.sendInvoice(invoice, true);
```

### Non-Fiscal Printout

```typescript
const printout: Printout = {
  lines: [
    {
      textLine: {
        text: 'Thank you for your purchase!',
        bold: true,
        center: true,
        masked: false,
      },
    },
  ],
};

await client.sendNFPrintout(printout, true);
```

## Error Handling

```typescript
import {
  NovitusValidationError,
  NovitusApiError,
} from '@novitus/sdk';

try {
  await client.sendReceipt(receipt, true);
} catch (error) {
  if (error instanceof NovitusValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof NovitusApiError) {
    console.error('API error:', error.errorDescription);
  }
}
```

## Queue Management

```typescript
// Check queue status
const status = await client.getQueueStatus();
console.log('Items in queue:', status.requestsInQueue);

// Clear queue
await client.deleteQueue();
```

## Document Status

```typescript
// Send document
const sendResponse = await client.sendDocument('receipt', receipt);

// Check status
const status = await client.checkDocumentStatus(
  'receipt',
  sendResponse.request.id
);

// Confirm manually
await client.confirm('receipt', sendResponse.request.id);
```

## VAT Rates Reference

```typescript
VATRate.A // 23%
VATRate.B // 8%
VATRate.C // 5%
VATRate.D // 0%
VATRate.E // Exempt
VATRate.F // Not subject to VAT
VATRate.G // Special
```

## Next Steps

- Read the [full README](./README.md)
- Check out [examples](./examples/)
- Review [API documentation](./API.md)
- See [API reference](https://noviapi.novitus.pl/en/)

## Need Help?

- [Report an issue](https://github.com/your-org/novitus-sdk/issues)
- [Read documentation](./README.md)
- [See examples](./examples/)


