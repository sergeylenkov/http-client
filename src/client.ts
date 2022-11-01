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
import { BodyType, CacheData } from './types';

export class HttpClient {
  private _url: string;
  private _headers: Map<string, string>;
  private _cache: Map<string, CacheData>;

  constructor(url?: string) {
    this._url = url || '';
    this._headers = new Map();
    this._cache = new Map();
  }

  public set url(url: string) {
    this._url = url;
  }

  public get url(): string {
    return this._url;
  }

  public setHeader(key: string, value: string): void {
    this._headers.set(key, value);
  }

  private getHeaders(): HeadersInit {
    return Object.fromEntries(this._headers);
  }

  public setCache(path: string, data: unknown, lifetime: number) {
    this._cache.set(path, {
      expired: Date.now() + lifetime * 1000,
      data
    });
  }

  public getCache(path: string): unknown | undefined {
    const cache = this._cache.get(path);

    if (cache) {
      if (Date.now() >= cache.expired) {
        this._cache.delete(path);
        return undefined;
      }

      return cache.data;
    }

    return undefined;
  }

  public clearCache() {
    this._cache.clear();
  }

  private getBody(value: BodyType): BodyInit {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }

  private async request(url: string, request: RequestInit): Promise<Response> {
    try {
      const headers = {...request.headers, ...this.getHeaders()};
      request.headers = headers;

      const response = await fetch(url, request);

      if (isSuccessful(response.status)) {
        return response;
      } else if (isAuthError(response.status)) {
        throw new HttpAuthorizationException(
          response.status,
          response.statusText,
          response
        );
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
    headers?: Map<string, string>
  ): Promise<Response> {
    const request: RequestInit = {
      method: 'GET',
    };

    if (headers) {
      request.headers = Object.fromEntries(headers);
    }

    return this.request(`${this._url}/${path}`, request);
  }

  public async post(path: string, body: BodyType, headers?: Map<string, string>): Promise<Response> {
    const request: RequestInit = {
      method: 'POST',
      body: this.getBody(body)
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public async put(path: string, body: BodyType, headers?: Map<string, string>): Promise<Response> {
    const request: RequestInit = {
      method: 'PUT',
      body: this.getBody(body)
    };

    if (headers) {
      request.headers = Object.fromEntries(headers);
    }

    return this.request(`${this._url}/${path}`, request);
  }

  public async patch(path: string, body: BodyType, headers?: Map<string, string>): Promise<Response> {
    const request: RequestInit = {
      method: 'PATCH',
      body: this.getBody(body)
    };

    if (headers) {
      request.headers = Object.fromEntries(headers);
    }

    return this.request(`${this._url}/${path}`, request);
  }

  public delete(path: string, headers?: Map<string, string>): Promise<Response> {
    const request: RequestInit = {
      method: 'DELETE',
    };

    if (headers) {
      request.headers = Object.fromEntries(headers);
    }

    return this.request(`${this._url}/${path}`, request);
  }
}