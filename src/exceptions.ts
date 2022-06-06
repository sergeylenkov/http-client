import { Response } from 'node-fetch';

export class HttpException {
  public status: number;
  public message: string;
  public response?: Response;

  constructor(status: number, message: string, response?: Response) {
    this.status = status;
    this.message = message;
    this.response = response;
  }
}

export class HttpNetworkException extends HttpException {}
export class HttpClientException extends HttpException {}
export class HttpServerException extends HttpException {}
export class HttpAuthorizationException extends HttpException {}
export class HttpUnknowException extends HttpException {}
