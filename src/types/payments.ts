import { PaymentMethod } from './enums';

/**
 * Cash payment
 */
export interface Cash {
  /** Payment value (required) */
  value: string;
}

/**
 * Typical payment method (card, transfer, etc.)
 */
export interface TypicalPayment {
  /** Payment method name */
  name?: PaymentMethod;
  /** Payment value (required) */
  value: string;
}

/**
 * Currency payment
 */
export interface Currency {
  /** Exchange rate (required) */
  course: string;
  /** Value in foreign currency (required) */
  currencyValue: string;
  /** Value in local currency (required) */
  localValue: string;
  /** Is this change */
  isChange: boolean;
  /** Currency name (required) */
  name: string;
}

/**
 * Union type for all payment types
 */
export type PaymentType =
  | { cash: Cash }
  | { card: TypicalPayment }
  | { cheque: TypicalPayment }
  | { coupon: TypicalPayment }
  | { other: TypicalPayment }
  | { credit: TypicalPayment }
  | { account: TypicalPayment }
  | { transfer: TypicalPayment }
  | { mobile: TypicalPayment }
  | { voucher: TypicalPayment }
  | { currency: Currency };


