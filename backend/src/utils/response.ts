import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

// ─── Uniform API Response Builder ─────────────────────────────────────────────
// Every response from this API — success or failure — uses these helpers to
// maintain a consistent shape: { success, message, data?, error? }
//
// This makes the frontend's job simple: always check response.data.success.

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  error?: string,
  statusCode = 500
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  res.status(statusCode).json(response);
};
