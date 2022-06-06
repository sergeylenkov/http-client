export enum HttpStatus {
  Ok = 200,
  Created = 201,
  Accepted = 202,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  PaymentRequired = 402,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Gone = 410,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
}

export function isSuccessful(status: HttpStatus): boolean {
  return status >= 200 && status < 300;
}

export function isRedirection(status: HttpStatus): boolean {
  return status >= 300 && status < 400;
}

export function isClientError(status: HttpStatus): boolean {
  return status >= 400 && status < 500;
}

export function isServerError(status: HttpStatus): boolean {
  return status >= 500 && status < 600;
}

export function isAuthError(status: HttpStatus): boolean {
  return status === HttpStatus.Unauthorized || status === HttpStatus.Forbidden;
}
