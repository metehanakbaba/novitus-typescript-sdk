/**
 * Printout line (simple text)
 */
export interface PrintoutLine {
  /** Text to print (required) */
  text: string;
  /** Mask text for privacy */
  masked: boolean;
}

/**
 * Formatted text line with styling options
 */
export interface TextLine {
  /** Bold text */
  bold?: boolean;
  /** Inverse colors */
  invers?: boolean;
  /** Center alignment */
  center?: boolean;
  /** Font number (1-3) */
  fontNumber?: number;
  /** Big text */
  big?: boolean;
  /** Text height */
  height?: number;
  /** Text width */
  width?: number;
  /** Text to print (required) */
  text: string;
  /** Mask text for privacy */
  masked: boolean;
}

/**
 * QR Code line
 */
export interface QRCode {
  /** QR code content */
  text: string;
  /** Mask for privacy */
  masked: boolean;
}

/**
 * Barcode line
 */
export interface Barcode {
  /** Barcode content */
  text: string;
  /** Mask for privacy */
  masked: boolean;
}

/**
 * Special line types
 */
export interface SpecialLine {
  /** Type of special line */
  type: 'underline' | 'last_receipt_number' | 'double_line' | 'single_line';
}

/**
 * Union type for printout lines
 */
export type PrintoutLineType =
  | { printoutLine: PrintoutLine }
  | { textLine: TextLine }
  | { qrcode: QRCode }
  | { barcode: Barcode }
  | { special_line: SpecialLine };

