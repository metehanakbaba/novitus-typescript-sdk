import { Unit, VATRate } from './enums';

/**
 * Code with print format
 */
export interface CodeWithFormat {
  /** How to print the code */
  print_as: 'text' | 'barcode' | 'qrcode';
  /** Code value */
  value: string;
}

/**
 * Article item for sale
 */
export interface Article {
  /** Article name (required) */
  name: string;
  /** VAT rate (required) */
  ptu: VATRate;
  /** Quantity (required) */
  quantity: string;
  /** Unit price (required) */
  price: string;
  /** Total value (required, must equal price * quantity) */
  value: string;
  /** Unit of measurement */
  unit?: Unit | string;
  /** Discount or markup amount */
  discountMarkup?: string;
  /** Barcode or product code (can be string or object with print format) */
  code?: string | CodeWithFormat;
  /** Item description */
  description?: string;
}

/**
 * Advance payment item
 */
export interface Advance {
  /** Description (required) */
  description: string;
  /** VAT rate (required) */
  ptu: VATRate;
  /** Advance value (required) */
  value: string;
}

/**
 * Advance return item
 */
export interface AdvanceReturn {
  /** Description (required) */
  description: string;
  /** VAT rate (required) */
  ptu: VATRate;
  /** Return value (required) */
  value: string;
}

/**
 * Container/packaging item
 */
export interface Container {
  /** Container name */
  name?: string;
  /** Container number */
  number?: string;
  /** Quantity */
  quantity?: string;
  /** Container value (required) */
  value: string;
}

/**
 * Container return item
 */
export interface ContainerReturn {
  /** Container name */
  name?: string;
  /** Container number */
  number?: string;
  /** Quantity */
  quantity?: string;
  /** Return value (required) */
  value: string;
}

/**
 * Union type for all item types
 */
export type ItemType =
  | { article: Article }
  | { advance: Advance }
  | { advanceReturn: AdvanceReturn }
  | { container: Container }
  | { containerReturn: ContainerReturn };

