import {
  isSuccessful,
  isClientError,
  isServerError,
  isAuthError,
} from './statuses';
import {
  HttpClientException,
  HttpNetworkException,
  HttpServerException,
  HttpUnknowException,
  HttpAuthorizationException,
  HttpException,
} from './exceptions';
import { Dictionary } from './types';
import fetch, { RequestInit, Response, HeadersInit } from 'node-fetch';

export class HttpClient {
  private _url: string;
  private _headers: Dictionary<string>;

  constructor(url?: string) {
    this._url = url || '';
    this._headers = {};
  }

  public setContentType(contentType: string): void {
    this._headers['Content-Type'] = contentType;
  }

  public setCustomHeader(key: string, value: string): void {
    this._headers[key] = value;
  }

  private getHeaders(): HeadersInit {
    return this._headers;
  }

  private async request(url: string, request: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, request);

      if (isSuccessful(response.status)) {
        return response;
      } else if (isClientError(response.status)) {
        throw new HttpClientException(
          response.status,
          response.statusText,
          response
        );
      } else if (isServerError(response.status)) {
        throw new HttpServerException(
          response.status,
          response.statusText,
          response
        );
      } else if (isAuthError(response.status)) {
        throw new HttpAuthorizationException(
          response.status,
          response.statusText,
          response
        );
      }

      throw new HttpUnknowException(
        response.status,
        response.statusText,
        response
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpNetworkException(0, 'Network error');
      }
    }
  }

  public async get(
    path: string,
    params?: Dictionary<string>
  ): Promise<Response> {
    const request: RequestInit = {
      method: 'GET',
      headers: this.getHeaders(),
    };

    let queryParams = '';

    if (params) {
      queryParams = '?';

      Object.keys(params).forEach((key) => {
        queryParams = queryParams + `${key}=${params[key]}&`;
      });

      queryParams = queryParams.slice(0, -1);
    }

    return this.request(`${this._url}/${path}${queryParams}`, request);
  }

  public async post(path: string, params: unknown): Promise<Response> {
    const request: RequestInit = {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public async put(path: string, params: unknown): Promise<Response> {
    const request: RequestInit = {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public async patch(path: string, params: unknown): Promise<Response> {
    const request: RequestInit = {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public delete(path: string): Promise<Response> {
    const request: RequestInit = {
      method: 'DELETE',
      headers: this.getHeaders(),
    };

    return this.request(`${this._url}/${path}`, request);
  }
}
