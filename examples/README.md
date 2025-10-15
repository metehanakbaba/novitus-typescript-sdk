# Examples

This directory contains examples demonstrating how to use the Novitus SDK.

## Running Examples

1. Install dependencies:
```bash
npm install
```

2. Build the SDK:
```bash
npm run build
```

3. Run an example (with ts-node):
```bash
npx ts-node examples/basic-receipt.ts
```

Or compile and run:
```bash
npm run build
node dist/examples/basic-receipt.js
```

## Available Examples

### Basic Receipt
`basic-receipt.ts` - Simple receipt with items and payment

### Advanced Receipt
`advanced-receipt.ts` - Receipt with multiple payment methods, buyer info, and custom printout lines

### Invoice
`invoice.ts` - Full invoice example with buyer details

### Non-Fiscal Printout
`nf-printout.ts` - Non-fiscal printout with formatted text lines

### Queue Management
`queue-management.ts` - Managing the document queue

### Error Handling
`error-handling.ts` - Comprehensive error handling examples

## Configuration

Before running the examples, make sure:
1. Your Novitus API server is running (default: http://localhost:8888)
2. Update the `host` in examples if your server is on a different address

## Note

These examples use relative imports (`../src`) for development purposes. When using the published package, import from `@novitus/sdk` instead:

```typescript
import { NovitusClient, Receipt, VATRate } from '@novitus/sdk';
```



