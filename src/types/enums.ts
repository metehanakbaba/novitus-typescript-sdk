/**
 * VAT rate categories for Polish fiscal printers
 * @see https://www.posnet.com.pl/gdzie-kupic
 */
export enum VATRate {
  A = 'A', // 23%
  B = 'B', // 8%
  C = 'C', // 5%
  D = 'D', // 0%
  E = 'E', // Exempt
  F = 'F', // Not subject to VAT
  G = 'G', // Special
}

/**
 * Payment methods supported by the fiscal printer
 */
export enum PaymentMethod {
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

/**
 * Text justification options for printouts
 */
export enum Justification {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

/**
 * Print info options for transaction sides
 */
export enum PrintInfo {
  PlaceForSignature = 'place_for_signature',
  NameAndPlaceForSignature = 'name_and_place_for_signature',
  None = 'none',
}

/**
 * Paper cut modes
 */
export enum PaperCut {
  Full = 'full',
  Partial = 'partial',
  None = 'none',
}

/**
 * Document request status
 */
export enum RequestStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Error = 'error',
  Cancelled = 'cancelled',
}

/**
 * Unit types for items
 */
export enum Unit {
  Piece = 'szt',
  Kilogram = 'kg',
  Liter = 'l',
  Meter = 'm',
  SquareMeter = 'm2',
  CubicMeter = 'm3',
}


