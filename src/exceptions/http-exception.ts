import { HttpError } from 'routing-controllers';

export class HttpException extends HttpError {
  public status: number;
  public message: string;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(status, message);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
