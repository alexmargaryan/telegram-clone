export type ApiError = {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  type?: string;
};
