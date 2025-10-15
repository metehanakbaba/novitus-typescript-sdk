import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  TokenResponse,
  QueueResponse,
  DeleteQueueResponse,
  SendDocumentResponse,
  CheckDocumentStatusResponse,
  DeleteDocumentResponse,
  ErrorResponse,
  Receipt,
  Invoice,
  Printout,
} from '../types';
import {
  NovitusApiError,
  NovitusNetworkError,
  NovitusValidationError,
} from '../errors';
import { DocumentValidator } from '../validators';

/**
 * Configuration options for NovitusClient
 */
export interface NovitusClientConfig {
  /** Base URL of the Novitus API (e.g., "http://localhost:8888") */
  host: string;
  /** Optional authentication token. If not provided, will be obtained automatically */
  token?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Main client for interacting with Novitus Fiscal Printer API
 */
export class NovitusClient {
  private readonly host: string;
  private token: string = '';
  private tokenExpirationDate: number = 0;
  private readonly httpClient: AxiosInstance;

  /**
   * Creates a new NovitusClient instance
   * @param config - Client configuration
   */
  constructor(config: NovitusClientConfig) {
    this.host = config.host.replace(/\/$/, ''); // Remove trailing slash

    this.httpClient = axios.create({
      baseURL: this.host,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config.token) {
      this.token = config.token;
    }
  }

  /**
   * Initialize the client (obtain token if not provided)
   */
  async initialize(): Promise<void> {
    if (!this.token) {
      await this.obtainToken();
    }
  }

  /**
   * Obtain a new authentication token
   * @returns Token response with token and expiration date
   */
  async obtainToken(): Promise<TokenResponse> {
    try {
      const response = await this.httpClient.get<TokenResponse>('/api/v1/token');
      const tokenResponse = response.data;

      const expirationDate = new Date(tokenResponse.expirationDate);
      this.tokenExpirationDate = expirationDate.getTime();
      this.token = tokenResponse.token;

      return tokenResponse;
    } catch (error) {
      throw this.handleError(error, 'Failed to obtain token');
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<void> {
    try {
      const response = await this.httpClient.patch<TokenResponse>(
        '/api/v1/token',
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      const tokenResponse = response.data;
      const expirationDate = new Date(tokenResponse.expirationDate);
      this.tokenExpirationDate = expirationDate.getTime();
      this.token = tokenResponse.token;
    } catch (error) {
      throw this.handleError(error, 'Failed to refresh token');
    }
  }

  /**
   * Refresh token if needed (expired or about to expire)
   */
  private async refreshIfNeeded(): Promise<void> {
    if (!this.token) {
      await this.obtainToken();
      return;
    }

    const currentTime = Date.now();

    // Token expired, try to refresh
    if (currentTime >= this.tokenExpirationDate) {
      try {
        await this.refreshToken();
      } catch {
        // If refresh fails, obtain a new token
        await this.obtainToken();
      }
      return;
    }

    // Token expires in less than 5 minutes, refresh proactively
    const fiveMinutesInMs = 5 * 60 * 1000;
    if (this.tokenExpirationDate - currentTime < fiveMinutesInMs) {
      await this.refreshToken();
    }
  }

  /**
   * Get queue status
   * @returns Queue status response
   */
  async getQueueStatus(): Promise<QueueResponse> {
    await this.refreshIfNeeded();

    try {
      const response = await this.httpClient.get<QueueResponse>('/api/v1/queue', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to get queue status');
    }
  }

  /**
   * Delete the entire queue
   * @returns Delete queue response
   */
  async deleteQueue(): Promise<DeleteQueueResponse> {
    await this.refreshIfNeeded();

    try {
      const response = await this.httpClient.delete<DeleteQueueResponse>('/api/v1/queue', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete queue');
    }
  }

  /**
   * Confirm a document request
   * @param objectType - Type of document (receipt, invoice, nf_printout)
   * @param requestId - Request ID
   * @returns Send document response
   */
  async confirm(objectType: string, requestId: string): Promise<SendDocumentResponse> {
    await this.refreshIfNeeded();

    try {
      const response = await this.httpClient.put<SendDocumentResponse>(
        `/api/v1/${objectType}/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to confirm document');
    }
  }

  /**
   * Send a document to the fiscal printer
   * @param documentType - Type of document (receipt, invoice, nf_printout)
   * @param document - Document to send
   * @returns Send document response
   */
  async sendDocument(
    documentType: string,
    document: Receipt | Invoice | Printout | any
  ): Promise<SendDocumentResponse> {
    // Validate document (skip validation for nf_printout as API expects different format)
    if (documentType !== 'nf_printout') {
      if ('items' in document && 'summary' in document && !('info' in document)) {
        DocumentValidator.validateReceipt(document as Receipt);
      } else if ('info' in document) {
        DocumentValidator.validateInvoice(document as Invoice);
      } else if ('lines' in document) {
        DocumentValidator.validatePrintout(document as Printout);
      }
    }

    await this.refreshIfNeeded();

    try {
      const body: Record<string, any> = {};
      if (documentType === 'nf_printout') {
        body.printout = document;
      } else {
        body[documentType] = document;
      }

      const response = await this.httpClient.post<SendDocumentResponse>(
        `/api/v1/${documentType}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to send document');
    }
  }

  /**
   * Check document status
   * @param objectType - Type of document (receipt, invoice, nf_printout)
   * @param requestId - Request ID
   * @returns Check document status response
   */
  async checkDocumentStatus(
    objectType: string,
    requestId: string
  ): Promise<CheckDocumentStatusResponse> {
    await this.refreshIfNeeded();

    try {
      const response = await this.httpClient.get<CheckDocumentStatusResponse>(
        `/api/v1/${objectType}/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to check document status');
    }
  }

  /**
   * Delete a document
   * @param objectType - Type of document (receipt, invoice, nf_printout)
   * @param requestId - Request ID
   * @returns Delete document response
   */
  async deleteDocument(objectType: string, requestId: string): Promise<DeleteDocumentResponse> {
    await this.refreshIfNeeded();

    try {
      const response = await this.httpClient.delete<DeleteDocumentResponse>(
        `/api/v1/${objectType}/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete document');
    }
  }

  /**
   * Send a receipt
   * @param receipt - Receipt to send
   * @param confirm - Automatically confirm the receipt
   * @returns Check document status response
   */
  async sendReceipt(
    receipt: Receipt,
    confirm: boolean = false
  ): Promise<CheckDocumentStatusResponse> {
    const sendResponse = await this.sendDocument('receipt', receipt);

    if (confirm) {
      await this.confirm('receipt', sendResponse.request.id);
    }

    return this.checkDocumentStatus('receipt', sendResponse.request.id);
  }

  /**
   * Send an invoice
   * @param invoice - Invoice to send
   * @param confirm - Automatically confirm the invoice
   * @returns Check document status response
   */
  async sendInvoice(
    invoice: Invoice,
    confirm: boolean = false
  ): Promise<CheckDocumentStatusResponse> {
    const sendResponse = await this.sendDocument('invoice', invoice);

    if (confirm) {
      await this.confirm('invoice', sendResponse.request.id);
    }

    return this.checkDocumentStatus('invoice', sendResponse.request.id);
  }

  /**
   * Send a non-fiscal printout
   * @param printout - Printout to send
   * @param confirm - Automatically confirm the printout
   * @returns Check document status response
   */
  async sendNFPrintout(
    printout: Printout,
    confirm: boolean = false
  ): Promise<CheckDocumentStatusResponse> {
    const sendResponse = await this.sendDocument('nf_printout', printout);

    if (confirm) {
      await this.confirm('nf_printout', sendResponse.request.id);
    }

    return this.checkDocumentStatus('nf_printout', sendResponse.request.id);
  }

  /**
   * Handle errors from API requests
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;

        if (errorData?.exception) {
          return new NovitusApiError(
            errorData.exception.description || defaultMessage,
            axiosError.response.status,
            errorData.exception.code,
            errorData.exception.description
          );
        }

        return new NovitusApiError(
          `${defaultMessage}: ${axiosError.response.statusText}`,
          axiosError.response.status
        );
      }

      if (axiosError.request) {
        return new NovitusNetworkError(
          `${defaultMessage}: No response received from server`,
          axiosError
        );
      }
    }

    if (error instanceof NovitusValidationError) {
      return error;
    }

    if (error instanceof Error) {
      return new NovitusNetworkError(`${defaultMessage}: ${error.message}`, error);
    }

    return new NovitusNetworkError(defaultMessage);
  }
}

