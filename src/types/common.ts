import { Justification, PaperCut, PrintInfo } from './enums';

/**
 * Summary section for receipts and invoices
 */
export interface Summary {
  /** Discount or markup value */
  discountMarkup?: string;
  /** Total amount */
  total: string;
  /** Amount paid */
  payIn?: string;
  /** Change given */
  change?: string;
}

/**
 * Electronic document configuration
 */
export interface EDocument {
  /** Transaction ID for electronic document */
  transactionId?: string;
  /** Protocol used for e-document */
  protocol?: string;
  /** Print and send mode */
  printSendMode?: string;
}

/**
 * Buyer information
 */
export interface Buyer {
  /** Buyer's name */
  name?: string;
  /** ID type */
  idType?: string;
  /** ID value */
  id?: string;
  /** Label type */
  labelType?: string;
  /** Address lines */
  address?: string[];
  /** Tax identification number (NIP) */
  nip?: string;
  /** Electronic document settings */
  eDocument?: EDocument;
}

/**
 * System number with print format
 */
export interface SystemNumberWithFormat {
  /** How to print the system number */
  print_as: 'text' | 'barcode' | 'qrcode';
  /** System number value */
  value: string;
}

/**
 * System information for the fiscal printer
 */
export interface SystemInfo {
  /** Cashier's name */
  cashierName?: string;
  /** Cash register number */
  cashNumber?: string;
  /** System number (can be string or object with print format) */
  systemNumber?: string | SystemNumberWithFormat;
}

/**
 * Device control settings
 */
export interface DeviceControl {
  /** Open cash drawer after printing */
  openDrawer?: boolean;
  /** Feed paper after printout */
  feedAfterPrintout?: boolean;
  /** Paper cut mode */
  paperCut?: PaperCut;
}

/**
 * Transaction side (buyer/seller/recipient)
 */
export interface TransactionSide {
  /** Name of the party */
  name?: string;
  /** Print information mode */
  printInfo?: PrintInfo;
}

/**
 * Additional information for invoices
 */
export interface AdditionalInfo {
  /** Text to display */
  text?: string;
  /** Bold text */
  bold?: boolean;
  /** Text justification */
  justification?: Justification;
}

/**
 * Error information from API
 */
export interface ApiError {
  /** Error code */
  code: number;
  /** Error description */
  description: string;
}

/**
 * Base request information
 */
export interface RequestInfo {
  /** Request status */
  status: string;
  /** Request ID */
  id: string;
  /** E-document reference */
  eDocument?: string;
  /** JPK ID */
  jpkId?: number;
  /** Error information if present */
  error?: ApiError;
}

/**
 * Device status information
 */
export interface DeviceInfo {
  /** Device status */
  status: string;
  /** Error information if present */
  error?: ApiError;
}

