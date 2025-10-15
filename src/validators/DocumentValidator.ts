import { NovitusValidationError } from '../errors/NovitusError';
import {
  Receipt,
  Invoice,
  Printout,
  Article,
  Advance,
  AdvanceReturn,
  Container,
  ContainerReturn,
  Cash,
  TypicalPayment,
  Currency,
  TextLine,
  PrintoutLine,
  TransactionSide,
  VATRate,
  PaymentMethod,
  PrintInfo,
} from '../types';

/**
 * Validator for documents and their components
 */
export class DocumentValidator {
  /**
   * Validate a receipt
   */
  static validateReceipt(receipt: Receipt): void {
    if (!receipt.items || receipt.items.length === 0) {
      throw new NovitusValidationError('Items are required', 'items');
    }

    if (!receipt.summary?.total) {
      throw new NovitusValidationError('Summary.total is required', 'summary.total');
    }

    // Validate items
    receipt.items.forEach((item, index) => {
      this.validateItem(item, `items[${index}]`);
    });

    // Validate payments if present
    receipt.payments?.forEach((payment, index) => {
      this.validatePayment(payment, `payments[${index}]`);
    });

    // Validate printout lines if present
    receipt.printoutLines?.forEach((line, index) => {
      this.validatePrintoutLine(line, `printoutLines[${index}]`);
    });
  }

  /**
   * Validate an invoice
   */
  static validateInvoice(invoice: Invoice): void {
    if (!invoice.info?.number) {
      throw new NovitusValidationError('Info.number is required', 'info.number');
    }

    if (!invoice.items || invoice.items.length === 0) {
      throw new NovitusValidationError('Items are required', 'items');
    }

    if (!invoice.summary?.total) {
      throw new NovitusValidationError('Summary.total is required', 'summary.total');
    }

    if (!invoice.buyer?.name && !invoice.buyer?.nip) {
      throw new NovitusValidationError(
        'Buyer.name or buyer.nip is required',
        'buyer.name|buyer.nip'
      );
    }

    // Validate items
    invoice.items.forEach((item, index) => {
      this.validateItem(item, `items[${index}]`);
    });

    // Validate payments if present
    invoice.payments?.forEach((payment, index) => {
      this.validatePayment(payment, `payments[${index}]`);
    });

    // Validate recipient if present
    if (invoice.recipient) {
      this.validateTransactionSide(invoice.recipient, 'recipient');
    }

    // Validate seller if present
    if (invoice.seller) {
      this.validateTransactionSide(invoice.seller, 'seller');
    }
  }

  /**
   * Validate a printout
   */
  static validatePrintout(printout: Printout): void {
    if (!printout.lines || printout.lines.length === 0) {
      throw new NovitusValidationError('Lines are required', 'lines');
    }

    printout.lines.forEach((line, index) => {
      this.validatePrintoutLine(line, `lines[${index}]`);
    });
  }

  /**
   * Validate an item
   */
  private static validateItem(item: any, fieldPath: string): void {
    if ('article' in item) {
      this.validateArticle(item.article, `${fieldPath}.article`);
    } else if ('advance' in item) {
      this.validateAdvance(item.advance, `${fieldPath}.advance`);
    } else if ('advanceReturn' in item) {
      this.validateAdvanceReturn(item.advanceReturn, `${fieldPath}.advanceReturn`);
    } else if ('container' in item) {
      this.validateContainer(item.container, `${fieldPath}.container`);
    } else if ('containerReturn' in item) {
      this.validateContainerReturn(item.containerReturn, `${fieldPath}.containerReturn`);
    } else {
      throw new NovitusValidationError('Unknown item type', fieldPath);
    }
  }

  /**
   * Validate an article
   */
  private static validateArticle(article: Article, fieldPath: string): void {
    if (!article.name) {
      throw new NovitusValidationError('Name is required', `${fieldPath}.name`);
    }

    if (!Object.values(VATRate).includes(article.ptu)) {
      throw new NovitusValidationError(
        'PTU must be one of: A, B, C, D, E, F, G',
        `${fieldPath}.ptu`
      );
    }

    if (!article.quantity) {
      throw new NovitusValidationError('Quantity is required', `${fieldPath}.quantity`);
    }

    if (!article.price) {
      throw new NovitusValidationError('Price is required', `${fieldPath}.price`);
    }

    if (!article.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }

    // Validate value = price * quantity
    const quantity = parseFloat(article.quantity);
    const price = parseFloat(article.price);
    const value = parseFloat(article.value);

    if (isNaN(quantity) || isNaN(price) || isNaN(value)) {
      throw new NovitusValidationError(
        'Quantity, price, and value must be valid numbers',
        fieldPath
      );
    }

    const expectedValue = (price * quantity).toFixed(2);
    const actualValue = value.toFixed(2);

    if (expectedValue !== actualValue) {
      throw new NovitusValidationError(
        `Value must equal price * quantity (expected: ${expectedValue}, got: ${actualValue})`,
        `${fieldPath}.value`
      );
    }
  }

  /**
   * Validate an advance
   */
  private static validateAdvance(advance: Advance, fieldPath: string): void {
    if (!advance.description) {
      throw new NovitusValidationError('Description is required', `${fieldPath}.description`);
    }

    if (!Object.values(VATRate).includes(advance.ptu)) {
      throw new NovitusValidationError(
        'PTU must be one of: A, B, C, D, E, F, G',
        `${fieldPath}.ptu`
      );
    }

    if (!advance.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }
  }

  /**
   * Validate an advance return
   */
  private static validateAdvanceReturn(advanceReturn: AdvanceReturn, fieldPath: string): void {
    if (!advanceReturn.description) {
      throw new NovitusValidationError('Description is required', `${fieldPath}.description`);
    }

    if (!Object.values(VATRate).includes(advanceReturn.ptu)) {
      throw new NovitusValidationError(
        'PTU must be one of: A, B, C, D, E, F, G',
        `${fieldPath}.ptu`
      );
    }

    if (!advanceReturn.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }
  }

  /**
   * Validate a container
   */
  private static validateContainer(container: Container, fieldPath: string): void {
    if (!container.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }
  }

  /**
   * Validate a container return
   */
  private static validateContainerReturn(
    containerReturn: ContainerReturn,
    fieldPath: string
  ): void {
    if (!containerReturn.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }
  }

  /**
   * Validate a payment
   */
  private static validatePayment(payment: any, fieldPath: string): void {
    if ('cash' in payment) {
      this.validateCash(payment.cash, `${fieldPath}.cash`);
    } else if ('currency' in payment) {
      this.validateCurrency(payment.currency, `${fieldPath}.currency`);
    } else {
      // Typical payment (card, transfer, etc.)
      const paymentType = Object.keys(payment)[0];
      this.validateTypicalPayment(payment[paymentType], `${fieldPath}.${paymentType}`);
    }
  }

  /**
   * Validate cash payment
   */
  private static validateCash(cash: Cash, fieldPath: string): void {
    if (!cash.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }
  }

  /**
   * Validate typical payment
   */
  private static validateTypicalPayment(payment: TypicalPayment, fieldPath: string): void {
    if (!payment.value) {
      throw new NovitusValidationError('Value is required', `${fieldPath}.value`);
    }

    if (payment.name && !Object.values(PaymentMethod).includes(payment.name)) {
      throw new NovitusValidationError(
        'Name must be one of: card, cheque, coupon, other, credit, account, transfer, mobile, voucher',
        `${fieldPath}.name`
      );
    }
  }

  /**
   * Validate currency payment
   */
  private static validateCurrency(currency: Currency, fieldPath: string): void {
    if (!currency.course) {
      throw new NovitusValidationError('Course is required', `${fieldPath}.course`);
    }

    if (!currency.currencyValue) {
      throw new NovitusValidationError('CurrencyValue is required', `${fieldPath}.currencyValue`);
    }

    if (!currency.localValue) {
      throw new NovitusValidationError('LocalValue is required', `${fieldPath}.localValue`);
    }

    if (!currency.name) {
      throw new NovitusValidationError('Name is required', `${fieldPath}.name`);
    }
  }

  /**
   * Validate a printout line
   */
  private static validatePrintoutLine(line: any, fieldPath: string): void {
    if ('printoutLine' in line) {
      this.validateSimplePrintoutLine(line.printoutLine, `${fieldPath}.printoutLine`);
    } else if ('textLine' in line) {
      this.validateTextLine(line.textLine, `${fieldPath}.textLine`);
    } else {
      throw new NovitusValidationError('Unknown printout line type', fieldPath);
    }
  }

  /**
   * Validate a simple printout line
   */
  private static validateSimplePrintoutLine(line: PrintoutLine, fieldPath: string): void {
    if (!line.text) {
      throw new NovitusValidationError('Text is required', `${fieldPath}.text`);
    }
  }

  /**
   * Validate a text line
   */
  private static validateTextLine(line: TextLine, fieldPath: string): void {
    if (!line.text) {
      throw new NovitusValidationError('Text is required', `${fieldPath}.text`);
    }

    if (line.fontNumber !== undefined && (line.fontNumber < 1 || line.fontNumber > 3)) {
      throw new NovitusValidationError(
        'FontNumber must be between 1 and 3',
        `${fieldPath}.fontNumber`
      );
    }

    if (line.height !== undefined && line.height < 0) {
      throw new NovitusValidationError(
        'Height must be a positive number',
        `${fieldPath}.height`
      );
    }

    if (line.width !== undefined && line.width < 0) {
      throw new NovitusValidationError('Width must be a positive number', `${fieldPath}.width`);
    }
  }

  /**
   * Validate transaction side
   */
  private static validateTransactionSide(side: TransactionSide, fieldPath: string): void {
    if (
      side.printInfo &&
      !Object.values(PrintInfo).includes(side.printInfo as unknown as PrintInfo)
    ) {
      throw new NovitusValidationError(
        'PrintInfo must be one of: place_for_signature, name_and_place_for_signature, none',
        `${fieldPath}.printInfo`
      );
    }
  }
}
