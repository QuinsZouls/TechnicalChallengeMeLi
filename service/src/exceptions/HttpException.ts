export class HttpException extends Error {
  public status: number;
  public message: string;
  public details?: any;
  public code?: string;

  constructor(status: number, message: string, code?: string, details?: any[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.code = code;
    this.details = details;
  }
}
