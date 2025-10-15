import {
  Summary,
  Buyer,
  SystemInfo,
  DeviceControl,
  TransactionSide,
  AdditionalInfo,
} from './common';
import { ItemType } from './items';
import { PaymentType } from './payments';
import { PrintoutLineType } from './printout';

/**
 * Base document interface
 */
export interface BaseDocument {
  /** Validate the document */
  validate?(): void;
}

/**
 * Receipt document
 */
export interface Receipt extends BaseDocument {
  /** Items to sell (required) */
  items: ItemType[];
  /** Payment methods */
  payments?: PaymentType[];
  /** Transaction summary (required) */
  summary: Summary;
  /** Additional printout lines */
  printoutLines?: PrintoutLineType[];
  /** Buyer information */
  buyer?: Buyer;
  /** System information */
  systemInfo?: SystemInfo;
  /** Device control settings */
  deviceControl?: DeviceControl;
}

/**
 * Invoice information
 */
export interface InvoiceInfo {
  /** Invoice number (required) */
  number: string;
  /** Number of copies to print */
  copyCount?: number;
  /** Date of sale */
  dateOfSell?: string;
  /** Date of payment */
  dateOfPayment?: string;
  /** Payment form */
  paymentForm?: string;
  /** Amount paid */
  paid?: string;
}

/**
 * Invoice options
 */
export interface InvoiceOptions {
  skipDescriptionValueToPay?: boolean;
  skipBlockGrossValueInAccountingTax?: boolean;
  buyerBold?: boolean;
  sellerBold?: boolean;
  buyerNipBold?: boolean;
  sellerNipBold?: boolean;
  printLabelDescriptionSymbolInInvoiceHeader?: boolean;
  printPositionNumberInInvoiceHeader?: boolean;
  printPositionNumberInvoice?: boolean;
  toPayLabelBeforeAcountingTaxBlock?: boolean;
  printCentsInWords?: boolean;
  dontPrintSellDateIfEqualCreateDate?: boolean;
  dontPrintSellerDataInHeader?: boolean;
  dontPrintSellItemsDescription?: boolean;
  enablePaymentForm?: boolean;
  dontPrintCustomerData?: boolean;
  printPaydInCash?: boolean;
  skipSellerLabel?: boolean;
  printInvoiceTaxLabel?: boolean;
}

/**
 * Invoice document
 */
export interface Invoice extends BaseDocument {
  /** Invoice information (required) */
  info: InvoiceInfo;
  /** Buyer information (required) */
  buyer: Buyer;
  /** Recipient information */
  recipient?: TransactionSide;
  /** Seller information */
  seller?: TransactionSide;
  /** Invoice options */
  options?: InvoiceOptions;
  /** Items to sell (required) */
  items: ItemType[];
  /** Payment methods */
  payments?: PaymentType[];
  /** Transaction summary (required) */
  summary: Summary;
  /** Additional printout lines */
  printoutLines?: PrintoutLineType[];
  /** Additional information */
  additionalInfo?: AdditionalInfo[];
  /** Device control settings */
  deviceControl?: DeviceControl;
  /** System information */
  systemInfo?: SystemInfo;
}

/**
 * Printout options
 */
export interface PrintoutOptions {
  /** Print without header */
  withoutHeader?: boolean;
  /** Add left margin */
  leftMargin?: boolean;
  /** Copy only mode */
  copyOnly?: boolean;
  /** Turn off fiscal margins */
  fiscalMarginsOff?: boolean;
}

/**
 * Non-fiscal printout
 */
export interface Printout extends BaseDocument {
  /** Printout options */
  options?: PrintoutOptions;
  /** Lines to print (required) */
  lines: PrintoutLineType[];
  /** Electronic document settings */
  eDocument?: {
    transactionId?: string;
    protocol?: string;
    printSendMode?: string;
  };
  /** System information */
  systemInfo?: SystemInfo;
  /** Device control settings */
  deviceControl?: DeviceControl;
}

/**
 * Document type union
 */
export type Document = Receipt | Invoice | Printout;


