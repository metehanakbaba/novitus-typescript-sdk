# API Reference

Complete API reference for Novitus SDK.

## Table of Contents

- [NovitusClient](#novitusclient)
- [Types](#types)
- [Enums](#enums)
- [Errors](#errors)

## NovitusClient

Main client class for interacting with Novitus API.

### Constructor

```typescript
new NovitusClient(config: NovitusClientConfig)
```

**Parameters:**
- `config.host` (string) - Base URL of Novitus API
- `config.token` (string, optional) - Authentication token
- `config.timeout` (number, optional) - Request timeout in ms (default: 30000)

### Methods

#### initialize()

Initialize the client and obtain authentication token if not provided.

```typescript
await client.initialize(): Promise<void>
```

#### obtainToken()

Manually obtain a new authentication token.

```typescript
await client.obtainToken(): Promise<TokenResponse>
```

**Returns:** `TokenResponse` with token and expiration date

#### refreshToken()

Manually refresh the authentication token.

```typescript
await client.refreshToken(): Promise<void>
```

#### getQueueStatus()

Get the current queue status.

```typescript
await client.getQueueStatus(): Promise<QueueResponse>
```

**Returns:** `QueueResponse` with number of requests in queue

#### deleteQueue()

Delete all items from the queue.

```typescript
await client.deleteQueue(): Promise<DeleteQueueResponse>
```

**Returns:** `DeleteQueueResponse` with operation status

#### sendDocument()

Send a document to the fiscal printer.

```typescript
await client.sendDocument(
  documentType: string,
  document: Receipt | Invoice | Printout
): Promise<SendDocumentResponse>
```

**Parameters:**
- `documentType` - Type of document ('receipt', 'invoice', 'nf_printout')
- `document` - Document to send

**Returns:** `SendDocumentResponse` with request information

#### checkDocumentStatus()

Check the status of a previously sent document.

```typescript
await client.checkDocumentStatus(
  objectType: string,
  requestId: string
): Promise<CheckDocumentStatusResponse>
```

**Parameters:**
- `objectType` - Type of document
- `requestId` - Request ID

**Returns:** `CheckDocumentStatusResponse` with device and request status

#### deleteDocument()

Delete a document from the queue.

```typescript
await client.deleteDocument(
  objectType: string,
  requestId: string
): Promise<DeleteDocumentResponse>
```

**Parameters:**
- `objectType` - Type of document
- `requestId` - Request ID

**Returns:** `DeleteDocumentResponse` with operation status

#### confirm()

Confirm a document request.

```typescript
await client.confirm(
  objectType: string,
  requestId: string
): Promise<SendDocumentResponse>
```

**Parameters:**
- `objectType` - Type of document
- `requestId` - Request ID

**Returns:** `SendDocumentResponse` with updated request status

#### sendReceipt()

Send a receipt with optional auto-confirm.

```typescript
await client.sendReceipt(
  receipt: Receipt,
  confirm?: boolean
): Promise<CheckDocumentStatusResponse>
```

**Parameters:**
- `receipt` - Receipt document
- `confirm` - Auto-confirm the receipt (default: false)

**Returns:** `CheckDocumentStatusResponse` with final status

#### sendInvoice()

Send an invoice with optional auto-confirm.

```typescript
await client.sendInvoice(
  invoice: Invoice,
  confirm?: boolean
): Promise<CheckDocumentStatusResponse>
```

**Parameters:**
- `invoice` - Invoice document
- `confirm` - Auto-confirm the invoice (default: false)

**Returns:** `CheckDocumentStatusResponse` with final status

#### sendNFPrintout()

Send a non-fiscal printout with optional auto-confirm.

```typescript
await client.sendNFPrintout(
  printout: Printout,
  confirm?: boolean
): Promise<CheckDocumentStatusResponse>
```

**Parameters:**
- `printout` - Printout document
- `confirm` - Auto-confirm the printout (default: false)

**Returns:** `CheckDocumentStatusResponse` with final status

## Types

### Receipt

```typescript
interface Receipt {
  items: ItemType[];
  payments?: PaymentType[];
  summary: Summary;
  printoutLines?: PrintoutLineType[];
  buyer?: Buyer;
  systemInfo?: SystemInfo;
  deviceControl?: DeviceControl;
}
```

### Invoice

```typescript
interface Invoice {
  info: InvoiceInfo;
  buyer: Buyer;
  recipient?: TransactionSide;
  seller?: TransactionSide;
  options?: InvoiceOptions;
  items: ItemType[];
  payments?: PaymentType[];
  summary: Summary;
  printoutLines?: PrintoutLineType[];
  additionalInfo?: AdditionalInfo[];
  deviceControl?: DeviceControl;
  systemInfo?: SystemInfo;
}
```

### Printout

```typescript
interface Printout {
  options?: PrintoutOptions;
  lines: PrintoutLineType[];
  eDocument?: EDocument;
  systemInfo?: SystemInfo;
  deviceControl?: DeviceControl;
}
```

### Article

```typescript
interface Article {
  name: string;
  ptu: VATRate;
  quantity: string;
  price: string;
  value: string;
  unit?: Unit | string;
  discountMarkup?: string;
  code?: string;
  description?: string;
}
```

### Summary

```typescript
interface Summary {
  discountMarkup?: string;
  total: string;
  payIn?: string;
  change?: string;
}
```

## Enums

### VATRate

Polish VAT rate categories:

```typescript
enum VATRate {
  A = 'A', // 23%
  B = 'B', // 8%
  C = 'C', // 5%
  D = 'D', // 0%
  E = 'E', // Exempt
  F = 'F', // Not subject to VAT
  G = 'G', // Special
}
```

### PaymentMethod

```typescript
enum PaymentMethod {
  Card = 'card',
  Cheque = 'cheque',
  Coupon = 'coupon',
  Other = 'other',
  Credit = 'credit',
  Account = 'account',
  Transfer = 'transfer',
  Mobile = 'mobile',
  Voucher = 'voucher',
}
```

### Unit

```typescript
enum Unit {
  Piece = 'szt',
  Kilogram = 'kg',
  Liter = 'l',
  Meter = 'm',
  SquareMeter = 'm2',
  CubicMeter = 'm3',
}
```

### Justification

```typescript
enum Justification {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}
```

## Errors

### NovitusError

Base error class for all SDK errors.

```typescript
class NovitusError extends Error {
  constructor(message: string)
}
```

### NovitusApiError

Error thrown when API request fails.

```typescript
class NovitusApiError extends NovitusError {
  statusCode?: number;
  errorCode?: number;
  errorDescription?: string;
}
```

### NovitusValidationError

Error thrown when document validation fails.

```typescript
class NovitusValidationError extends NovitusError {
  field?: string;
}
```

### NovitusAuthError

Error thrown when authentication fails.

```typescript
class NovitusAuthError extends NovitusError
```

### NovitusNetworkError

Error thrown when network request fails.

```typescript
class NovitusNetworkError extends NovitusError {
  cause?: Error;
}
```

## Responses

All response types are fully typed. See the [types directory](./src/types/responses.ts) for complete definitions.

## Validation

The SDK automatically validates documents before sending. Validation includes:

- Required field checks
- Value calculations (e.g., article value = price × quantity)
- Enum value validation
- Type validation

For manual validation:

```typescript
import { DocumentValidator } from '@novitus/sdk';

DocumentValidator.validateReceipt(receipt);
DocumentValidator.validateInvoice(invoice);
DocumentValidator.validatePrintout(printout);
```


