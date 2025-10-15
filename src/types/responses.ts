import { RequestInfo, DeviceInfo, ApiError } from './common';

/**
 * Token response
 */
export interface TokenResponse {
  /** Authentication token */
  token: string;
  /** Token expiration date (ISO 8601) */
  expirationDate: string;
}

/**
 * Queue status response
 */
export interface QueueResponse {
  /** Number of requests in queue */
  requestsInQueue: number;
}

/**
 * Delete queue response
 */
export interface DeleteQueueResponse {
  /** Operation status */
  status: string;
}

/**
 * Send document response
 */
export interface SendDocumentResponse {
  /** Request information */
  request: RequestInfo;
}

/**
 * Confirm document response
 */
export interface ConfirmDocumentResponse {
  /** Request information */
  request: RequestInfo;
}

/**
 * Check document status response
 */
export interface CheckDocumentStatusResponse {
  /** Device information */
  device: DeviceInfo;
  /** Request information */
  request: RequestInfo;
}

/**
 * Delete document response
 */
export interface DeleteDocumentResponse {
  /** Request information */
  request: RequestInfo;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  /** Exception details */
  exception: ApiError;
}


